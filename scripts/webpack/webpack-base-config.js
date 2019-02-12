
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const utils = require('../utils');

const { srcRoot } = utils.configs;

const isProd = process.env.NODE_ENV == 'production';



// const StyleLoader = () => {
//     return {
//         loader: 'style-loader',
//         options: { sourceMap: !isProd }
//     };
// };

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



function getConfig (chunks) {

    function getBaseCssLoaders () {
        const baseCssLoader = [VueStyleLoader(), CSSLoader(), PostCSSLoader()];
        if (!isProd) {
            baseCssLoader.unshift('css-hot-loader');
        }
        return baseCssLoader;
    }
    
    const config = {
        mode: isProd ? 'production' : 'development',
        devtool: isProd ? false : 'cheap-module-eval-source-map', // nosources-source-map
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
                    loader: path.resolve(__dirname, './loaders/condition-comment-loader.js'),
                    options: {
                        isProd: isProd
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.html$/,
                    loader: 'twig-loader',
                    options: {
                    }
                },
                {
                    test: /\.js$/,
                    // use: ['cache-loader', 'babel-loader'],
                    use: 'babel-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: getBaseCssLoaders().concat([]),
                },
                {
                    test: /\.(stylus|styl)$/,
                    use: getBaseCssLoaders().concat([StylusLoader()]),
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
            splitChunks: {
                chunks: 'async',
                name: 'vendor',
            }
        },
        plugins: [
            new VueLoaderPlugin(),
            new webpack.ProgressPlugin((percentage) => {
                // console.info(percentage, message, ...args);
                // const percent = Math.floor(percentage * 1000) / 10;
                // console.info(`${chunks} ${percent}% ${message}`);
                if (percentage == 1) {
                    console.info(`${chunks} 构建就绪`);
                }
            }),
        ],
    };

    return config;
}


function getSSRConfig (chunks) {
    const config = getConfig(chunks);

    // 使页面的顶部有vue ssr预渲染的style标签
    config.plugins.push(new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
    }));

    return config;
}


function getChildPluginInstances (options = {}) {
    const plugins = [];
    const templatesChunks = utils.getAllPageTemplates();
    templatesChunks.forEach((chunk) => {
        plugins.push(new HtmlWebpackPlugin({
            filename: `templates/${chunk}.html`,
            template: `${srcRoot}/pages/${chunk}/template.html`,
            chunks: ['main'],
            
            // inject: false,
            minify: isProd ? { collapseWhitespace: true, minifyJS: true } : false,

            page: chunk,
            isProd: isProd,
            isDev: !isProd,
            isServer: false,
            isClient: true,
            ...options,
        }));
    });
    return plugins;
}


module.exports = {
    getConfig,  
    getSSRConfig,
    getChildPluginInstances,
};
