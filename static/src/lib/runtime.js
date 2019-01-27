
const runtime = {
    isServer: false,
    isClient: true,
    isProd: true,
    isDev: false,

    serverOrigin: '',

    req: {},
    params: {},

    // 仅在服务端运行
    setServerContext (context) {
        runtime.serverOrigin = context.serverOrigin;
        runtime.req = context.req;
        runtime.params = context.params;
    }
};

if (global.process && global.process.env && global.process.env.VUE_ENV == 'server') {
    runtime.isServer = true;
    runtime.isClient = false;
}
if (global.process && process.env && process.env.NODE_ENV == 'development') {
    runtime.isDev = true;
    runtime.isProd = false;
}


export default runtime;
