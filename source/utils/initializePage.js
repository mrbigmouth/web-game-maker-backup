import Vue from 'vue';
import store from 'store/storeForClient';
import 'i18n/i18n';

export default function initializePage(Page, privateStore) {
  Vue.config.productionTip = process.env.isProduction;
  if (privateStore) {
    store.registerModule('private', privateStore);
  }

  new Vue({
    store,
    render(h) {
      return h(Page);
    },
  })
    .$mount('#app');
}
