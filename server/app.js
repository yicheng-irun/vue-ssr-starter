const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


/**
 * 
 * @param {Object} options
 */
function createApp (options) {
    const app = express();

    var logger = require('morgan');
    app.use(logger('dev'));
    app.use(cookieParser());

    app.use(express.static(path.resolve(__dirname, './public')));
    // app.use('/static', express.static(path.resolve(__dirname, '../static/dist')));
    app.use('/', express.static(path.resolve(__dirname, '../static/dist')));

    // 在非webpack构建时,serve一下static/dist目录的构建好的文件
    if (!options.isDevMode) {
        // 在开发模式下做的事情
    }

    // 解析 application/json
    app.use(bodyParser.json());
    // 解析 application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    // 以api来起调用接口
    app.use('/api', require('./api/index').router);

    return app;
}


module.exports = createApp;
