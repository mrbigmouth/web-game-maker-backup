<template>
  <div
    class="file d-flex"
    :draggable="draggable"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <span
      v-for="n in needPaddingLeft"
      :key="n"
      class="padding"
    />
    <span
      v-if="data.deepLevel"
      class="padding"
    >
      └
    </span>
    <span class="flex-fill">
      <slot
        name="file"
        :data="data"
      />
    </span>
  </div>
</template>

<script>
  import { fileDataValidator } from './validator';

  export default {
    name: 'FileNode',
    props: {
      data: {
        validator: fileDataValidator,
        required: true,
      },
      draggable: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {};
    },
    computed: {
      needPaddingLeft() {
        return Math.max(this.data.deepLevel - 1, 0);
      },
    },
    methods: {
      handleDragStart() {
        this.$emit('dragstart', {
          type: 'file',
          data: this.data,
        });
      },
      handleDragEnd() {
        this.$emit('dragend');
      },
    },
  };
</script>

<style lang="stylus" scoped>
  div.file {
    margin-bottom: .25rem!important;

    > span.padding {
      display: inline-block;
      width: 1rem;
    }
  }
</style>