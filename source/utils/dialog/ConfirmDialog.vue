<template>
  <div
    v-if="isDisplayConfirmDialog"
    class="modal fade show d-block"
  >
    <div
      class="modal-backdrop fade show"
      style="z-index: 1042;"
    />
    <div
      class="modal-dialog"
      style="z-index: 1043;"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ confirmDialogTitle }}
          </h5>
        </div>
        <div class="modal-body">
          <icon
            v-if="confirmDialogIcon"
            :icon="confirmDialogIcon"
          />
          <span v-html="confirmDialogMessage" />
        </div>
        <div class="modal-footer">
          <a
            v-if="onNo"
            class="btn btn-primary"
            href="#"
            @click.prevent="handleYes"
          >
            {{ $t('yes') }}
          </a>
          <a
            v-if="onNo"
            class="btn btn-primary"
            href="#"
            @click.prevent="handleNo"
          >
            {{ $t('no') }}
          </a>
          <a
            v-else
            class="btn btn-primary"
            href="#"
            @click.prevent="handleYes"
          >
            {{ $t('ok') }}
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
      ...mapState('page/confirmDialog', [
        'isDisplayConfirmDialog',
        'confirmDialogIcon',
        'confirmDialogTitle',
        'confirmDialogMessage',
        'onYes',
        'onNo',
      ]),
    },
    methods: {
      ...mapMutations('page/confirmDialog', [
        'showConfirmDialog',
        'handleYes',
        'handleNo',
      ]),
    },
  };
</script>
