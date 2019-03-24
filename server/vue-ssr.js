const fs = require('fs');
const path = require('path');
const vueServerRender = require('vue-server-renderer');


function getRouter (options) {
    const bundlePath = options.bundlePath;
    if (!bundlePath) {
        throw new Error('options.bundlePath "' + bundlePath + '" is not available');
    }

    const CACHE = {
        map: {},
        timeMap: {},
        set (key, value, time) {
            this.map[key] = value;
            let t = parseInt(time || 0) || 0;
            this.timeMap[key] = Date.now() + t;
        },
        get (key) {
            const now = Date.now();
            if (this.map[key]) {
                const t = parseFloat(this.timeMap[key]);
                if (t > now) {
                    return Promise.resolve(this.map[key]);
                }
            }
            return Promise.resolve(null);
        }
    };

    const cachedRenderers = {};

    let cachedBundle = null;
    /**
     * 获取bundle
     */
    function getBundle () {
        if (cachedBundle) {
            return cachedBundle;
        }

        const jsonPath = path.join(bundlePath, 'vue-ssr-server-bundle.json');
        if (!fs.existsSync(jsonPath)) {
            throw new Error(`file: '${jsonPath}' is not exists`);
        }
        const serverBundle = JSON.parse(fs.readFileSync(jsonPath).toString());
        if (options.cacheRenderer) {
            cachedBundle = serverBundle;
        }
        return serverBundle;
    }

    function getRenderer (pagePathArg) {
        const pagePath = pagePathArg.replace(/^\/+/, '');

        if (cachedRenderers[pagePath]) {
            return cachedRenderers[pagePath];
        }

        let templatePath = path.join(bundlePath, 'template.html');

        const custTemplatePath = path.join(bundlePath, 'templates', `${pagePath}.html`);
        if (fs.existsSync(custTemplatePath)) {
            templatePath = custTemplatePath;
        } else if (!fs.existsSync(templatePath)) {
            throw new Error(`file: '${templatePath}' is not exists`);
        }

        const serverBundle = getBundle();
        const template = fs.readFileSync(templatePath).toString();
        
        const renderer = vueServerRender.createBundleRenderer(serverBundle, {
            runInNewContext: false, // 推荐
            template, // （可选）页面模板
            // clientManifest // （可选）客户端构建 manifest
        });

        if (options.cacheRenderer) {
            cachedRenderers[pagePath] = renderer;
        }
        
        return renderer;
    }




    function middleWare (req, res, next) {
        /**
         * 绑定一个ssrRender的函数到response对象上
         */
        const serverOrigin = `http://127.0.0.1:${options.app.get('port')}`;

        res.ssrRender = function (pagePath, params = {}, cacheOptions) {
            let useCache = false;
            let cacheKey = '';
            let cacheTime = 0;
            if (cacheOptions) {
                useCache = true;
                cacheKey = cacheOptions.key || '';
                cacheTime = cacheOptions.time || 1000 * 60; // 默认缓存1分钟
            }

            const key = `${pagePath}::${cacheKey}`;

            function render () {
                const renderer = getRenderer(pagePath || '');
                let ignoreByNext = false;
                const context = {
                    req,
                    res,
                    next (...args) {
                        ignoreByNext = true;
                        req.next(...args);
                    },
                    params,
                    serverOrigin,
                    page: pagePath
                };
                renderer.renderToString(context, (err, html) => {
                    if (ignoreByNext) {
                        return;
                    }
                    if (err) {
                        return req.next(err);
                    }
                    res.end(html);
                    if (useCache) {
                        CACHE.set(key, html, cacheTime);
                    }
                });
            }
            
            if (useCache) {
                CACHE.get(key, cacheTime).then((result) => {
                    if (result) {
                        return res.end(result);
                    }
                    render();
                }).catch(next);
            } else {
                render();
            }
        };
        next();
    }

    return middleWare;
}

module.exports = getRouter;
