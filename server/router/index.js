const express = require('express');
const router = express.Router();

// 这里加上鉴权相关的代码逻辑

router.get('/', (req, res) => {
    res.send('xxxxxxxxxxx');
});

router.get('/demos/devtest', (req, res) => {
    res.ssrRender('demos/devtest', {
        query: req.query
    });
});



module.exports = {
    router,
};