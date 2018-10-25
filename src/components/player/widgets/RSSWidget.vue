<template>
    <rss-view v-if="show" ref="scroller" :content="content" :componentType="'player'"/>
</template>

<script>
  import RSSView from '../../template-editor/widgets/RSSView.vue'
  import Scroller from './helpers/Scroller.js'

  export default {
    name: 'rss',
    props: ['content'],
    components: {
      'RssView': RSSView
    },
    mounted () {
      this.init()
    },
    computed: {
      contentId () {
        return this.content.id
      },
      speed () {
        return Number(this.content.speed)
      },
      transition () {
        return Number(this.content.transition)
      },
      delay () {
        return Number(this.content.delay)
      },
      offset () {
        return Number(this.content.offset)
      },
      mode () {
        return this.content.mode
      },
      effectMode () {
        return this.content.effectMode
      },
      leave () {
        return this.content.leave
      },
      fontSize () {
        return Number(this.content.fontSize)
      },
      fontFamily () {
        return this.content.fontFamily
      },
      styleObj () {
        return {
          fontSize: this.fontSize + 'px',
          fontFamily: this.fontFamily
        }
      },
      contentProp () {
        return this.content
      }
    },
    methods: {
      init () {
        if (this.$refs.scroller) {
          let contentDiv = this.$refs.scroller.$el
          if (this.mode === 'horizontal' || this.mode === 'vertical') {
            this.scroller = new Scroller(contentDiv, {
              speed: this.speed,
              transition: this.transition,
              delay: this.delay,
              mode: this.effectMode,
              leave: this.leave,
              type: this.mode
            })
            this.$refs.scroller.$el.innerHTML = null
            this.$refs.scroller.$el.innerHTML = this.scroller.initHtml()
            this.scroller.startPlay()
          }
        }
      }
    },
    data () {
      return {
        scroller: null,
        html: null,
        show: true
      }
    },
    watch: {
      // для правильной смены подряд идущих MediaText
      contentProp () {
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
        new Promise((resolve, reject) => {
          this.html = null
          resolve(this)
        })
        .then((self) => {
          self.init()
        })
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