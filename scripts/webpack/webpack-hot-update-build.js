/**
 * @author ichengzhang
 * @since 20181214
 */
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackBaseConfig = require('./webpack-base-config.js');

const utils = require('../utils');
const { srcRoot, distRoot, devServerPort, devNodeServerPort } = utils.configs;


const isProd = process.env.NODE_ENV == 'production';


const entries = {};
const htmlWebpackPluginArray = [];

const staticPages = utils.getAllStaticPages();
staticPages.forEach((chunk) => {
    // if (isProd) {
    //     if (chunk.startsWith('index') || chunk.startsWith('test')) {
    //         return;
    //     }
    // }
    entries[chunk] = `${srcRoot}/pages/${chunk}/entry-client.js`;
    const filename = `${chunk}.html`;
    const htmlConf = {
        filename,
        template: `${srcRoot}/pages/${chunk}/index.html`,
        chunks: ['commons', chunk],

        isProd: isProd,
        isDev: !isProd,
        isServer: false,
        isClient: true,
    };
    htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf));
});

// const ssrPages = utils.getAllSSRPages();
// ssrPages.forEach((chunk) => {
//     const key = `ssr/${chunk}`;

//     entries[key] = `${srcRoot}/pages-ssr/${chunk}/entry-client.js`;
//     const filename = `ssr/${chunk}.html`;
//     const htmlConf = {
//         filename,
//         template: `${srcRoot}/pages-ssr/${chunk}/index.html`,
//         chunks: ['commons', key],
//         isProd: isProd,
//     };
//     htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf));
// });


const config = webpackMerge(webpackBaseConfig.getConfig('Hot Update Build'), {
    entry: entries,
    output: {
        path: distRoot,
        filename: 'assets/[name].js',
        publicPath: '/',
    },

    target: 'web',
    devServer: {
        hot: !isProd,
    },
});


config.plugins = [
    ...config.plugins,
    ...htmlWebpackPluginArray,
].concat(isProd ? [] : [new webpack.NamedModulesPlugin(), new webpack.HotModuleReplacementPlugin()]);

if (isProd) {
    delete config.devServer;
    webpack(config, utils.printInfo);
} else {
    const devServerOptions = {
        host: '0.0.0.0',
        port: devServerPort,
        historyApiFallback: false,
        noInfo: true,
        hot: true,
        allowedHosts: [
            'www.xiwnn.com',
            'xiwnn.com',
        ],
        open: false,
        openPage: 'index.html',
        before (app) {
            const logger = require('morgan');
            app.use(logger('dev'));

            process.env.NODE_SERVER_PORT = devNodeServerPort;
            require('../server-dev');
        },
        proxy: { // 全局代理到后端
            '/': `http://localhost:${devNodeServerPort}`
        },
    };

    WebpackDevServer.addDevServerEntrypoints(config, devServerOptions);

    const compiler = webpack(config);

    const server = new WebpackDevServer(compiler, devServerOptions);

    server.listen(devServerPort, '0.0.0.0', () => {
        console.log(`监听在${devServerPort}`);
    });
}
