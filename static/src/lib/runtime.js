
const runtime = {
    isServer: false,
    isClient: true,
    isProd: true,
    isDev: false,

    serverOrigin: '',

    req: {},
    params: {},
    page: '',

    // 仅在服务端运行
    setServerContext (context) {
        runtime.serverOrigin = context.serverOrigin;
        runtime.req = context.req || {};
        runtime.params = context.params || {};
        runtime.page = context.page;
    },

    clientInit () {
        let page = '';
        if (window._SSR_PAGE_) {
            page = window._SSR_PAGE_;
        } else {
            window.location.search.replace(/[&?]page=([^&]+)/, (a, b) => {
                page = b;
            });
        }
        runtime.page = page;
    },
};

if (global.process && global.process.env && global.process.env.VUE_ENV == 'server') {
    runtime.isServer = true;
    runtime.isClient = false;
} else {
    runtime.clientInit();
}
if (global.process && process.env && process.env.NODE_ENV == 'development') {
    runtime.isDev = true;
    runtime.isProd = false;
}


export default runtime;
