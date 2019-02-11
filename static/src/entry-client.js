/**
 * 客户端js的入口文件
 */
import createApp from './create-app';


createApp().then(({ app, store }) => {
    store.clientFetch().then(() => {
        app.$mount('#app');
    }).catch(() => {
        app.$mount('#app');
    });
});
