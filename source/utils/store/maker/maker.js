import { check } from 'check';
import { gameBriefPattern, gameDetailPattern } from './patterns';

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
      check(gid, gameBriefPattern.id);
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

      return dispatch('update', {
        '/maker/brief': briefList,
        '/maker/detail': detailList,
      }, {
        root: true,
      });
    },
    createGame({ state, dispatch }, data = {}) {
      const newGameBrief = {};
      const newGameDetail = {};
      Object.keys(gameBriefPattern).forEach((key) => {
        newGameBrief[key] = data[key];
      });
      Object.keys(gameDetailPattern).forEach((key) => {
        if (data[key]) {
          newGameDetail[key] = data[key];
        }
      });
      const id = state.brief.reduce((id, game) => {
        return Math.max(id, game.id) + 1;
      }, 0);
      const lastOpenTime = Date.now();
      newGameBrief.id = id;
      newGameBrief.lastOpenTime = lastOpenTime;
      newGameDetail.id = id;
      newGameDetail.lastOpenTime = lastOpenTime;

      const briefList = [
        newGameBrief,
        ...state.brief,
      ];
      const detailList = [
        newGameDetail,
        ...state.detail,
      ];

      return dispatch('update', {
        '/maker/brief': briefList,
        '/maker/detail': detailList,
      }, {
        root: true,
      }).then(() => {
        return id;
      });
    },
  },
};
