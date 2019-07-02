import Vue from 'vue';
import VueI18n from 'vue-i18n';
import i18nEn from './en';
import i18nZhTw from './zh-tw';
import i18nZhCn from './zh-cn';

Vue.use(VueI18n);

const messages = {
  en: i18nEn,
  'zh-tw': i18nZhTw,
  'zh-cn': i18nZhCn,
};

export const i18n = new VueI18n({
  locale: 'zh-tw',
  fallbackLocale: 'zh-tw',
  availableLocales: Object.keys(messages),
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  sync: true,
  messages,
});
export default i18n;

export function i18nLocalization(key) {
  const result = {};
  Object.keys(messages).forEach((lang) => {
    result[lang] = messages[lang].componentBasedLocalization[key];
  });

  return {
    i18n: {
      messages: result,
    },
  };
}

export const store = {
  namespaced: true,
  state: {
    locale: '',
  },
};
