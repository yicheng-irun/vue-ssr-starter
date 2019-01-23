const path = require('path');
const glob = require('glob');


const configs = {
    projRoot: path.resolve(__dirname, '../'),
    distRoot: path.resolve(__dirname, '../static/dist'),
    distBundleRoot: path.resolve(__dirname, '../static/dist-bundle'),
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

function printInfo (err, stats, isProd) {
    if (err) throw err;
    // production 模式下显示详细构建结果
    if (isProd) {
        console.log(stats.toString({
            assets: true,
            version: false,
            hash: false,
            colors: true,
            children: true,
            entrypoints: false,
            modules: false,
            chunks: false,
            chunkModules: false,
            timings: true,
        }));
    }
    // 显示 errors 和 warnings
    if (stats.hasErrors()) {
        stats.toJson().errors.forEach((e) => {
            console.error(e);
        });
    }
    if (stats.hasWarnings()) {
        stats.toJson().warnings.forEach((w) => {
            console.warn(w);
        });
    }
}

module.exports = {
    configs,
    getAllStaticPages,
    getAllSSRPages,
    printInfo
};
