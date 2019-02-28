
const runtime = {
    isServer: false,
    isClient: true,
    isProd: true,
    isDev: false,

    serverOrigin: '',

    action: {
        req: {},
        res: {},
        next: () => {},
        params: {},
    },
    page: '',

    // 仅在服务端运行
    setServerContext (context) {
        const {
            req,
            res,
            next,
            serverOrigin,
            page,
            params,
        } = context;

        runtime.serverOrigin = serverOrigin;

        if (req) {
            runtime.action.req = req;
        }
        if (res) {
            runtime.action.res = res;
        }
        if (next) {
            runtime.action.next = next;
        }
        if (params) {
            runtime.action.params = params;
        }
        runtime.page = page;
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
        runtime.serverOrigin = location.origin;
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
