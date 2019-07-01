<template>
  <form>
    <panel-game-list-in-making />
    <collapse-card>
      <span slot="title">
        {{ $t('basicSettings') }}
      </span>
      <div 
        slot="body"
        class="form-group"
      >
        <label for="language">
          {{ $t('language') }}
        </label>
        <select
          v-model="locale"
          name="language"
          class="form-control"
        >
          <option value="en">
            English
          </option>
          <option value="zh-tw">
            繁體中文
          </option>
          <option value="zh-cn">
            简体中文
          </option>
        </select>
      </div>
    </collapse-card>
    <create-game-dialog v-if="isShowCreateGameDialog" />
  </form>
</template>

<script>
  import { mapState } from 'vuex';
  import { mapModel } from 'storeHelpers';
  import PanelGameListInMaking from './PanelGameListInMaking';
  import CollapseCard from 'utils/collapseCard/CollapseCard';
  import CreateNewGameDialog from './CreateNewGameDialog';

  export default {
    name: 'Main',
    components: {
      'panel-game-list-in-making': PanelGameListInMaking,
      'collapse-card': CollapseCard,
      'create-game-dialog': CreateNewGameDialog,
    },
    computed: {
      ...mapModel('i18n', [
        'locale',
      ]),
      ...mapState('page', [
        'isShowCreateGameDialog',
      ]),
    },
    methods: {
    },
  };
</script>