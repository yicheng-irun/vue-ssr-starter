const fs = require('fs');
const path = require('path');
const vueServerRender = require('vue-server-renderer');

const bundlePath = path.resolve(__dirname, '../static/dist-bundle');

const cachedRenderers = {};

function getRenderer (pagePath) {
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
    
    cachedRenderers[pagePath] = renderer;
    return renderer;
}



function middleWare (req, res, next) {
    /**
     * 
     */
    res.ssrRender = function (pagePath, params) {
        const renderer = getRenderer(pagePath);
        const context = {
            req,
            params
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


module.exports = middleWare;
