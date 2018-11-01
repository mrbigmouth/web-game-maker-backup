export default {
  namespaced: true,
  state: {
    isShowCreateGameDialog: false,
  },
  modules: {
  },
  getters: {
  },
  mutations: {
    showCreateGameDialog(state) {
      state.isShowCreateGameDialog = true;
    },
    hideCreateGameDialog(state) {
      state.isShowCreateGameDialog = false;
    },
  },
  actions: {
  },
};
