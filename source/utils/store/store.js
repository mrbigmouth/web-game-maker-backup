import Vue from 'vue';
import Vuex from 'vuex';
import { initialize, sendUpdate, sendRead, onUpdate } from 'storeHelpers';
import maker from './maker/maker';

Vue.use(Vuex);

export const store = new Vuex.Store({
  strict: false,
  plugins: [
    function plugin(store) {
      // initialize sync/i18n data by single message
      initialize((data) => {
        if (! data['/i18n/locale']) {
          const userLanguage = (navigator.language || navigator.browserLanguage).toLowerCase();
          if (userLanguage === 'zh-tw' || userLanguage === 'zh-cn') {
            data['/i18n/locale'] = userLanguage;
          }
          else {
            data['/i18n/locale'] = 'en';
          }
        }
        store.commit('update', data);
      });
      // update sync/i18n data by long-lived connection 
      onUpdate((payload) => {
        store.commit('update', payload);
      });
    }
  ],
  modules: {
    maker,
  },
  state: {
    errorList: [],
    sync: {},
    maker: {},
    player: {},
  },
  getters: {
    // utils data getter
    read(state) {
      return (path) => {
        let result = state;
        try {
          const paceList = path.split('/');
          paceList.forEach((pace) => {
            if (pace) {
              result = result[pace];
            }
          });
        }
        catch (e) {
          return undefined;
        }

        return result;
      };
    },
  },
  mutations: {
    // put error(s) into error list
    error(state, error) {
      if (Array.isArray(error)) {
        state.errorList.push(...error);
      }
      else {
        state.errorList.push(error);
      }
    },
    // remove first error into error list
    confirmError(state) {
      state.errorList.shift();
    },
    // update mutation for self-use data
    update(state, payload) {
      Object.keys(payload).forEach((path) => {
        const value = payload[path];
        try {
          const paceList = path.split('/');
          let updateTarget = state;
          const updateField = paceList.pop();
          paceList.forEach((pace) => {
            if (pace) {
              updateTarget = updateTarget[pace];
            }
          });
          if (updateTarget) {
            Vue.set(updateTarget, updateField, value);
          }
          else {
            throw new Error();
          }
        }
        catch(e) {
          state.errorList.push(`can't set value 「${value}」 of path ${path}！`);
        }
      });
    },
    // 
  },
  actions: {
    // update action for share data
    update(store, payload) {
      return new Promise((resolve, reject) => {
        sendUpdate(payload, (message) => {
          if (message.error) {
            store.commit('error', message.error);
            reject(message.error);
          }
          else {
            store.commit('update', payload);
            resolve(payload);
          }
        });
      })
    },
    // read specific detail(not sync/i18n) data from share data
    read(store, pathList) {
      return new Promise((resolve, reject) => {
        sendRead(pathList, (message) => {
          if (message.error) {
            store.commit('error', message.error);
            reject(message.error);
          }
          else {
            store.commit('update', message.data);
            resolve(message.data);
          }
        });
      });
    }
  },
});
export default store;
