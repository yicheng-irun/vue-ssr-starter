const express = require('express');

const router = express.Router();

// 这里加上鉴权相关的代码逻辑




router.get('/demo', (req, res) => {
    const testCookie = `${Date.now()}`;
    res.cookie('testCookie', testCookie, {
        maxAge: 1000 * 60,
    });
    res.cookie('testCookie2', testCookie, {
        maxAge: 1000 * 60,
    });
    // res.getHeader('')
    res.json({
        success: true,
        msg: 'success',
        data: {
            hello: 'world!',
            time: new Date().toLocaleString(),
            query: req.query,
            cookie: req.cookies,
            testCookie,
        }
    });
});





module.exports = {
    router,
};