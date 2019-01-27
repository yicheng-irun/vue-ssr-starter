/**
 * 服务端js的入口文件
 */
import createApp from './create-app';
import runtime from '@/lib/runtime';

export default (context) => {
    runtime.setServerContext(context);

    const { app, store } = createApp(context);

    return new Promise((resolve, reject) => {
        store.serverFetch().then(() => {
            context.state = store.instance.state; // 这一步将会把状态序列化到 `window.__INITIAL_STATE__`
            resolve(app);
        }).catch(reject);
    });
};
