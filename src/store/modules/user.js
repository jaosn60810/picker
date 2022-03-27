const namespaced = true;

const state = {
  id: null,
  name: null,
  email: null,
  partnerID: null,
  movieApiPage: 1,
  matches: [],
};

const mutations = {
  SET_USER_DATA: (state, payload) => {
    state.id = payload.id;
    state.name = payload.name;
    state.email = payload.email;
    state.partnerID = payload.partnerID;
    state.movieApiPage = payload.movieApiPage;
  },
  CLEAR_USER_DATA: (state) => {
    state.id = null;
    state.name = null;
    state.email = null;
    state.partnerID = null;
    state.movieApiPage = 1;
    state.matches = [];
  },
  SET_PARTNER_ID: (state, payload) => {
    state.partnerID = payload;
  },
  SET_MOVIE_API_PAGE: (state, payload) => {
    state.movieApiPage = payload;
  },
  SET_BIND_MATCHES: (state, payload) => {
    state.matches = payload;
  },
};

const actions = {
  setUserData(context, userData) {
    context.commit('SET_USER_DATA', userData);
  },
  clearUserData(context, userData) {
    context.commit('CLEAR_USER_DATA', userData);
  },
  setPartnerID(context, id) {
    context.commit('SET_PARTNER_ID', id);
  },
  setMovieApiPage(context, pageNo) {
    context.commit('SET_MOVIE_API_PAGE', pageNo);
  },
  setBindMatches(context, matches) {
    context.commit('SET_BIND_MATCHES', matches);
  },
};

const getters = {};

export default {
  namespaced,
  state,
  mutations,
  actions,
  getters,
};
