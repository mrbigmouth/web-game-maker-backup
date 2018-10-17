<template>
  <div
    v-if="isDisplayConfirmDialog"
    class="modal fade show d-block"
  >
    <div class="modal-backdrop fade show" style="z-index: 1042;"></div>
    <div class="modal-dialog" style="z-index: 1043;">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{confirmDialogTitle}}</h5>
        </div>
        <div class="modal-body">
          <icon v-if="confirmDialogIcon" :icon="confirmDialogIcon" />
          <span v-html="confirmDialogMessage"></span>
        </div>
        <div class="modal-footer">
          <a
            v-if="onNo"
            @click.prevent="handleYes"
            class="btn btn-primary"
            href="#"
          >
            {{$t('yes')}}
          </a>
          <a
            v-if="onNo"
            @click.prevent="handleNo"
            class="btn btn-primary"
            href="#"
          >
            {{$t('no')}}
          </a>
          <a
            v-else
            @click.prevent="handleYes"
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
