<template>
  <parser ref="parser" v-if="isShow" class="parser" :content="content"
    :style="contentStyleObj"></parser>
</template>

<script>
import Vue from 'vue'
import parser from '../../widgets/components/Parser'

export default {
  name: 'media-text-view',
  props: ['content', 'settings'],
  components: { parser },
  data () {
    return {
      isShow: true
    }
  },
  computed: {
    scale () {
      return this.$store.getters.scale
    },
    contentStyleObj () {
      const s = this.scale
      const p = this.settings
      let res = {}
      res.width = `${p.width}px`
      res.height = `${p.height}px`
      res.transform = `scaleX(${s}) scaleY(${s})`
      res.transformOrigin = '0 0'
      if (this.content.mode === 'horizontal') res.whiteSpace = 'nowrap'
      return res
    }
  },
  watch: {
    content () {
      this.isShow = false
      let self = this
      Vue.nextTick(() => {
        self.isShow = true
      })
    }
  }
}
</script>
