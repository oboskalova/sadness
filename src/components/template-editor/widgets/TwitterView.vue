<template>
  <twitter v-if="isShow" class="tweet" :content="content" :options="options"></twitter>
</template>

<script>
import Vue from 'vue'
import twitter from '../../widgets/components/Twitter'

export default {
  name: 'media-text-view',
  props: ['content', 'settings'],
  components: { twitter },
  data () {
    return {
      isShow: true
    }
  },
  computed: {
    scale () {
      return this.$store.getters.scale
    },
    options: function () {
      return {
        width: this.settings.width * this.scale
      }
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
