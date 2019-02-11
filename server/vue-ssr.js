const fs = require('fs');
const path = require('path');
const vueServerRender = require('vue-server-renderer');


function getRouter (options) {
    const bundlePath = options.bundlePath;
    if (!bundlePath) {
        throw new Error('options.bundlePath "' + bundlePath + '" is not available');
    }

    const cachedRenderers = {};

    function getRenderer (pagePathArg) {
        const pagePath = pagePathArg.replace(/^\/+/, '');

        if (cachedRenderers[pagePath]) {
            return cachedRenderers[pagePath];
        }

        const jsonPath = path.join(bundlePath, pagePath, 'vue-ssr-server-bundle.json');
        const templatePath = path.join(bundlePath, pagePath, 'template.html');
        if (!fs.existsSync(jsonPath)) {
            throw new Error(`file: '${jsonPath}' is not exists`);
        }
        if (!fs.existsSync(templatePath)) {
            throw new Error(`file: '${templatePath}' is not exists`);
        }

        const serverBundle = JSON.parse(fs.readFileSync(jsonPath).toString());
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

        res.ssrRender = function (pagePath, params, page) {
            const renderer = getRenderer(pagePath);
            const context = {
                req,
                params,
                serverOrigin,
                page,
            };
            renderer.renderToString(context, (err, html) => {
                if (err) {
                    return next(err);
                }
                // 处理异常……
                res.end(html);
            });
        };
        next();
    }

    return middleWare;
}

module.exports = getRouter;
