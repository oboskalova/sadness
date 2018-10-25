<template>
  <div class="qr-code">
    <div :style="someStyle" >
      <img
        class="image"
        :src="`${modifiedBaseUrl}/storage/temp/${content.src}`">
    </div>
  </div>
</template>

<style scoped>
  .qr-code {
    width: 100%;
    height: 100%;
  }
  .text-content {
    width: 100%;
		height: 100%;
		position: relative;
    padding: 0;
	}
  .PresentationWidget {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
  }
  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    pointer-events: none;
  }
</style>

<script>
import { baseUrl } from '../../../../api/config'
export default {
  name: 'QRWidget',
  props: ['file', 'content', 'containerStyle'],
  computed: {
    modifiedBaseUrl () {
      return baseUrl.substr(0, baseUrl.indexOf('/api/'))
    },
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
        margin: 'auto',
        position: 'static'
      }
    },
    style () {
      console.log(this.zoom)
      return {
        transform: `scale(${this.zoom})`,
        color: this.content.themeColor
      }
    },
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
    contentId () {
      return this.content.id
    },
    contentProp () {
      return this.content
    },
    mainStyleObj () {
      return {
        minWidth: 2000 + 'px'
      }
    },
    contentStyleObj () {
      let res = {}
      res.overflow = 'hidden'
      res.color = this.contentProp.themeColor
      return res
    },
    blockStyleObj () {
      let res = {}
      res.width = `${240}px`
      res.height = `${220}px`
      res.overflow = 'hidden'
      res.textAlign = 'center'
      res.display = 'inline-block'
      res.marginRight = 5 + 'px'
      return res
    },
    divStyleObj () {
      return {
        float: 'right',
        margin: 5 + 'px ' + 40 + 'px ' + 0 + 'px ' + 30 + 'px'
      }
    },
    pStyleObj () {
      return {
        margin: 0,
        width: 70 + 'px',
        height: 50 + 'px'
      }
    },
    h2StyleObj () {
      return {
        fontWeight: 'bold',
        margin: 10 + 'px ' + '0px' + '0px' + '0px'
      }
    },
    widthImg () {
      let res = {}
      res.marginTop = 10 + 'px'
      res.width = 50 + 'px'
      res.height = 50 + 'px'
      return res
    },
    offlineHide () {
      return Boolean(this.content.offlineHide)
    }
  }
}
</script>
