
const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack-base-config.js');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const utils = require('../utils');
const { srcRoot, distRoot, distBundleRoot } = utils.configs;

const isProd = process.env.NODE_ENV == 'production';


function getConfig () {

    const config = webpackMerge(webpackBaseConfig.getSSRConfig('Client'), {
        entry: {
            main: `${srcRoot}/entry-client.js`,
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
                    path.resolve(distBundleRoot, './vue-ssr-client-manifest.json'),
                )
            }),
            new HtmlWebpackPlugin({
                filename: 'template.html',
                template: `${srcRoot}/template.html`,
                chunks: ['main'],
                
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
