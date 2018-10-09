export const mixin = {
  computed: {
    documentTitle() {
      return '';
    }
  },
  watch: {
    documentTitle(documentTitle) {
      document.title = documentTitle;
    },
  },
};
export default mixin;
