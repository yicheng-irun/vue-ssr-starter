const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');



const app = express();

var logger = require('morgan');
app.use(logger('dev'));
app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, './public')));
// app.use('/static', express.static(path.resolve(__dirname, '../static/dist')));
app.use('/', express.static(path.resolve(__dirname, '../static/dist')));



// 解析 application/json
app.use(bodyParser.json());
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// 以api来起调用接口
app.use('/api', require('./api/index').router);

// 加上ssr的中间件
app.use(require('./vue-ssr.js')({
    bundlePath: path.resolve(__dirname, '../static/dist-bundle'),
    cacheRenderer: process.env.NODE_ENV == 'development' ? false : true,
    app: app,
}));

// 以api来起调用接口
app.use(require('./router/index').router);


module.exports = app;
