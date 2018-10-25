<template>
  <div class="tools">
    <img
    class="image"
    :src="file.src"
    :style="style2"
    @load="loadHandler">
  </div>
</template>

<script>
export default {
  name: 'media-image',
  props: ['file'],
  data () {
    return {
      loaded: false
    }
  },
  computed: {
    style2 () {
      if (this.loaded) {
        return {
          'display': 'block'
        }
      } else {
        return {
          'display': 'none'
        }
      }
    },
    style () {
      return {
        'background-image': 'url("' + this.file.src + '")'
      }
    }
  },
  created () {
    // console.log('MediaImage create:')
    this.$store.commit('INCREASE_LOADING_ELEMENTS_NUMBER')
  },
  methods: {
    loadHandler (event) {
      this.loaded = true
      this.$store.commit('DECREASE_LOADING_ELEMENTS_NUMBER')
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
  }
</style>
