<template>
  <div class="card">
    <div @click="toggle" class="card-header">
      <h5 class="mb-0">
        <slot name="title"></slot>
        <i
          :class="['fa', collapse ? 'fa-folder' : 'fa-folder-open']"
          aria-hidden="true"
        >
        </i>
      </h5>
    </div>
    <div :class="['collapse', collapse ? '' : 'show']">
      <div class="card-body">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CollapseCard',
    props: {
      initialCollapse: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        collapse: this.initialCollapse,
      };
    },
    methods: {
      toggle() {
        this.collapse = !this.collapse;
        if (this.collapse) {
          this.$emit('close');
        }
        else {
          this.$emit('open');
        }
        this.$emit('toggle');
      },
    },
  };
</script>

<style scoped>
  .card-header {
    cursor: pointer;
  }
</style>
