const path = require('path');
const glob = require('glob');


const configs = {
    projRoot: path.resolve(__dirname, '../'),
    distRoot: path.resolve(__dirname, '../static/dist'),
    srcRoot: path.resolve(__dirname, '../static/src'),

    devServerPort: 10000, // 在开发模式下，http 静态资源服务监听的端口
    devNodeServerPort: 10001, // 在开发模式下，后台监听的端口
};

function getAllStaticPages () {
    const pages = glob.sync(`${configs.srcRoot}/pages/**/index.html`).map(page => page.replace(/^.*src\/pages\/(.*)\/index.html$/, '$1'));
    return pages;
}

function getAllSSRPages () {
    const pages = glob.sync(`${configs.srcRoot}/pages-ssr/**/index.html`).map(page => page.replace(/^.*src\/pages-ssr\/(.*)\/index.html$/, '$1'));
    return pages;
}

module.exports = {
    configs,
    getAllStaticPages,
    getAllSSRPages
};
