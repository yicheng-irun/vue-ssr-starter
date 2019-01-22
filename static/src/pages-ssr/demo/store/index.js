import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default function createStore () {
    const store = new Vuex.Store({
        state: {
            data1: {
                key: '我是data',
            },
            msg: '',
        },

        mutations: {
            setItem (state, { data1, msg }) {
                if (data1) {
                    state.data1 = data1;
                }
                if (msg) {
                    state.msg = msg;
                }
            },
        },

        actions: {
            fetchItem ({ commit }) {
                return new Promise((resolve) => {
                    // 这里可以请求 后台cgi 数据
                    setTimeout(() => {
                        commit('setItem', {
                            msg: '我是请求数据之后设置过的msg',
                        });
                        resolve();
                    }, 200);
                });
            },
        },
    });


    return {
        serverFetch () { // 服务端 拉取数据
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
