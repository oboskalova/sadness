<template>
  <div v-if="!settings.hide" class="box" :id="containerId" :style="styleObject" @click.stop="handler">
    <div class="box-playlist">
      <Playlist :list="playlist" :random="random" :id="containerId" @filler="filler" :containerStyle="styleObject"/>
      <container
        v-for="c in childrens"
        :key="c.id"
        :settings="c.settings"
        :children="c.children" />
    </div>
  </div>
</template>

<script>
import Playlist from './Playlist'

export default {
  name: 'container',
  props: ['settings', 'children'],
  components: { Playlist },
  data () {
    return {
      filled: false
    }
  },
  computed: {
    childrens () {
      return this.children.sort((a, b) => { return a.settings.id - b.settings.id })
    },
    fillIt () {
      return true
    },
    action () {
      return JSON.parse(this.settings.action)
    },
    styleObject () {
      const s = this.$props.settings
      var bg
      if (this.fillIt) {
        bg = s.background_color || 'rgba(0,0,0,0)'
      } else {
        bg = 'rgba(0,0,0,0)'
      }
      return {
        top: `${s.y}px`,
        left: `${s.x}px`,
        width: `${s.width}px`,
        height: `${s.height}px`,
        background: bg,
        zIndex: this.settings.z
      }
    },
    playlist () {
      return [...this.$props.settings.playlist]
    },
    random () {
      return !!this.$props.settings.random
    },
    maxZIndex () {
      return this.$store.getters.zIndex
    },
    containerId () {
      return this.$props.settings.id
    }
  },
  methods: {
    filler (flag) {
      this.filled = flag
    },
    handler () {
      if (!this.action || !this.action.click) return
      const params = this.action.click
      if (params.active) {
        this.$root.$emit('open', params)
      }
    }
  }
}
</script>

<style scoped>
  .box {
    display: block;
    position: absolute;
  }
  .box-playlist {
    width: 100%;
    height: 100%;
    position:absolute;
  }
</style>
