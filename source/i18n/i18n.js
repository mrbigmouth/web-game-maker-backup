/* eslint-disable no-console */
import Vue from 'vue';
import i18n from 'vuex-i18n';
import store from 'store/storeForClient';
import i18nEn from './en';
import i18nZhTw from './zh-tw';
import i18nZhCn from './zh-cn';

// const userLanguage = ;
Vue.use(i18n.plugin, store, {
  moduleName: 'i18n',
  onTranslationNotFound(locale, key) {
    console.warn(`i18n :: Key '${key}' not found for locale '${locale}'`);
  },
});
Vue.i18n.add('en', i18nEn);
Vue.i18n.add('zh-tw', i18nZhTw);
Vue.i18n.add('zh-cn', i18nZhCn);
Vue.i18n.set('en');
