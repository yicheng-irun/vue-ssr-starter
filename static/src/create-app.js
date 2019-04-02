import Vue from 'vue';
import runtime from './lib/runtime';
import pages from './pages';


export default async function createApp () {
    const page = runtime.page;
    let f = pages[page];
    if (!f) {
        f = pages.default;
    }

    const factfunc = await f();
    const {App, Store} = factfunc.default;
    const store = Store();
    const app = new Vue({
        store: store.instance,
        render: h => h(App),
    });
    return { app, store };
}
