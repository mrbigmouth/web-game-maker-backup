<template>
  <div class="modal fade show d-block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ $t('createNewGame') }}
          </h5>
          <button
            class="close"
            type="button"
            @click="hideCreateGameDialog"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="createNewGameName">
              {{ $t('newGameName') }}
            </label>
            <input
              id="createNewGameName"
              v-model="gameName"
              :placeholder="$t('pleaseEnterNewGameName')"
              type="text"
              class="form-control"
            />
          </div>
          <collapse-card>
            <span slot="title">{{ $t('selectGameTemplate') }}</span>
            <folder-file-tree-view
              slot="body"
              :folder-list="templateFolderList"
              :file-list="templateList"
              :default-open-folder="false"
              :draggable="false"
            >
              <div
                v-if="data.id !== ''"
                slot="folder"
                slot-scope="{ data }"
                class="text-info clickable"
              >
                <icon
                  :icon="data.isOpen ? 'folder-open' : 'folder'"
                />
                {{ data.source.name }}
              </div>
              <div
                slot="file"
                slot-scope="{ data }"
              >
                <label class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="template"
                    :value="data.source"
                    :checked="selectedTemplate === data.source"
                    @change="handleSelectTemplate($event.currentTarget.checked, data.source)"
                  />
                  <span class="form-check-label">
                    {{ data.source.name }}
                  </span>
                </label>
              </div>
            </folder-file-tree-view>
          </collapse-card>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-primary"
            type="button"
            @click="handleCreateGame"
          >
            {{ $t('createNewGame') }}
          </button>
          <button
            class="btn btn-secondary"
            type="button"
            @click="hideCreateGameDialog"
          >
            {{ $t('cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';
  import { templateList, templateFolderList } from '../gameTemplate';
  import CollapseCard from 'utils/collapseCard/CollapseCard';
  import FolderFileTreeView from 'utils/tree/FolderFileTree';

  export default {
    name: 'CreateNewGameDialog',
    components: {
      'collapse-card': CollapseCard,
      'folder-file-tree-view': FolderFileTreeView,
    },
    data() {
      return {
        gameName: '',
        selectedTemplate: templateList[0],
        templateFolderList: templateFolderList,
        templateList: templateList,
      };
    },
    methods: {
      ...mapMutations('page', [
        'hideCreateGameDialog',
      ]),
      handleSelectTemplate(checked, selectedTemplate) {
        if (checked) {
          this.selectedTemplate = selectedTemplate;
        }
        else {
          this.selectedTemplate = templateList[0];
        }
      },
      handleCreateGame() {
        const newGame = {
          ...this.selectedTemplate,
          name: this.gameName,
        };
        this.$store.dispatch('maker/createGame', newGame).then((gid) => {
          this.hideCreateGameDialog();
          window.open(`./makerMain.html?gid=${gid}`);
        });
      },
    },
  };
</script>