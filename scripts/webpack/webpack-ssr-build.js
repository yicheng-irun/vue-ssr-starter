const webpack = require('webpack');
const utils = require('../utils');
const createClientConfig = require('./webpack-ssr-client-config');
const createServerConfig = require('./webpack-ssr-server-config');

const isProd = process.env.NODE_ENV == 'production';


const configs = [];

const pages = utils.getAllStaticPages();
pages.forEach((chunk) => {

    configs.push(createClientConfig(chunk));
    configs.push(createServerConfig(chunk));
});


webpack(configs, (err, stats) => {
    utils.printInfo(err, stats, isProd);
});
