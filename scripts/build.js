const path = require('path');
const child_process = require('child_process');

const isProd = process.argv.indexOf('build') >= 0;
if (isProd) {
    process.env.NODE_ENV = 'production';
} else {
    process.env.NODE_ENV = 'development';
}

require('./webpack/webpack-hot-update-build.js');

const ssrbuild = child_process.fork(path.resolve(__dirname, './webpack/webpack-ssr-build.js'));



