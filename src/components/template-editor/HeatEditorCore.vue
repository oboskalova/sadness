<template>
  <div
    class="core"
    ref="workspace"
    :class="{ loading }"    
    @mousedown.self="resetActive">
    <CoreTemplate
      v-if="!loading"
      :style="translateStyle"
      :settings="templateProps"
      :scene="activeScene" />
    <div
      class="scroll scroll-vertical">
      <div
        class="scroll-worm"
        :style="vScrollStyle"
        @mousedown="startVerticalScroll">
      </div>
    </div>
    <div class="scroll scroll-horizontal">
      <div
        class="scroll-worm"
        :style="hScrollStyle"
        @mousedown="startHorizontalScroll">
      </div>
    </div>
  </div>
</template>

<script>
import CoreTemplate from './CoreTemplate'

export default {
  name: 'heat-editor-core',
  props: ['loading', 'activeScene'],
  components: { CoreTemplate },
  watch: {
    scale () {
      this.updateScrollProps()
    },
    templateProps () {
      this.updateScrollProps()
    },
    templateWidth () {
      this.updateScrollProps()
    },
    templateHeight () {
      this.updateScrollProps()
    }
  },
  computed: {
    vScrollStyle () {
      return {
        top: `${this.vWormTop}px`,
        height: `${this.vHeight}px`
      }
    },
    hScrollStyle () {
      return {
        left: `${this.hWormLeft}px`,
        width: `${this.hWidth}px`
      }
    },
    scale () {
      return this.$store.getters.scale
    },
    translateStyle () {
      const top = this.vFull ? '50%' : 0
      const left = this.hFull ? '50%' : 0
      const x = this.hFull ? this.templateOffsetX + 50 : this.templateOffsetX
      const y = this.vFull ? this.templateOffsetY + 50 : this.templateOffsetY
      return {
        top,
        left,
        transform: `translate(-${x}%,-${y}%)`
      }
    },
    templateProps () {
      return this.$store.getters.coreTemplate || {}
    },
    templateWidth () {
      return this.templateProps.width
    },
    templateHeight () {
      return this.templateProps.height
    },
    activeContainer () {
      return this.$store.getters.coreActiveContainer
    },
    templateOffsetX () {
      return this.hWormLeft / this.fieldWidth * 100
    },
    templateOffsetY () {
      return this.vWormTop / this.fieldHeight * 100
    }
  },
  mounted () {
    this.updateFields()
    window.addEventListener('resize', this.windowResizeHandler)
  },
  destroyed () {
    window.removeEventListener('resize', this.windowResizeHandler)
  },
  methods: {
    resetActive () {
      this.$store.commit('CHANGE_CONTAINER', this.activeScene)
    },
    updateFields () {
      this.fieldWidth = this.$refs.workspace.clientWidth - 11
      this.fieldHeight = this.$refs.workspace.clientHeight - 11
    },
    windowResizeHandler () {
      this.updateFields()
      this.updateScrollProps()
    },
    startVerticalScroll (event) {
      this.clickY = event.clientY
      this.startVWormTop = this.vWormTop
      document.addEventListener('mousemove', this.verticalScroll)
      document.addEventListener('mouseup', this.endVerticalScroll)
    },
    verticalScroll (event) {
      const dh = this.fieldHeight - this.vHeight
      let t = this.startVWormTop + event.clientY - this.clickY
      if (t < 0) t = 0
      if (t > dh) t = dh
      this.vWormTop = t
    },
    endVerticalScroll () {
      document.removeEventListener('mousemove', this.verticalScroll)
      document.removeEventListener('mouseup', this.endVerticalScroll)
    },
    startHorizontalScroll (event) {
      this.clickX = event.clientX
      this.startHWormLeft = this.hWormLeft
      document.addEventListener('mousemove', this.horizontalScroll)
      document.addEventListener('mouseup', this.endHorizontalScroll)
    },
    horizontalScroll (event) {
      const dw = this.fieldWidth - this.hWidth
      let l = this.startHWormLeft + event.clientX - this.clickX
      if (l < 0) l = 0
      if (l > dw) l = dw
      this.hWormLeft = l
    },
    endHorizontalScroll () {
      document.removeEventListener('mousemove', this.horizontalScroll)
      document.removeEventListener('mouseup', this.endHorizontalScroll)
    },
    updateScrollProps () {
      const fw = this.fieldWidth
      const fh = this.fieldHeight
      const tw = this.templateProps.width * this.scale
      const th = this.templateProps.height * this.scale
      let w = fw * fw / tw
      let h = fh * fh / th
      if (fw < w) w = fw
      if (fh < h) h = fh
      let l = this.hWormLeft + (this.hWidth - w) / 2
      let t = this.vWormTop + (this.vHeight - h) / 2
      if (l < 0) l = 0
      if (fw < l + w) {
        l = fw - w
      }
      if (t < 0) t = 0
      if (fh < t + h) {
        t = fh - h
      }
      this.hWidth = w
      this.hWormLeft = l
      this.vHeight = h
      this.vWormTop = t
      this.hFull = (fw / tw >= 1)
      this.vFull = (fh / th >= 1)
    }
  },
  data () {
    return {
      vFull: true,
      hFull: true,
      vHeight: 0,
      vWormTop: 0,
      hWidth: 0,
      hWormLeft: 0,
      startVWormTop: 0,
      startHWormLeft: 0,
      fieldWidth: 0,
      fieldHeight: 0
    }
  }
}
</script>

<style scoped>
.core {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.loading {
  background-image: url('/static/img/loading-spinner.gif');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 26px 26px;
}
.scroll {
  background: #333;
  position: absolute;
}
.scroll-vertical {
  top: 0;
  right: 0;
  width: 11px;
  height: 100%;
}
.scroll-vertical > .scroll-worm {
  width: 8px;
  height: 145px;
  margin-left: 3px;
}
.scroll-horizontal {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 11px;
}
.scroll-horizontal > .scroll-worm {
  width: 100px;
  height: 8px;
  margin-top: 3px;
}
.scroll-worm {
  position: absolute;
  border-radius: 4px;
  background: #fff;
  transition: opacity .5s cubic-bezier(.11,.7,0,1);
  cursor: pointer;
  opacity: 0.3;
}
.scroll-worm:hover {
  opacity: 0.4;
}
</style>
