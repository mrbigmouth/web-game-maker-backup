<template>
  <div
    v-if="errorList.length > 0"
    class="modal fade show d-block"
  >
    <div class="modal-backdrop fade show" style="z-index: 1042;"></div>
    <div class="modal-dialog" style="z-index: 1043;">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-danger">{{$t('error')}}</h5>
        </div>
        <div class="modal-body text-danger">
          <icon icon="exclamation-circle" />
          {{errorMessage}}
        </div>
        <div class="modal-footer">
          <a
            @click.prevent="confirmError"
            class="btn btn-primary"
            href="#"
          >
            {{$t('ok')}}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';

  export default {
    name: 'ConfirmDialog',
    computed: {
      ...mapState([
        'errorList',
      ]),
      errorMessage() {
        const errorList = this.$store.state.errorList;
        if (errorList && errorList.length > 0) {
          const error = this.$store.state.errorList[0];
          if (error.code) {
            return this.$t(error.code);
          }

          return error.message || this.$t('unknownError');
        }

        return '';
      },
    },
    methods: {
      ...mapMutations([
        'confirmError',
      ]),
    },
  };
</script>
