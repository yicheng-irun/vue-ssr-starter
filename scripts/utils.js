const path = require('path');
// const glob = require('glob');

let buildSettings = {};
try {
    buildSettings = require(path.join(process.cwd(), 'build-settings.js'));
} catch (e) {
    //
}

const projRoot = buildSettings.projRoot || process.cwd();

const configs = {
    projRoot,
    distRoot: buildSettings.distRoot || path.resolve(projRoot, './static/dist'),
    distBundleRoot: buildSettings.distBundleRoot || path.resolve(projRoot, './static/dist-bundle'),
    srcRoot: buildSettings.srcRoot || path.resolve(projRoot, './static/src'),

    devServerPort: buildSettings.devServerPort || 10000, // 在开发模式下，http 静态资源服务监听的端口
    devNodeServerPort: buildSettings.devNodeServerPort || 10001, // 在开发模式下，后台监听的端口
};

// function getAllStaticPages () {
//     const pages = glob.sync(`${configs.srcRoot}/pages/**/index.html`).map(page => page.replace(/^.*src\/pages\/(.*)\/index.html$/, '$1'));
//     return pages;
// }

// function getAllSSRPages () {
//     const pages = glob.sync(`${configs.srcRoot}/pages-ssr/**/index.html`).map(page => page.replace(/^.*src\/pages-ssr\/(.*)\/index.html$/, '$1'));
//     return pages;
// }

module.exports = {
    configs,
    // getAllStaticPages,
    // getAllSSRPages,
};
