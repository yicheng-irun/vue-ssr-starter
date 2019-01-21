

const isProd = process.argv.indexOf('build') >= 0;
if (isProd) {
    process.env.NODE_ENV = 'production';

    
} else {
    process.env.NODE_ENV = 'development';
}

// require('./webpack/webpack-hot-update-build.js');
require('./webpack/webpack-base-config.js');


