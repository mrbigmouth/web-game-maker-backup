import Vue from 'vue';

// i18n
import i18n from 'vuex-i18n';
import store from './store/store';
import i18nEn from 'i18n/en';
import i18nZhTw from 'i18n/zh-tw';
import i18nZhCn from 'i18n/zh-cn';
Vue.use(i18n.plugin, store, {
  moduleName: 'i18n',
  onTranslationNotFound(locale, key) {
    /* eslint-disable no-console */
    console.warn(`i18n :: Key '${key}' not found for locale '${locale}'`);
    /* eslint-enable no-console */
  },
});
Vue.i18n.add('en', i18nEn);
Vue.i18n.add('zh-tw', i18nZhTw);
Vue.i18n.add('zh-cn', i18nZhCn);
Vue.i18n.set('en');

// font awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far);
Vue.component('icon', FontAwesomeIcon);

// add date time filter
import moment from 'moment';
Vue.filter('msToDate', function(value) {
  return moment('' + value, 'x').format('YYYY/MM/DD');
});

Vue.filter('msToDateTime', function(value) {
  return moment('' + value, 'x').format('YYYY/MM/DD hh:mm:ss');
});

// initialize store and layout
import BasicLayout from './layout/BasicLayout';
export default function initializePage(options) {
  Vue.config.productionTip = process.env.isProduction;
  const Layout = options.Layout || BasicLayout;

  new Vue({
    store,
    computed: {
      documentTitle: options.documentTitle || (() => {
        return 'Web Game Maker';
      }),
    },
    created: options.created,
    watch: {
      documentTitle(documentTitle) {
        document.title = documentTitle;
      },
    },
    render(createElement) {
      return createElement(Layout, [
        createElement(options.contain)
      ]);
    },
  })
    .$mount('#app');
}
