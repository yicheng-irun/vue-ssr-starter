import Vue from 'vue';
import runtime from './lib/runtime';
import pages from './pages';


export default function createApp () {
    return new Promise((resolve, reject) => {
        const page = runtime.page;
        let f = pages[page];
        if (!f) {
            f = pages.default;
        }

        f().then((factfunc) => {
            const {App, Store} = factfunc.default;
            const store = Store();
            const app = new Vue({
                store: store.instance,
                render: h => h(App),
            });
            resolve({ app, store });
        }).catch(reject);
    });
}
