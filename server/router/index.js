const express = require('express');
const router = express.Router();

// 这里加上鉴权相关的代码逻辑

router.get('/', (req, res) => {
    res.ssrRender('home', {
        query: req.query
    });
});

router.get('/demos/base', (req, res) => {
    res.ssrRender('demos/base', {
        query: req.query
    });
});



module.exports = {
    router,
};