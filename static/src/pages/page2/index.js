import App from './app.vue';
import createStore from './store';

export default function () {
    return {
        App,
        store: createStore(),
    };
}
