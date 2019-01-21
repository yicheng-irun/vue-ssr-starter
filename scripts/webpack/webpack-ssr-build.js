const webpack = require('webpack');
const utils = require('../utils');
const createClientConfig = require('./webpack-ssr-client-config');
// const createServerConfig = require('./configs/create-server-config');

const isProd = process.env.NODE_ENV == 'production';


const configs = [];

const ssrPages = utils.getAllSSRPages();
ssrPages.forEach((chunk) => {

    configs.push(createClientConfig(chunk));
    // configs.push(createServerConfig({isProd, page: item}));
});


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


webpack(configs, (err, stats) => {
    printInfo(err, stats, isProd);
});
