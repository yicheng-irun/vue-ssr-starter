
const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack-base-config.js');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const { srcRoot, distRoot, devServerPort, devNodeServerPort } = utils.configs;

const isProd = process.env.NODE_ENV == 'production';


function getConfig (chunk) {

    const config = webpackMerge(webpackBaseConfig.getConfig(), {
        entry: {
            app: path.join(srcRoot, `pages-ssr/${chunk}/entry-client.js`),
        },
        output: {
            path: path.join(distRoot, chunk),
            filename: '[name].js',
            publicPath: '/'
        },
        plugins: [
            new VueSSRClientPlugin({
                filename: 'vue-ssr-client-manifest.json'
            }),
            new HtmlWebpackPlugin({
                filename: path.join(distStaticPath, `${page}.html`),
                template: path.join(srcRoot, `pages-ssr/${chunk}/index.html`),
                inject: false,
                minify: isProd ? { collapseWhitespace: true, minifyJS: true } : false,
                hash: false,
            }),
        ],
    });

}


module.exports = {
    getConfig,
};
