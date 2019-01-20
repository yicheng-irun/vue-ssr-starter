/**
 * 此文件用于webpack 跑 dev 时，启动后端js
 */

const NodeCI = require('../index');

const port = process.env.NODE_SERVER_PORT || 28888;

NodeCI._isDevMode = true;
NodeCI.options.port = port;

NodeCI.run();
