/**
 * 客户端js的入口文件
 */
import createApp from './create-app';

const { app, store } = createApp();

store.clientFetch().then(() => {
    app.$mount('#app');
}).catch(() => {
    app.$mount('#app');
});
