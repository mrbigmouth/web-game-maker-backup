<template>
  <div
    :style="{
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
    }"
    class="modal-content"
  >
    <div
      @mousedown.left="handleDragStart"
      class="modal-header bg-info"
      draggable="true"
    >
      <slot name="header"></slot>
      <a
        @click.prevent="handleToggleMaximize"
        class="btn btn-warning text-white btn-sm position-absolute"
        style="top: 10px; right: 10px;"
        href="#"
      >
        <i :class="['fa', isMaximize ? 'fa-window-minimize' : 'fa-window-maximize']"></i>
      </a>
    </div>
    <div v-if="isMaximize" class="modal-body">
      <slot name="body"></slot>
    </div>
    <div v-if="isMaximize" class="modal-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  import { check } from '../../utils/check';

  export default {
    name: 'DraggableDialog',
    props: {
      position: {
        validator(value) {
          if (!value) {
            return true;
          }
          check(value, {
            x: Number,
            y: Number,
          });

          return true;
        },
        required: false,
      },
      width: {
        type: Number,
        required: true,
      },
      autoMaximize: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        ...generatePositionStyle(this),
        dragStartPosition: null,
        isMaximize: this.autoMaximize,
      };
    },
    created() {
      document.addEventListener('mousemove', this.handleDragging);
      document.addEventListener('mouseup', this.handleDragEnd);
    },
    destroyed() {
      document.removeEventListener('mousemove', this.handleDragging);
      document.removeEventListener('mouseup', this.handleDragEnd);
    },
    methods: {
      handleDragStart(event) {
        event.preventDefault();
        this.dragStartPosition = {
          x: event.pageX - this.left,
          y: event.pageY - this.top,
        };
      },
      handleDragEnd() {
        this.dragStartPosition = null;
      },
      handleDragging(event) {
        if (this.dragStartPosition) {
          const { x, y } = this.dragStartPosition;
          this.left = event.pageX - x;
          this.top = event.pageY - y;
        }
      },
      handleToggleMaximize() {
        this.isMaximize = !this.isMaximize;
      },
    },
  };

  function generatePositionStyle(vm) {
    if (typeof vm.position === 'object') {
      return {
        left: vm.position.x,
        top: vm.position.y,
      };
    }
    const wWidth = window.innerWidth;
    const width = vm.width;

    return {
      left: wWidth > width ? (window.innerWidth - vm.width) / 2 : 0,
      top: (document.body.scrollTop || document.documentElement.scrollTop) + 50,
    };
  }
</script>

<style lang="scss" scoped>
  .modal-content {
    position: absolute;
  }
  .modal-header {
    cursor: move;
    position: relative;
  }
</style>
