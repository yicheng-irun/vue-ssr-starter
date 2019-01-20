
const baseProcessors = require('./processors/index');
const createApp = require('./server/app');

const NodeCI = {
    processors: [], // 类型

    _isDevMode: false,

    app: null,

    options: {
        host: '0.0.0.0',
        port: 12345,
    },

    registerType () {},
    run () {},
    start () {},
    stop () {},
    list () {},
};


// 处理对应的processorID
let porcessorIndex = 0;

// 注册类型时的回掉
NodeCI.registerProcessor = function (typeName, theModule, modulePath) {

    // 这里需要进行参数校验

    console.log(modulePath);

    NodeCI.processors.push({
        index: porcessorIndex++,
        name: typeName,
        module: theModule,
        modulePath,
    });
};
// 注册基本的CI类型
baseProcessors.register(NodeCI);


// 注册触发器
NodeCI.registerEmiter = function (emitName, theModule, modulePath) {

};


NodeCI.run = function () {
    if (NodeCI.app) {
        throw new Error('An instance already exists.');
    }

    NodeCI.app = createApp(NodeCI);
    const { port, host} = NodeCI.options;
    if (port) {
        NodeCI.app.listen(port, host, () => {
            console.info('Server is runing');
        });
    }
};

NodeCI.start = function () {

};

NodeCI.stop = function () {

};

NodeCI.list = function () {

};



module.exports = NodeCI;

