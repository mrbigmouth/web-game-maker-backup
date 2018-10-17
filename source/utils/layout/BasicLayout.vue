<template>
  <div class="container-fluid">
    <slot />
    <confirm-dialog />
    <error-dialog />
  </div>
</template>

<script>
  import 'utils/bootstrap-watch-slate.min.css';
  import ConfirmDialog from 'utils/dialog/ConfirmDialog';
  import ConfirmDialogStore from 'utils/dialog/ConfirmDialogStore';
  import ErrorDialog from './ErrorDialog';

  export default {
    name: 'BasicLayout',
    created() {
      this.$store.registerModule('page/confirmDialog', ConfirmDialogStore);
    },
    components: {
      'confirm-dialog': ConfirmDialog,
      'error-dialog': ErrorDialog,
    },
  };
</script>

<style lang="stylus">
  table {
    caption {
      caption-side: top;
    }
    th {
      text-align: center;
    }
  }
</style>
