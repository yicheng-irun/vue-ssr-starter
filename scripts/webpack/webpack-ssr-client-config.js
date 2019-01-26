
const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack-base-config.js');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const utils = require('../utils');
const { srcRoot, distRoot, distBundleRoot } = utils.configs;

const isProd = process.env.NODE_ENV == 'production';


function getConfig (chunk) {

    const config = webpackMerge(webpackBaseConfig.getConfig('Client ' + chunk), {
        entry: {
            [chunk]: `${srcRoot}/pages/${chunk}/entry-client.js`,
        },
        output: {
            path: distRoot,
            filename:'assets/[name].js',
            publicPath: '/'
        },
        plugins: [
            new VueSSRClientPlugin({
                filename: path.relative(
                    distRoot,
                    path.resolve(distBundleRoot, `./${chunk}/vue-ssr-client-manifest.json`),
                )
            }),
            new HtmlWebpackPlugin({
                filename: `${chunk}.html`,
                template: `${srcRoot}/pages/${chunk}/index.html`,
                chunks: [chunk],
                
                // inject: false,
                minify: isProd ? { collapseWhitespace: true, minifyJS: true } : false,

                isProd: isProd,
                isDev: !isProd,
                isServer: false,
                isClient: true,
            }),
        ],
        watch: !isProd,
    });

    return config;
}


module.exports = getConfig;
