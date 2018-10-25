<template>
  <div ref="scroller" class="text-content" v-html="html ? html : content.text"></div>
</template>

<script>

import Scroller from './helpers/Scroller.js'

export default {
  name: 'media-text',
  props: ['content'],
  mounted () {
    this.init()
  },
  beforeDestroy () {
    if (this.scroller) this.scroller.destructor()
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
    contentProp () {
      return this.content
    }
  },
  methods: {
    init () {
      let contentDiv = this.$refs.scroller

      if (this.mode === 'horizontal' || this.mode === 'vertical') {
        this.scroller = new Scroller(contentDiv, {
          speed: this.speed,
          transition: this.transition,
          delay: this.delay,
          mode: this.effectMode,
          leave: this.leave,
          type: this.mode
        })
        new Promise((resolve, reject) => {
          this.html = this.scroller.initHtml()
          resolve(this.scroller)
        })
        .then((scroller) => {
          this.scroller.startPlay()
        })
      }
    }
  },
  data () {
    return {
      scroller: null,
      html: null
    }
  },
  watch: {
    // для правильной смены подряд идущих MediaText
    contentProp () {
      new Promise((resolve, reject) => {
        this.html = null
        this.scroller.destructor()
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
