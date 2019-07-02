import initializePage from 'utils/initializePage';
import Main from './vue/Main';
import pageStore from './store';

initializePage({
  documentTitle() {
    return this.$i18n.t('documentTitle', {
      pageName: this.$i18n.t('componentBasedLocalization.main.title'),
    });
  },
  created() {
    this.$store.registerModule('page', pageStore);
  },
  contain: Main,
});
