<template>
  <div ref="textContent"
      class="text-content"
      v-html="contentText"
      :style="contentStyleObj"
      >
  </div>
</template>

<script>
import moment from 'moment-timezone'
export default {
  name: 'media-date-time-view',
  props: ['content', 'settings'],
  data () {
    return {
      defaultFontSize: 16,
      defaultPadding: 8,
      timer: null,
      prevScale: 1,
      curText: ''
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  computed: {
    contentText () {
      const content = this.content
      clearInterval(this.timer)
      if (content.isVisibleTime && content.isVisibleDate) {
        this.timer = setInterval(() => {
          this.curText = moment().tz(content.timeZone).locale('en').format(content.selectedTimeFormat) + ' ' + moment().locale('ru').format(content.selectedDateFormat)
        }, 300)
      } else if (!content.isVisibleTime && content.isVisibleDate) {
        this.timer = setInterval(() => {
          this.curText = moment().tz(content.timeZone).locale('ru').format(content.selectedDateFormat)
        }, 300)
      } else if (content.isVisibleTime && !content.isVisibleDate) {
        this.timer = setInterval(() => {
          this.curText = moment().tz(content.timeZone).locale('en').format(content.selectedTimeFormat)
        }, 300)
      }
      return '<span><span style="background-color:' + this.content.backgroundColor + ' ;text-decoration: ' + this.content.textDecorationThr + '">' + this.curText + '</span></span>'
    },

    scale () {
      return this.$store.getters.scale
    },
    contentStyleObj () {
      const s = this.scale
      const p = this.settings
      let content = this.content
      let res = {}
      res.width = `${s * p.width}px`
      res.height = `${s * p.height}px`
      res.fontFamily = content.fontFamily
      res.color = content.color
      res.fontWeight = content.fontWeight
      res.fontStyle = content.fontStyle
      res.textDecoration = content.textDecoration
      res.textAlign = content.textAlign
      res.fontSize = `${s * Number(content.fontSize)}px`
      res.padding = `${s * Number(this.defaultPadding)}px`
      res.overflow = 'hidden'
      res.display = 'flex'
      res.flexDirection = 'column'
      res.justifyContent = 'center'
      return res
    }
  }
}
</script>
