
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const utils = require('../utils');

const { srcRoot } = utils.configs;

const isProd = process.env.NODE_ENV == 'production';



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



function getConfig () {

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
                    }
                },
                {
                    test: /\.html$/,
                    loader: 'twig-loader',
                    options: {
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
                    test: /\.(stylus|styl)$/,
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
        plugins: [
            new VueLoaderPlugin(),
        ],
    };

    return config;
}


module.exports = {
    getConfig,
};
