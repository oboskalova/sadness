<template>
    <div ref="textContent" class="text-content" v-html="htmlContent" 
      :style="contentStyleObj"></div>
</template>

<script>
export default {
  name: 'media-text-view',
  props: ['content', 'settings'],
  data () {
    return {
      defaultFontSize: 16,
      defaultPadding: 2
    }
  },
  computed: {
    scale () {
      return this.$store.getters.scale
    },
    htmlContent () {
      return this.content.text
    },
    contentStyleObj () {
      const s = this.scale
      const p = this.settings
      let res = {}
      res.width = `${p.width}px`
      res.height = `${p.height}px`
      res.fontSize = `${Number(this.defaultFontSize)}px`
      res.padding = `${Number(this.defaultPadding)}px`
      res.overflow = 'hidden'
      res.transform = `scaleX(${s}) scaleY(${s})`
      res.transformOrigin = '0 0'
      if (this.content.mode === 'horizontal') res.whiteSpace = 'nowrap'
      return res
    }
  },
  methods: {}
}
</script>
