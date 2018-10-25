<template>
  <div class="text-content" :style="styleObj">
    <span>
      <span :style="styleSpanObj">{{curText}}</span>
    </span>
  </div>
</template>

<script>
  import moment from 'moment-timezone'

  export default {
    name: 'media-text',
    props: ['content'],
    created () {
      console.log('DateAndTime created')
      console.log(this.content)
    },
    mounted () {
      console.log('monted: ' + this.contentId)
      this.contentText()
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    computed: {
      contentId () {
        return this.content.id
      },
      contentProp () {
        return this.content
      },
      styleObj () {
        let content = this.content
        return {
          fontFamily: content.fontFamily,
          fontSize: `${content.fontSize}px`,
          color: content.color,
          fontWeight: content.fontWeight,
          fontStyle: content.fontStyle,
          textDecoration: content.textDecoration,
          textAlign: content.textAlign,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }
      },
      styleSpanObj () {
        let content = this.content
        return {
          backgroundColor: content.backgroundColor,
          textDecoration: content.textDecorationThr
        }
      }
    },
    methods: {
      contentText () {
        const content = this.content
        if (content.isVisibleTime && content.isVisibleDate) {
          this.timer = setInterval(() => {
            this.curText = moment().tz(content.timeZone).locale('en').format(content.selectedTimeFormat) + ' ' + moment().locale('ru').format(content.selectedDateFormat)
          }, 1000)
        } else if (!content.isVisibleTime && content.isVisibleDate) {
          this.timer = setInterval(() => {
            this.curText = moment().locale('ru').tz(content.timeZone).format(content.selectedDateFormat)
          }, 1000)
        } else if (content.isVisibleTime && !content.isVisibleDate) {
          this.timer = setInterval(() => {
            this.curText = moment().tz(content.timeZone).locale('en').format(content.selectedTimeFormat)
          }, 1000)
        }
      }
    },
    data () {
      return {
        curText: '',
        timer: null
      }
    }
  }
</script>

<style scoped>
  .text-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

</style>
