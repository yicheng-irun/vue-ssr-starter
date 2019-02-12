const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const utils = require('../utils');
const createClientConfig = require('./webpack-ssr-client-config');
const createServerConfig = require('./webpack-ssr-server-config');

const isProd = process.env.NODE_ENV == 'production';

const { devServerPort, devNodeServerPort } = utils.configs;

const clientConfig = createClientConfig();
const serverConfig = createServerConfig();

const clientConfig2 = webpackMerge(clientConfig, {
    devServer: {
        hot: !isProd,
    },
});


clientConfig2.plugins = [
    ...clientConfig2.plugins,
].concat(isProd ? [] : [new webpack.NamedModulesPlugin(), new webpack.HotModuleReplacementPlugin()]);


if (isProd) {
    delete clientConfig2.devServer;
    webpack(clientConfig2, (err, stats) => {
        require('./print')(err, stats, isProd);
    });
} else {
    const devServerOptions = {
        host: '0.0.0.0',
        port: devServerPort,
        historyApiFallback: false,
        noInfo: true,
        hot: true,
        allowedHosts: [
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

    WebpackDevServer.addDevServerEntrypoints(clientConfig2, devServerOptions);

    const compiler = webpack(clientConfig2);

    const server = new WebpackDevServer(compiler, devServerOptions);

    server.listen(devServerPort, '0.0.0.0', () => {
        console.log(`监听在${devServerPort}`);
    });
}


const startTime = Date.now();
webpack(serverConfig, (err, stats) => {
    require('./print')(err, stats, isProd);
    if (isProd) {
        const endTime = Date.now();
        console.log('服务端构建时间', endTime - startTime);
    }
});
