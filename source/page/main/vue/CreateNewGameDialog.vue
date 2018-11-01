<template>
  <div class="modal fade show d-block">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{$t('createNewGame')}}
          </h5>
          <button
            @click="hideCreateGameDialog"
            type="button"
            class="close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="createNewGameName">{{$t('newGameName')}}</label>
            <input
              v-model="gameName"
              :placeholder="$t('pleaseEnterNewGameName')"
              id="createNewGameName"
              type="text"
              class="form-control"
            />
          </div>
          <collapse-card>
            <span slot="title">{{$t('selectGameTemplate')}}</span>
            <folder-file-tree-view
              slot="body"
              :folderList="templateFolderList"
              :fileList="templateList"
              :defaultOpenFolder="false"
              :draggable="false"
            >
              <div
                slot="folder"
                slot-scope="{ data }"
                v-if="data.id !== ''"
                class="text-info clickable"
              >
                <icon
                  :icon="data.isOpen ? 'folder-open' : 'folder'"
                />
                {{data.source.name}}
              </div>
              <div
                slot="file"
                slot-scope="{ data }"
              >
                <label class="form-check">
                  <input
                    :value="data.source"
                    :checked="selectedTemplate === data.source"
                    @change="handleSelectTemplate($event.currentTarget.checked, data.source)"
                    type="checkbox"
                    name="template"
                    class="form-check-input"
                  />
                  <span class="form-check-label">
                    {{data.source.name}}
                  </span>
                </label>
              </div>
            </folder-file-tree-view>
          </collapse-card>
        </div>
        <div class="modal-footer">
          <button
            @click="hideCreateGameDialog"
            type="button"
            class="btn btn-secondary"
          >
            {{$t('cancel')}}
          </button>
          <button
            @click="handleCreateGame"
            type="button"
            class="btn btn-primary"
          >
            {{$t('createNewGame')}}
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
          name: this.gameName,
          ...this.selectedTemplate,
        };
        this.$store.dispatch('maker/createGame', newGame).then((gid) => {
          this.hideCreateGameDialog();
          window.open(`./makerMain.html?gid=${gid}`);
        });
      },
    },
    components: {
      'collapse-card': CollapseCard,
      'folder-file-tree-view': FolderFileTreeView,
    },
  };
</script>