<template>
  <div
    class="core-template"
    :style="styleObject"
    @mousedown="mouseHandler">
    <CoreContainer
      :settings="activeScene" />
  </div>
</template>

<script>
import CoreContainer from './CoreContainer'

export default {
  name: 'core-template',
  props: ['settings', 'scene'],
  components: { CoreContainer },
  watch: {
    styleObject () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        const resizeFunction = this.$store.getters.resizeFunction
        if (resizeFunction) {
          resizeFunction()
        }
      }, 500)
    }
  },
  computed: {
    scale () {
      return this.$store.getters.scale
    },
    styleObject () {
      const s = this.scale
      const p = this.$props.settings
      return {
        width: `${s * p.width}px`,
        height: `${s * p.height}px`
      }
    },
    activeScene () {
      const sceneId = this.$props.scene
      return this.$store.getters.coreScene[sceneId] || {}
    },
    activeContainer () {
      return this.$store.getters.coreActiveContainer
    },
    actionType () {
      return this.$store.getters.coreActionType
    }
  },
  methods: {
    mouseHandler (event) {
      if (this.activeContainer.parent_id === 0) return
      this.startUpdating(event.clientX, event.clientY)
      document.addEventListener('mousemove', this.updating)
      document.addEventListener('mouseup', this.endUpdating)
    },
    startUpdating (x, y) {
      this.clickX = x
      this.clickY = y
      this.startX = this.activeContainer.x
      this.startY = this.activeContainer.y
      this.startWidth = this.activeContainer.width
      this.startHeight = this.activeContainer.height
    },
    updating (event) {
      if (this.activeContainer.editable && !this.activeContainer.lock) {
        this.$store.dispatch(this.actionType, {
          x: this.startX,
          y: this.startY,
          dx: (event.clientX - this.clickX) / this.scale | 0,
          dy: (event.clientY - this.clickY) / this.scale | 0,
          width: this.startWidth,
          height: this.startHeight
        })
      }
    },
    endUpdating () {
      document.removeEventListener('mousemove', this.updating)
      document.removeEventListener('mouseup', this.endUpdating)
      if (this.activeContainer.editable && !this.activeContainer.lock) {
        this.$store.dispatch('updateActionType', 'updatingTypeMove')
      } else {
        this.$store.dispatch('updateActionType', 'None')
      }
      this.pushToHistory()
    },
    pushToHistory () {
      let changed = false
      const command = {
        type: 'updateContainerProps',
        context: {
          id: this.activeContainer.id,
          type: 'container'
        },
        oldParams: {},
        newParams: {}
      }
      if (this.activeContainer.x !== this.startX) {
        command.oldParams.x = this.startX
        command.newParams.x = this.activeContainer.x
        changed = true
      }
      if (this.activeContainer.y !== this.startY) {
        command.oldParams.y = this.startY
        command.newParams.y = this.activeContainer.y
        changed = true
      }
      if (this.activeContainer.width !== this.startWidth) {
        command.oldParams.width = this.startWidth
        command.newParams.width = this.activeContainer.width
        changed = true
      }
      if (this.activeContainer.height !== this.startHeight) {
        command.oldParams.height = this.startHeight
        command.newParams.height = this.activeContainer.height
        changed = true
      }
      if (changed) {
        this.$store.dispatch('historyPush', command)
      }
    }
  },
  data () {
    return {
      clickX: 0,
      clickY: 0,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0
    }
  }
}
</script>

<style scoped>
.core-template {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  position: absolute;
}
</style>
