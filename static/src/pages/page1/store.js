import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import { get } from '@/lib/ajax.js';
import runtime from '@/lib/runtime.js';


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
            fetchItem ({ commit }) {
                return new Promise((resolve, reject) => {
                    // 这里可以请求 后台cgi 数据
                    get('/api/demo', { sayhi: 'hi server!' }).then((rsp) => {
                        const result = rsp.data;
                        commit('setData', result.data);
                        resolve();
                    }).catch(reject);
                });
            },
        },
    });


    return {
        serverFetch () { // 服务端 拉取数据
            // runtime.action.next();
            return store.dispatch('fetchItem');
        },
        clientFetch () { // 客户端 拉取数据
            if (window.__INITIAL_STATE__) {
                return new Promise((resolve) => {
                    store.replaceState(window.__INITIAL_STATE__);
                    resolve();
                });
            }
            return store.dispatch('fetchItem'); // 拉取数据
        },
        instance: store,
    };
}
