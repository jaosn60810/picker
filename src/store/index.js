import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import user from './modules/user';

const vuexLocal = new VuexPersist({
  storage: window.localStorage,
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
  },
  plugins: [vuexLocal.plugin],
});
