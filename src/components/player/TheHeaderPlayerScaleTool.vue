<template>
  <ScaleTool
    :onZoomIn="zoomHandler"
    :onZoomOut="zoomHandler"
    mode="player" />
</template>

<script>
import ScaleTool from '../common/ScaleTool'

export default {
  name: 'the-header-player-scale-tool',
  components: { ScaleTool },
  methods: {
    zoomHandler (oldZoom, newZoom) {
      this.$store.commit('PLAYER_ZOOM', { oldZoom, newZoom })
    }
  }
}
</script>
