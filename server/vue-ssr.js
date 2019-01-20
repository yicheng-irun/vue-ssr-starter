


function middleWare (req, res, next) {
    res.ssrRender = function () {

    };
    next();
}


module.exports = middleWare;
