/**
 * @author ichengzhang
 * @since 20181214
 */
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const utils = require('./utils');
const { srcRoot, distRoot, devServerPort, devNodeServerPort } = utils.configs;

const buildPages = utils.getAllPages();

const isProd = process.argv.indexOf('build') >= 0;


const entries = {};
const chunks = [];
const htmlWebpackPluginArray = [];

buildPages.forEach((chunk) => {
    if (isProd) {
        if (chunk.startsWith('index') || chunk.startsWith('test')) {
            return;
        }
    }

    entries[chunk] = `${srcRoot}/pages/${chunk}/index.js`;
    chunks.push(chunk);

    const filename = `${chunk}.html`;

    const htmlConf = {
        filename,
        template: `${srcRoot}/pages/${chunk}/index.html`,
        chunks: ['commons', chunk],
        isProd: isProd,
    };

    htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf));
});


const StyleLoader = () => {
    return {
        loader: 'style-loader',
        options: { sourceMap: !isProd }
    };
};

const PostCSSLoader = () => {
    return {
        loader: 'postcss-loader',
        options: {
            plugins: [
                require('autoprefixer'),
                require('cssnano'),
            ],
            sourceMap: !isProd,
        },
    };
};

const StylusLoader = () => {
    return {
        loader: 'stylus-loader',
        options: {
            sourceMap: !isProd,
        },
    };
};

const CSSLoader = () => {
    return {
        // prerender 时需要用css-loader/locals，SSR 时不需要
        loader: 'css-loader',
        options: {
            // css中的 @import 只需要通过postcss-loader
            importLoaders: 1,
            localIdentName: '[local]_[hash:base64:8]',
            sourceMap: !isProd,
        },
    };
};

const VueStyleLoader = () => {
    return {
        loader: 'vue-style-loader',
        options: {
            sourceMap: !isProd,
        },
    };
};

const config = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? false : 'cheap-module-eval-source-map', // nosources-source-map
    entry: entries,
    output: {
        path: distRoot,
        filename: 'assets/[name].js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': srcRoot,
        },
    },
    externals: {
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false,
                    },
                },
            },
            {
                test: /\.(js|vue)$/,
                loader: path.resolve(__dirname, './condition-comment-loader.js'),
                options: {
                    isProd: isProd
                }
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: (isProd ? [] : ['css-hot-loader']).concat([VueStyleLoader(), StyleLoader(), CSSLoader(), PostCSSLoader()]),
            },
            {
                test: /\.(stylus|styl|wxss)$/,
                use: (isProd ? [] : ['css-hot-loader']).concat([VueStyleLoader(), StyleLoader(), CSSLoader(), PostCSSLoader(), StylusLoader()]),
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                exclude: /favicon\.png$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'assets/img/[name].[hash:7].[ext]',
                    },
                }],
            },
        ],
    },
    optimization: {
    },
    target: 'web',
    devServer: {
        hot: !isProd,
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
};

config.plugins = [
    ...config.plugins,
    ...htmlWebpackPluginArray,
].concat(isProd ? [] : [new webpack.NamedModulesPlugin(), new webpack.HotModuleReplacementPlugin()]);

if (isProd) {
    delete config.devServer;
    webpack(config, (err, stats) => {
        if (err) throw err;
        // production 模式下显示详细构建结果
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
    });
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
            require('./server-dev');
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
