import { check, patterns } from 'utils/check';

function doNothing() {
}

export default {
  namespaced: true,
  state: {
    isDisplayConfirmDialog: false,
    confirmDialogTitle: '',
    confirmDialogIcon: '',
    confirmDialogMessage: '',
    onYes: doNothing,
    onNo: false,
  },
  mutations: {
    showConfirmDialog(state, payload) {
      check(payload, {
        title: String,
        icon: patterns.maybe(String),
        message: String,
        onYes: patterns.maybe(Function),
        onNo: patterns.maybe(patterns.oneOf(Function, true)),
      });
      check(state.isDisplayConfirmDialog, false);

      state.isDisplayConfirmDialog = true;
      state.confirmDialogTitle = payload.title || '';
      state.confirmDialogIcon = payload.icon || '';
      state.confirmDialogMessage = payload.message || '';
      state.onYes = payload.onYes;
      state.onNo = payload.onNo;
    },
    handleYes(state) {
      if (typeof state.onYes === 'function') {
        state.isDisplayConfirmDialog = (!state.onYes()) || false;
      }
      else {
        state.isDisplayConfirmDialog = false;
      }
    },
    handleNo(state) {
      if (typeof state.onNo === 'function') {
        state.isDisplayConfirmDialog = (!state.onNo()) || false;
      }
      else {
        state.isDisplayConfirmDialog = false;
      }
    },
  },
};
