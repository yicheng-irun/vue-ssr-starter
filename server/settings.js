/**
 * 这里进行项目的配置
 */

const settins = {
    isOnline: process.env.NODE_ENV != 'development', // 是否是在线运行

    dbconfig: { // 配置mongodb

    },
};

module.exports = settins;
