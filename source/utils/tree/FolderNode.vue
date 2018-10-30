<template>
  <div class="folder-wrapper">
    <div
      :draggable="draggable"
      @dragstart="handleDragStart({
        type: 'folder',
        data: data,
      })"
      @dragover="handleDragOver"
      @drop="handleDrop"
      @dragend="handleDragEnd"
      @click.prevent="toggleOpen"
      class="folder clickable d-flex"
    >
      <span v-for="n in needPaddingLeft" class="padding"></span>
      <span v-if="data.deepLevel" class="padding">└</span>
      <span class="flex-fill">
        <slot
          name="folder"
          :data="data"
        />
      </span>
    </div>
    <div v-if="isOpen">
      <component
        v-for="treeData of data.children"
        :key="treeData.id"
        :is="treeData.children ? 'folderNode' : 'fileNode'"
        :data="treeData"
        :draggingFolderFile="draggingFolderFile"
        :draggable="draggable"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        @drop="handleChildrenDrop"
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
      </component>
    </div>
  </div>
</template>

<script>
  import { folderDataValidator, draggingDataValidator } from './validator';
  import FileNode from './FileNode';

  export default {
    name: 'FolderNode',
    props: {
      data: {
        validator: folderDataValidator,
        required: true,
      },
      draggingFolderFile: {
        validator: draggingDataValidator,
        required: true,
      },
      draggable: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        isOpen: !!this.data.initialOpen,
      };
    },
    computed: {
      needPaddingLeft() {
        return Math.max(this.data.deepLevel - 1, 0);
      },
    },
    methods: {
      toggleOpen() {
        this.isOpen = !this.isOpen;
      },
      handleDragStart(data) {
        this.$emit('dragstart', data);
      },
      handleDragOver(event) {
        const draggingTreeData = this.draggingFolderFile.data;
        const thisFolderId = this.data.id;
        const canDrop = !(
          this.data.children.find((treeData) => {
            return treeData.id === draggingTreeData.id;
          }) ||
          isTreeDataContainFolder(draggingTreeData, thisFolderId)
        );
        if (canDrop) {
          event.preventDefault();
        }
      },
      handleDrop() {
        this.$emit('drop', this.data.source.id);
      },
      handleChildrenDrop(data) {
        this.$emit('drop', data);
      },
      handleDragEnd() {
        this.$emit('dragend');
      },
    },
    components: {
      fileNode: FileNode,
    },
  };

  function isTreeDataContainFolder(treeNodeData, folderId) {
    const treeNodeChildren = treeNodeData.children;
    if (treeNodeChildren) {
      return treeNodeData.id === folderId || treeNodeChildren.some((treeNodeData) => {
        return isTreeDataContainFolder(treeNodeData, folderId);
      });
    }

    return false;
  }
</script>

<style lang="stylus" scoped>
  div.folder-wrapper {
    margin-bottom: .25rem!important;

    > div.folder {
      > span.padding {
        display: inline-block;
        width: 1rem;
      }
    }
  }
</style>
