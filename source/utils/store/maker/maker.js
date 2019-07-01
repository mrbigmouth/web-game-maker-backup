import { check } from 'check';
import { gameBriefPattern, gameDetailPattern } from './patterns';

export default {
  namespaced: true,
  state: {
    // 已存在的開發中遊戲的簡單資料列表
    brief: [],
    // 已存在的開發中遊戲的全部資料列表
    detail: {},
    // 已存在的開發中遊戲的開發中已異動但尚未存入detail的資料
    editing: {},
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
  actions: {
    loadBriefGameList({ dispatch }) {
      dispatch('read', ['/maker/brief'], {
        root: true,
      });
    },
    loadDetailGame({ dispatch }, gid) {
      dispatch('read', ['/maker/detail/' + gid], {
        root: true,
      });
    },
    updateGameOpenTime({ state, dispatch }, gid) {
      check(gid, gameBriefPattern.id);
      const briefList = state.brief.slice();
      const updateBriefIndex = briefList.findIndex((gameBrief) => {
        return gameBrief.id === gid;
      });
      const gameDetail = state.detail[gid];
      const lastOpenTime = Date.now();
      const briefGame = {
        ...briefList[updateBriefIndex],
        lastOpenTime,
      };
      briefList.splice(updateBriefIndex, 1);
      briefList.unshift(briefGame);
      gameDetail.lastOpenTime = lastOpenTime;

      return dispatch('update', {
        '/maker/brief': briefList,
        [`/maker/detail/${gid}`]: gameDetail,
      }, {
        root: true,
      });
    },
    // 建立新的編輯遊戲
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
      const briefList = [
        newGameBrief,
        ...state.brief,
      ];

      newGameDetail.id = id;
      newGameDetail.lastOpenTime = lastOpenTime;

      return dispatch('update', {
        '/maker/brief': briefList,
        [`/maker/detail/${newGameDetail.id}`]: newGameDetail,
      }, {
        root: true,
      })
      .then(() => {
        return id;
      });
    },
    // 開始編輯指定遊戲
    startEditGame({ dispatch, rootState }, { gid }) {
      // 從共用資料中心讀取該遊戲的detail資料進本地store。
      dispatch('read', [
        `/maker/detail/${gid}`
      ], {
        root: true,
      })
      // 從共用資料中心讀取該遊戲的editing資料進本地store。
      .then((detailResult) => {
        const editingKey = `/maker/editing/${gid}`;
        return dispatch('read', [editingKey], {
          root: true,
        })
        .then((editingResult) => {
          return {
            detail: detailResult[`/maker/detail/${gid}`],
            editing: editingResult[editingKey],
          };
        });
      })
      // 之後檢查共用資料中心是否已存在該遊戲的editing資料
      .then((result) => {
        // 若共用資料中心已存在editing資料，在本地store中的page state下建立detail資料與editing資料的待編輯資料
        if (result.editing) {
          rootState.page.game = Object.assign({}, result.detail, result.editing);

          return rootState.page.game;
        }
        // 否則在共用資料中心建立一個空白的editing資料
        else {
          dispatch('update', {
            [`/maker/editing/${gid}`]: {},
          }, {
            root: true,
          })
          .then(() => {
            return {};
          });
        }
      });
    },
  },
};
