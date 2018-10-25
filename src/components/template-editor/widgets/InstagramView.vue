<template>
    <!-- <div ref="instagram" :style="contentStyleObj">This is Instagram Cards</div> -->
    <instagram v-if="isShow" ref="instaCards" :content="content" :options="options" :style="contentStyleObj"></instagram>
</template>

<script>
import Vue from 'vue'
import instagram from '../../widgets/components/Instagram'

export default {
  name: 'media-instagram-view',
  props: ['content', 'settings'],
  components: {
    'instagram': instagram
  },
  data () {
    return {
      isShow: true
    }
  },
  computed: {
    scale () {
      return this.$store.getters.scale
    },
    options () {
      const s = this.scale
      const p = this.settings
      return {
        width: p.width * s,
        height: p.height * s
      }
    },
    contentStyleObj () {
      let res = {}
      const s = this.scale
      const p = this.settings
      res.overflow = 'hidden'
      res.width = 'auto'
      res.height = `${p.height * s}px`
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
