<template>
  <div v-if="show">
    <div v-show="false">{{ changer }}</div>
    <audio class="audio" autoplay loop>
      <source v-if="file.src" :src="file.src" :type="file.mime">
    </audio>
  </div>
</template>

<script>
export default {
  name: 'media-audio',
  props: ['file'],
  data () {
    return {
      show: true
    }
  },
  computed: {
    changer () {
      this.show = false
      console.log('changed')
      this.$nextTick(() => {
        this.show = true
      })
      return this.$props.file
    }
  }
}
</script>

<style scoped>
  .audio {
    visibility: hidden;
  }
</style>
