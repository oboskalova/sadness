<template>
  <div
  v-if="settings.show && !settings.hide"
  class="core-container"
  :class="{ 'active': active && isScene }"
  :style="styleObject"
  @mousedown.self="selectContainer">
  <div
    :class="{tools: toolsActive}"
    :style="toolsStyleObject"
    @mousedown.self="selectContainer"
    >
    <WidgetViewController :settings="settings" :containerStyle="styleObject"></WidgetViewController>
    <!-- <div v-if="content" class="text-content" v-html="contentHtml" :style="contentStyleObj" @mousedown="selectThis"></div> -->
    <span
    v-if="toolsActive && editable"
    class="resize resize-left-top"
    @mousedown.self="changeActionType('updatingTypeLeftTop')">
    </span>
    <span
    v-if="toolsActive && editable"
    class="resize resize-left-middle"
    @mousedown.self="changeActionType('updatingTypeLeft')">
    </span>
    <span
    v-if="toolsActive && editable"
    class="resize resize-left-bottom"
    @mousedown.self="changeActionType('updatingTypeLeftBottom')">
    </span>
    <span
    v-if="toolsActive && editable"
    class="resize resize-middle-top"
    @mousedown.self="changeActionType('updatingTypeTop')">
    </span>
    <span
    v-if="toolsActive && editable"
    class="resize resize-middle-bottom"
    @mousedown.self="changeActionType('updatingTypeBottom')">
    </span>
    <span
    v-if="toolsActive && editable"
    class="resize resize-right-top"
    @mousedown.self="changeActionType('updatingTypeRightTop')">
    </span>
    <span
    v-if="toolsActive && editable"
    class="resize resize-right-middle"
    @mousedown.self="changeActionType('updatingTypeRight')">
    </span>
    <span
    v-if="toolsActive && editable"
    class="resize resize-right-bottom"
    @mousedown.self="changeActionType('updatingTypeRightButton')">
    </span>
  </div>
   <core-container
    v-for="( value, key ) in children"
    :key="key"
    :settings="value" />
  </div>
</template>

<script>
  import WidgetViewController from './WidgetViewController'
  import Lib from '../../lib/index'

  export default {
    name: 'core-container',
    props: ['settings'],
    components: {
      WidgetViewController
    },
    data () {
      return {
        isPress: false,
        startX: this.settings.x,
        startY: this.settings.y
      }
    },
    created () {
      window.addEventListener('keydown', this.containerKeyDown)
      window.addEventListener('keyup', this.containerKeyUp)
    },
    beforeDestroy () {
      window.removeEventListener('keydown', this.containerKeyDown)
      window.addEventListener('keyup', this.containerKeyUp)
    },
    computed: {
      editable () {
        return this.settings.editable && !this.settings.lock
      },
      cId () {
        return this.$props.settings.id
      },
      scale () {
        return this.$store.getters.scale
      },
      isScene () {
        return this.$props.settings.parent_id === 0
      },
      active () {
        return (this.cId === this.$store.getters.coreActiveContainer.id)
      },
      containsActive () {
        let id = this.$store.getters.coreActiveContainer.id
        const parents = this.$store.getters.coreBackRelation
        while (id) {
          id = parents[id]
          if (id === this.cId) {
            return true
          }
        }
        return false
      },
      children () {
        return this.$store.getters.coreGraph[this.cId]
      },
      styleObject () {
        const s = this.scale
        const p = this.$props.settings
        // const z = this.active || this.containsActive ? Number.MAX_SAFE_INTEGER : p.z
        const bgColor = p.background_color || ''
        const previewSrc = this.preview || ''
        return {
          top: `${s * p.y}px`,
          left: `${s * p.x}px`,
          width: `${s * p.width}px`,
          height: `${s * p.height}px`,
          backgroundColor: bgColor,
          backgroundImage: `url(${previewSrc})`,
          zIndex: p.z
        }
      },
      toolsStyleObject () {
        // const p = this.$props.settings
        // const z = this.active ? Number.MAX_SAFE_INTEGER : p.z
        // const bgColor = p.background_color || ''
        // const previewSrc = this.preview || ''
        let res = {
          zIndex: 1
        }
        if (this.content) res.height = '100%'
        return res
      },
      preview () {
        const widgets = (this.$store.getters.coreWidgets[this.cId] || []).filter(w => w.show)
        const len = widgets.length
        if (len) return widgets[len - 1].src
      },
      toolsActive () {
        return this.cId && this.active && !this.isScene
      },
      isModalOpen () {
        return this.$store.getters.isModalOpen
      },
      content () {
        const widgets = (this.$store.getters.coreWidgets[this.cId] || []).filter(w => w.show)
        const len = widgets.length
        if (len) {
          let w = widgets[len - 1]
          let content = JSON.parse(w.content)
          return content
        } else return null
      }
    },
    methods: {
      selectContainer () {
        console.log('change container', this.editable)
        this.$store.commit('CHANGE_CONTAINER', this.cId)
        this.editable ? this.changeActionType('updatingTypeMove') : this.changeActionType('None')
      },
      changeActionType (type) {
        this.$store.dispatch('updateActionType', type)
      },
      containerKeyDown (e) {
        // console.log(this.isModalOpen !== true)
        // console.log(this.$store.getters.modalWidgetType === null)
        // console.log(this.toolsActive)
        // console.log(this.toolsActive && (this.isModalOpen !== true) &&
        //   (this.$store.getters.modalWidgetType === null))
        if (this.toolsActive && this.isModalOpen !== true &&
          this.$store.getters.modalWidgetType === null && !this.settings.lock && this.editable) {
          this.settings.lock = e.repeat
          let p = this.$props.settings
          let rate = e.shiftKey ? 10 : 1
          if (!this.isPress) {
            this.startX = p.x
            this.startY = p.y
            this.isPress = true
          }
          let keyCode = e.keyCode
          const keysConst = Lib.keysConst
          switch (keyCode) {
            case keysConst.DOM_VK_UP:
              p.y -= rate
              break
            case keysConst.DOM_VK_DOWN:
              p.y += rate
              break
            case keysConst.DOM_VK_LEFT:
              p.x -= rate
              break
            case keysConst.DOM_VK_RIGHT:
              p.x += rate
              break
          }
        }
      },
      containerKeyUp (e) {
        if (this.toolsActive && this.isModalOpen !== true &&
          this.$store.getters.modalWidgetType === null && !this.settings.lock && this.editable) {
          let keyCode = e.keyCode
          const keysConst = Lib.keysConst
          if (keyCode === keysConst.DOM_VK_UP ||
            keyCode === keysConst.DOM_VK_DOWN ||
            keyCode === keysConst.DOM_VK_LEFT ||
            keyCode === keysConst.DOM_VK_RIGHT) {
            console.log('push moe to history')
            this.pushToHistory()
            this.isPress = false
          }
        }
      },
      pushToHistory () {
        let changed = false
        const command = {
          type: 'updateContainerProps',
          context: {
            id: this.cId,
            type: 'container'
          },
          oldParams: {},
          newParams: {}
        }
        const p = this.$props.settings
        if (p.x !== this.startX) {
          command.oldParams.x = this.startX
          command.newParams.x = p.x
          changed = true
        }
        if (p.y !== this.startY) {
          command.oldParams.y = this.startY
          command.newParams.y = p.y
          changed = true
        }
        if (changed) {
          this.$store.dispatch('historyPush', command)
        }
      }
    }
  }
</script>

<style scoped>
  .core-container,
  .tools {
    background-size: cover;
    background-repeat: none;
    background-position: center;
  }

  .core-container {
    position: absolute;
    box-shadow: 0 0 0 1.5px #ffffff3f;
  }

  .core-container.active {
    box-shadow: 0 0 0 1.5px #00b1b7a6;
  }

  .tools {
    width: 100%;
    height: 100%;
    position: relative;
    box-shadow: 0 0 0 1.5px #00b1b7a6;
    z-index: -1;
  }

  .resize {
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: #00b1b7;
    display: block;
    position: absolute;
  }

  .resize-left-top {
    top: -4px;
    left: -4px;
    cursor: nw-resize;
  }

  .resize-left-middle {
    top: 50%;
    left: -4.5px;
    transform: translateY(-50%);
    cursor: w-resize;
  }

  .resize-left-bottom {
    left: -4px;
    bottom: -4px;
    cursor: sw-resize;
  }

  .resize-middle-top {
    top: -4.5px;
    left: 50%;
    transform: translateX(-50%);
    cursor: n-resize;
  }

  .resize-middle-bottom {
    left: 50%;
    bottom: -4.5px;
    transform: translateX(-50%);
    cursor: s-resize;
  }

  .resize-right-top {
    top: -4px;
    right: -4px;
    cursor: ne-resize;
  }

  .resize-right-middle {
    top: 50%;
    right: -4.5px;
    transform: translateY(-50%);
    cursor: e-resize;
  }

  .resize-right-bottom {
    right: -4px;
    bottom: -4px;
    cursor: se-resize;
  }

  .preview {
    width: 100%;
    display: block;
  }

</style>