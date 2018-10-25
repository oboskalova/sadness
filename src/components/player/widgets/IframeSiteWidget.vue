<template>
  <iframe v-if="isShow" ref="iframe" frameborder="0" framespacing="0" allowtransparency="true"
     sandbox="allow-forms allow-same-origin allow-scripts allow-presentation" 
     :scrolling="isInteract && isScroll?'yes':'no'" :style="styleObj"></iframe>
  <div v-else-if="!offlineHide" :style="styleErr" >Отсутствует соединение с интернетом</div>
</template>

<script>
import Connection from './helpers/Connection'

export default {
  name: 'media-iframe',
  props: ['content'],
  created () {
    this.isShow = navigator ? navigator.onLine : true
  },
  mounted () {
    const iframe = this.$refs.iframe
    if (iframe) iframe.src = this.link
    this.connect = new Connection(
      () => { this.connecting() },
      () => { this.isShow = false },
      false
    )
    if (this.refresh > 0) {
      this.reloadTimer = setInterval(() => this.refreshIframe(), 60 * this.refresh * 1000)
    }
    this.connect.startListen()
  },
  beforeDestroy () {
    clearTimeout(this.reloadTimer)
    this.connect.stopListen()
  },
  data () {
    return {
      connect: null,
      isShow: true,
      reloadTimer: null
    }
  },
  computed: {
    contentId () {
      return this.content.id
    },
    isInteract () {
      return this.content.isInteract
    },
    isScroll () {
      return this.content.isScroll
    },
    offlineHide () {
      return Boolean(this.content.offlineHide)
    },
    zoom () {
      return Number(this.content.zoom)
    },
    link () {
      return this.content.link
    },
    verticIndent () {
      return this.content.verticIndent
    },
    horizIndent () {
      return this.content.horizIndent
    },
    refresh () {
      return this.content.refresh
    },
    styleObj () {
      let res = {}
      let newSize = 100 / this.zoom
      res.width = `calc(${newSize}% + ${this.horizIndent}px)`
      res.height = `calc(${newSize}% + ${this.verticIndent}px)`
      if (!this.isInteract) res.pointerEvents = 'none'
      res.transform = `scale(${this.zoom})`
      res.transformOrigin = `0px 0px 0px`
      res.margin = `-${this.verticIndent}px 0px 0px -${this.horizIndent}px`
      return res
    },
    styleErr () {
      return {
        height: '100%',
        marginTop: '25%',
        textAlign: 'center'
      }
    },
    contentProp () {
      return this.content
    }
  },
  methods: {
    refreshIframe () {
      if (this.connect && this.connect.isOnline) {
        const iframe = this.$refs.iframe
        if (iframe) iframe.src = this.link
      }
    },
    connecting () {
      new Promise((resolve, reject) => {
        this.isShow = true
        resolve(this)
      })
      .then((self) => {
        const iframe = self.$refs.iframe
        if (iframe) iframe.src = self.link
      })
    }
  },
  watch: {
    // для правильной смены подряд идущих Media
    contentProp () {
      this.isShow = navigator ? navigator.onLine : true
      this.refreshIframe()
    }
  }
}
</script>

<style scoped>
</style>
