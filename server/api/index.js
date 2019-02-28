const express = require('express');

const router = express.Router();

// 这里加上鉴权相关的代码逻辑




router.get('/demo', (req, res) => {
    console.log(req.headers);
    res.json({
        success: true,
        msg: 'success',
        data: {
            hello: 'world!',
            time: new Date().toLocaleString(),
            query: req.query,
            cookie: req.cookies,
        }
    });
});





module.exports = {
    router,
};