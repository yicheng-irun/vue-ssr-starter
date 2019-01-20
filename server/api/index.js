const express = require('express');

const router = express.Router();

// 这里加上鉴权相关的代码逻辑




router.get('/', (req, res) => {
    res.json({
        success: true,
        msg: 'success',
        data: {
            hello: 'world!'
        }
    });
});





module.exports = {
    router,
};