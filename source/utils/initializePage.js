import Vue from 'vue';
import { mapState } from 'vuex';
import i18n from './i18n/i18n';
import store from './store/store';
import './fontawesome';
import './filters/datetime';

// initialize layout
import BasicLayout from './layout/BasicLayout';
export default function initializePage(options) {
  Vue.config.productionTip = process.env.isProduction;
  const Layout = options.Layout || BasicLayout;

  new Vue({
    i18n,
    store,
    data() {
      const search = location.search.substring(1);
      if (search) {
        const decodeSearch = decodeURI(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g,'":"');

        return JSON.parse('{"' + decodeSearch + '"}');
      }

      return {};
    },
    computed: {
      documentTitle: options.documentTitle || (() => {
        return 'Web Game Maker';
      }),
      ...mapState('i18n', [
        'locale',
      ]),
    },
    watch: {
      documentTitle(documentTitle) {
        document.title = documentTitle;
      },
      locale(locale) {
        this.$i18n.locale = locale;
      },
    },
    created: options.created,
    render(createElement) {
      return createElement(Layout, [
        createElement(options.contain, {
          props: {
            gid: this.gid,
            pid: this.pid,
          },
        }),
      ]);
    },
  })
    .$mount('#app');
}
