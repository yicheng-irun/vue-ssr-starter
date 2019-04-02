import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import { get } from '@/lib/ajax.js';
// import runtime from '@/lib/runtime.js';


export default function () {
    const store = new Vuex.Store({
        state: {
            data: {

                time: '',
            },
            msg: '',
        },

        mutations: {
            setData (state, data) {
                state.data = data;
            },
        },

        actions: {
            async fetchItem ({ commit }) {
                // 这里可以请求 后台cgi 数据
                const rsp = await get('/api/demo', { sayhi: 'hi server!' });
                const result = rsp.data;
                commit('setData', result.data);
            },
        },
    });


    return {
        async serverFetch () { // 服务端 拉取数据
            // runtime.action.next();
            return await store.dispatch('fetchItem');
        },
        async clientFetch () { // 客户端 拉取数据
            if (window.__INITIAL_STATE__) {
                store.replaceState(window.__INITIAL_STATE__);
                return;
            }
            return await store.dispatch('fetchItem'); // 拉取数据
        },
        instance: store,
    };
}
