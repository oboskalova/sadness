<template>
  <div :style="someStyle">
    <img
    class="image"
    :src="content.getSrc">
  </div>
</template>

<script>
/* eslint-disable */

export default {
  name: 'QRView',
  props: ['file', 'content', 'containerStyle'],
  mounted () {
    this.setScale()
  },
  watch: {
    settingsProp: function () {
      this.setScale()
    }
  },
  methods: {
    setScale () {
      let p = this.settings
      if (p.width > p.height) {
        this.curScale = p.height
      }
      if (p.height > p.width) {
        this.curScale = p.width
        console.log(this.curScale)
      }
    }
  },

  computed: {
    someStyle () {
      var cWidth = parseInt(this.containerStyle.width)
      var cHeight = parseInt(this.containerStyle.height)
      var sizer
      if (cHeight > cWidth) {
        sizer = cWidth
      } else {
        sizer = cHeight
      }
      return {
        width: sizer + 'px',
        height: sizer + 'px',
        margin: 'auto'
      }
    },
    // style () {
    //   console.log(this.zoom)
    //   return {
    //     transform: `scale(${this.zoom})`
    //   }
    // },
    zoom () {
      var cWidth = parseInt(this.containerStyle.width)
      var cHeight = parseInt(this.containerStyle.height)
      var height = 500
      var width = 500
      var zoomH = cHeight / height
      var zoomW = cWidth / width
      if (zoomH > zoomW) {
        return zoomW
      } else {
        return zoomH
      }
    },
    settingsProp () {
      return this.settings.width + this.settings.height
    },
    scale () {
      return this.$store.getters.scale
    },
    blockStyleObj () {
      // const s = this.scale
      // const p = this.settings
      let res = {}
      res.width = 95 + '%'
      res.height = 95 + '%'
      res.marginLeft = 2 + '%'
      for (var key in res) {
        this.content.blockStyleObj[key] = res[key]
      }
      return res
    },
    imgWeatherStyle () {
      const s = this.scale
      // const p = this.settings
      let res = {}
      res.width = `${s * this.curScale * 0.25}px`
      res.height = `${s * this.curScale * 0.25}px`
      res.position = 'relative'
      res.left = `${s * this.curScale * 0.15 * 2}px`
      res.top = `0px`
      return res
    },
    divData () {
      const s = this.scale
      // const p = this.settings
      let res = {}
      res.overflow = 'hidden'
      res.whiteSpace = 'nowrap'
      res.height = `${s * this.curScale * 0.15 * 3.5}px`
      for (var key in res) {
        this.content.divData[key] = res[key]
      }
      return res
    },
    firstPstyle () {
      const s = this.scale
      // const p = this.settings
      let res = {}
      res.fontSize = `${s * this.curScale * 0.3}px`
      res.position = 'relative'
      res.bottom = `${s * this.curScale * 0.15 * 2.3}px`
      res.right = `${s * this.curScale * 0.15 * 1.2}px`
      res.fontWeight = 'bold'
      for (var key in res) {
        this.content.firstPstyle[key] = res[key]
      }
      return res
    },
    secondPstyle () {
      const s = this.scale
      // const p = this.settings
      let res = {}
      res.fontSize = `${s * this.curScale / 15}px`
      res.position = 'relative'
      res.bottom = `${s * this.curScale * 0.15 * 2.6}px`
      res.right = `${s * this.curScale * 0.15 * 1}px`
      res.margin = 0
      res.fontWeight = 'bold'
      for (var key in res) {
        this.content.secondPstyle[key] = res[key]
      }
      return res
    },
    thirdPstyle () {
      const s = this.scale
      // const p = this.settings
      let res = {}
      res.fontSize = `${s * this.curScale / 15}px`
      res.position = 'relative'
      res.bottom = `${s * this.curScale * 0.15 * 2.6}px`
      res.right = `${s * this.curScale * 0.15 * 1.8}px`
      res.margin = 0
      res.fontWeight = 'bold'
      for (var key in res) {
        this.content.thirdPstyle[key] = res[key]
      }
      return res
    },

    divData2 () {
      const s = this.scale
      // const p = this.settings
      let res = {}
      res.overflow = 'hidden'
      res.whiteSpace = 'nowrap'
      // res.height = `${s * this.curScale * 0.25}px`
      res.width = `${s * this.curScale * 0.31}px`
      // res.paddingRight = `${s * this.curScale * 0.07}px`
      res.display = 'inline-block'
      // this.content.divData2
      return res
    },
    imgWeatherStyle2 () {
      const s = this.scale
      // const p = this.settings
      let res = {}
      res.width = `${s * this.curScale * 0.17}px`
      res.height = `${s * this.curScale * 0.17}px`
      res.position = 'relative'
      res.left = `${s * this.curScale * 0.001}px`
      res.top = `${s * this.curScale * 0.15 * 0.01}px`
      res.marginBottom = `${s * this.curScale * 0.15 * 0.1}px`
      for (var key in res) {
        this.content.imgWeatherStyle2[key] = res[key]
      }
      return res
    },

    firstPstyle2 () {
      const s = this.scale
      // const p = this.settings
      let res = {}
      res.fontSize = `${s * this.curScale * 0.06}px`
      res.position = 'relative'
      res.bottom = `${s * this.curScale * 0.15 * 0.001}px`
      res.right = `${s * this.curScale * 0.001}px`
      res.fontWeight = 'bold'
      for (var key in res) {
        this.content.firstPstyle2[key] = res[key]
      }
      return res
    }
  }
}
</script>

<style scoped>
  .tools {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }
  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    pointer-events: none;
  }
</style>