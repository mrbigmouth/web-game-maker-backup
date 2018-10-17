import initializePage from 'utils/initializePage';
import Main from './vue/Main';
import pageStore from './store';

initializePage({
  documentTitle() {
    return this.$t('documentTitle', {
      pageName: this.$t('pageNameMain'),
    });
  },
  created() {
    this.$store.registerModule('page', pageStore);
  },
  contain: Main,
});
