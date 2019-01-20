import Vue from 'vue';
import App from './app.vue';
import axios from 'axios';

import vueBeauty from 'vue-beauty';
Vue.use(vueBeauty);

// import 'vue-beauty/package/style/vue-beauty.min.css';
// https://fontawesome.com/?from=io
import '@fortawesome/fontawesome-free/css/all.css';

Vue.prototype.$axios = axios;

new Vue({
    el: '#app',
    render: h => h(App)
});
