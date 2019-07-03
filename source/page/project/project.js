import initializePage from 'utils/initializePage';
import Project from './vue/Project';
import pageStore from './store';

initializePage({
  documentTitle() {
    const gameDetail = this.$store.state.maker.detail[this.gid];
    const gameName = gameDetail ? gameDetail.name || '' : '';

    return this.$i18n.t('documentTitle', {
      pageName: this.$i18n.t('componentBasedLocalization.project.title', {
        gameName,
      }),
    });
  },
  contain: Project,
  created() {
    this.$store.registerModule('page', pageStore);

    return this.$store
      .dispatch('maker/startEditGame', {
        gid: this.gid,
      });
  },
});
