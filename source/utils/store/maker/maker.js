export default {
  namespaced: true,
  state: {
    brief: [],
    detail: [],
  },
  modules: {
  },
  getters: {
    getBriefGameList(state) {
      return (displayNumber = Infinity) => {
        return state.brief.slice(0, displayNumber);
      };
    },
    getDetailGameList(state) {
      return (displayNumber = Infinity) => {
        return state.detail.slice(0, displayNumber);
      };
    },
    isGameNumberLesserThan(state) {
      return (lesserThanNumber) => {
        return lesserThanNumber < state.brief.length;
      };
    },
  },
  mutations: {
  },
  actions: {
    loadBriefGameList({ dispatch }) {
      dispatch('read', ['/maker/brief'], {
        root: true,
      });
    },
    updateGameOpenTime({ state, dispatch }, gid) {
      const briefList = state.brief.slice();
      const detailList = state.detail.slice();
      const updateGameIndex = briefList.findIndex((gameBrief) => {
        return gameBrief.id === gid;
      });
      const lastOpenTime = Date.now();
      const briefGame = {
        ...briefList[updateGameIndex],
        lastOpenTime,
      };
      briefList.splice(updateGameIndex, 1);
      briefList.unshift(briefGame);
      const detailGame = {
        ...detailList[updateGameIndex],
        lastOpenTime,
      };
      detailList.splice(updateGameIndex, 1);
      detailList.unshift(detailGame);

      dispatch('update', {
        '/maker/brief': briefList,
        '/maker/detail': detailList,
      }, {
        root: true,
      });
    },
  },
};
