import Vue from 'vue';
import App from './app';
import createStore from './store';


export default function createApp () {
    const store = createStore();

    const app = new Vue({
        store: store.instance,
        render: h => h(App),
    });

    return { app, store };
}
