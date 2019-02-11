const express = require('express');
const router = express.Router();

// 这里加上鉴权相关的代码逻辑

router.get('/', (req, res) => {
    res.ssrRender('page1', {
        query: req.query
    });
});

router.get('/template', (req, res) => {
    res.ssrRender(req.query.page, {
        query: req.query,
    });
});


module.exports = {
    router,
};