import Vue from 'vue';
import runtime from '@/lib/runtime';

const pages = {
    page1: () => {
        return import(/* webpackChunkName: "page1" */'./pages/page1');
    },
    page2: () => {
        return import(/* webpackChunkName: "page2" */'./pages/page2');
    },
};

pages.default = pages.page1;


export default function createApp () {
    return new Promise((resolve, reject) => {
        const page = runtime.page;
        let f = pages[page];
        if (!f) {
            f = pages.default;
        }

        f().then((factfunc) => {
            const {App, store} = factfunc.default();
            const app = new Vue({
                store: store.instance,
                render: h => h(App),
            });
            resolve({ app, store });
        }).catch(reject);
    });
}
