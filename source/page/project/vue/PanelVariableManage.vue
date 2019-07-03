<template>
  <collapse-card>
    <span slot="title">{{$t('variableManage')}}</span>
    <div slot="body" class="form-group">
      <folder-file-tree-view
        slot="body"
        :folderList="variableFolder"
        :fileList="variableList"
        :defaultOpenFolder="true"
        :draggable="false"
      >
        <div
          slot="folder"
          slot-scope="{ data }"
          class="text-info clickable"
        >
          <icon
            :icon="data.isOpen ? 'folder-open' : 'folder'"
          />
          {{data.source.name}}
          <icon
            v-if="data.id !== ''"
            :title="$t('destroyFolder')"
            icon="trash-alt"
            class="float-right text-danger clickable"
          />
        </div>
        <div
          slot="file"
          slot-scope="{ data }"
        >
          <span class="text-primary">
            {{data.source.type}}
          </span>
          <span class="text-secondary">
            {{data.source.name}}
          </span>
          <icon
            :title="$t('destroyItem')"
            icon="trash-alt"
            class="float-right text-danger clickable"
          />
        </div>
      </folder-file-tree-view>
    </div>
  </collapse-card>
</template>

<script>
  import { mapState } from 'vuex';
  import CollapseCard from 'utils/collapseCard/CollapseCard';

  window.mapMutations = mapMutations;
  export default {
    name: 'PanelVariableManage',
    computed: {
    },
    components: {
      'collapse-card': CollapseCard,
    },
  };
</script>