
const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack-base-config.js');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const utils = require('../utils');
const { srcRoot, distBundleRoot } = utils.configs;

const isProd = process.env.NODE_ENV == 'production';

function getConfig (chunk) {

    const config = webpackMerge(webpackBaseConfig.getConfig(), {
        entry: {
            [chunk]: `${srcRoot}/pages/${chunk}/entry-server.js`,
        },
        output: {
            path: `${distBundleRoot}/${chunk}`,
            filename: 'assets/[name].js',
            libraryTarget: 'commonjs2',
            publicPath: '/'
        },
        plugins: [
            new VueSSRServerPlugin({
                filename: 'vue-ssr-server-bundle.json'
            }),
            new HtmlWebpackPlugin({
                filename: `${chunk}.html`,
                template: path.join(srcRoot, `pages/${chunk}/index.html`),
                // chunks: [chunk],
                
                // inject: false,
                minify: isProd ? { collapseWhitespace: true, minifyJS: true } : false,

                isProd: isProd,
                isDev: !isProd,
                isServer: true,
                isClient: false,
            }),
        ],
        target: 'node',
        watch: !isProd,
    });
    return config;
}


module.exports = getConfig;
