<template>
    <div :style="wrapperStyleObj">
      <iframe ref="iframe" v-on:click.native="clickEvent" scrolling="no" frameborder="0" framespacing="0" 
        sandbox="allow-forms allow-same-origin allow-scripts allow-presentation" allowtransparency="true" :src="content.link" :style="contentStyleObj"></iframe>
    </div>
</template>

<script>

export default {
  name: 'media-text-view',
  props: ['content', 'settings'],
  mounted () {
    console.log('mounted')
    console.log(this.$refs.iframe)
    const iframe = this.$refs.iframe
    iframe.addEventListener('load', (event) => {
      console.log('load')
      iframe.addEventListener('click', (event) => {
        console.log('click')
      })
    }, false)
  },
  data () {
    return {}
  },
  computed: {
    scale () {
      return this.$store.getters.scale
    },
    contentStyleObj () {
      const s = this.scale
      const p = this.settings
      let res = {}
      let zoom = this.content.zoom
      let newScale = this.content.zoom * s
      let horizIndent = this.content.horizIndent
      let verticIndent = this.content.verticIndent
      console.log('contentStyleObj')
      console.log(this.content.horizIndent)
      res.width = `${p.width / zoom + horizIndent / zoom}px`
      res.height = `${p.height / zoom + verticIndent / zoom}px`
      res.transform = `scale(${newScale}) translate(-${horizIndent / zoom}px, -${verticIndent / zoom}px)`
      res.transformOrigin = `0px 0px 0px`
      res.pointerEvents = 'none'
      // res.width = `calc(${newSize}% + ${this.horizIndent}px)`
      // res.height = `calc(${newSize}% + ${this.verticIndent}px)`
      // res.transform = `scale(${this.zoom * s})`
      // res.transformOrigin = `0px 0px 0px`
      // res.margin = `-${this.verticIndent}px 0px 0px -${this.horizIndent}px`
      return res
    },
    wrapperStyleObj () {
      let res = {}
      const s = this.scale
      const p = this.settings
      res.height = `${p.height * s}px`
      res.overflow = 'hidden'
      return res
    }
  }
}
</script>

<style scopted>
</style>

