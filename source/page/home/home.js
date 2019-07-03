import initializePage from 'utils/initializePage';
import Home from './vue/Home';
import pageStore from './store';

initializePage({
  documentTitle() {
    return this.$i18n.t('documentTitle', {
      pageName: this.$i18n.t('componentBasedLocalization.home.title'),
    });
  },
  created() {
    this.$store.registerModule('page', pageStore);
  },
  contain: Home,
});
