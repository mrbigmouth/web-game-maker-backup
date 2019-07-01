<template>
  <form>
    <folder-node
      :data="treeData"
      :dragging-folder-file="draggingFolderFile"
      :draggable="draggable"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
      @drop="handleDrop"
    >
      <template
        slot="folder"
        slot-scope="{ data }"
      >
        <slot
          name="folder"
          :data="data"
        />
      </template>
      <template
        slot="file"
        slot-scope="{ data }"
      >
        <slot
          name="file"
          :data="data"
        />
      </template>
    </folder-node>
  </form>
</template>

<script>
  import { inputDataListValidator } from './validator';
  import FolderNode from './FolderNode';

  export default {
    name: 'FolderFileTreeView',
    components: {
      folderNode: FolderNode,
    },
    props: {
      folderList: {
        validator: inputDataListValidator,
        required: true,
      },
      fileList: {
        validator: inputDataListValidator,
        required: true,
      },
      defaultOpenFolder: {
        type: [Boolean, String],
        default: false,
      },
      draggable: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        draggingFolderFile: null,
      };
    },
    computed: {
      treeData() {
        const folderList = this.folderList;
        const fileList = this.fileList;
        const defaultOpenFolder = this.defaultOpenFolder;
        const treeDataList = [];
        const processedFolder = new Set();
        const processedFolderHash = {};
        const processedFile = new Set();
        while (processedFolder.size < folderList.length) {
          folderList.forEach((folderData) => {
            const folderId = folderData.id;
            if (!processedFolder.has(folderId)) {
              const folderBelong = folderData.folder;
              if (!folderBelong || processedFolder.has(folderBelong)) {
                let initialOpen = false;
                if (typeof defaultOpenFolder === 'boolean') {
                  initialOpen = defaultOpenFolder;
                }
                else if (typeof defaultOpenFolder === 'string' && folderId === defaultOpenFolder) {
                  initialOpen = true;
                  // 往前追溯所有父folder，令其open
                  let parentFolder = processedFolderHash[folderBelong];
                  while (parentFolder) {
                    parentFolder.initialOpen = true;
                    parentFolder = processedFolderHash[parentFolder.folder];
                  }
                }
                const treeData = {
                  id: `folder${folderId}`,
                  deepLevel: folderBelong ? (processedFolderHash[folderBelong].deepLevel + 1) : 1,
                  initialOpen,
                  folder: folderBelong,
                  children: [],
                  source: folderData,
                };
                if (folderBelong) {
                  const belongFolder = processedFolderHash[folderBelong];
                  belongFolder.children.push(treeData);
                }
                else {
                  treeDataList.push(treeData);
                }
                processedFolderHash[folderId] = treeData;
                processedFolder.add(folderId);
              }
            }
          });
        }
        while (processedFile.size < fileList.length) {
          fileList.forEach((fileData) => {
            const fileId = fileData.id;
            if (!processedFile.has(fileId)) {
              const folderBelong = fileData.folder;
              if (!folderBelong || processedFolder.has(folderBelong)) {
                const treeData = {
                  id: `file${fileId}`,
                  deepLevel: folderBelong ? (processedFolderHash[folderBelong].deepLevel + 1) : 1,
                  folder: folderBelong,
                  source: fileData,
                };
                if (folderBelong) {
                  const belongFolder = processedFolderHash[folderBelong];
                  belongFolder.children.unshift(treeData);
                }
                else {
                  treeDataList.unshift(treeData);
                }
                processedFile.add(fileData);
              }
            }
          });
        }

        return {
          id: '',
          deepLevel: 0,
          initialOpen: true,
          folder: '',
          children: treeDataList,
          source: {},
        };
      },
    },
    methods: {
      handleDragStart(data) {
        if (this.draggable) {
          this.draggingFolderFile = data;
        }
      },
      handleDragEnd() {
        this.draggingFolderFile = null;
      },
      handleDrop(folderId) {
        if (this.draggingFolderFile) {
          this.$emit('moveToFolder', {
            type: this.draggingFolderFile.type,
            id: this.draggingFolderFile.data.source.id,
            folderId: folderId || '',
          });
        }
      },
      handleClickButton(data) {
        this.$emit('clickButton', data);
      },
      handleClickLink(data) {
        this.$emit('clickLink', data);
      },
      handleSelectItem(data) {
        this.$emit('selectItem', data);
      },
    },
  };
</script>
