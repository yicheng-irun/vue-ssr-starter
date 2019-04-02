/**
 * 服务端js的入口文件
 */
import createApp from './create-app';
import runtime from '@/lib/runtime';

export default async (context) => {
    runtime.setServerContext(context);

    const { app, store } = await createApp(runtime.page);
    await store.serverFetch();
    context.state = store.instance.state; // 这一步将会把状态序列化到 `window.__INITIAL_STATE__`
    return app;
};
