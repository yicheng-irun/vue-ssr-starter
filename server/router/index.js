const express = require('express');
const router = express.Router();

// 这里加上鉴权相关的代码逻辑

router.get('/', (req, res) => {
    res.ssrRender('page1', {});
});

router.get('/page_cache_test', (req, res) => {
    res.ssrRender('page1', {}, {
        key: '',
        time: 1000 * 10, // ms
    });
});

router.get('/template', (req, res) => {
    res.ssrRender(req.query._page);
});


module.exports = {
    router,
};