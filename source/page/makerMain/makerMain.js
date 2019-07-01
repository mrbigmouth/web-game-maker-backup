import initializePage from 'utils/initializePage';
import MakerMain from './vue/MakerMain';
import pageStore from './store';

initializePage({
  documentTitle() {
    const gameDetail = this.$store.state.maker.detail[this.gid];
    if (gameDetail) {
      return this.$t('documentTitle', {
        pageName: '「' + gameDetail.name + '」' + this.$t('pageNameMakerMain'),
      });
    }

    return this.$t('documentTitle', {
      pageName: this.$t('pageNameMakerMain'),
    });
  },
  contain: MakerMain,
  created() {
    this.$store.registerModule('page', pageStore);

    return this.$store
      .dispatch('maker/startEditGame', {
        gid: this.gid,
      });
  },
});
