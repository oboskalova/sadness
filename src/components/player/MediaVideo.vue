<template>
<div class="preview fuller">
  <div class="fuller">
    <div v-show="false">{{ changer }}</div>
    <video v-show="!video" :id="'vid' + container" class="video" :poster="firstPoster" :autoplay="autoplay" loop>
      <source :id="'source' + 'vid' + container" :src="firstSrc" :type="file.mime">
    </video>
    <video v-show="video" :id="'vid' + container + 'next'" class="video" :poster="secondPoster" loop>
      <source :id="'source' + 'vid' + container + 'next'" :src="secondSrc" :type="file.mime">
    </video>
  </div>
</div>
</template>
<script>

export default {
  name: 'media-video',
  props: ['file', 'mute', 'next', 'container'],
  data () {
    return {
      show: true,
      autoplay: true,
      video: 0,
      first: true,
      video1: null,
      video2: null,
      source1: null,
      source2: null,
      firstSrc: null,
      secondSrc: null,
      firstPoster: null,
      secondPoster: null,
      path: 'http://api-staging.devcubic.ru/storage/temp/'
    }
  },
  created () {
    console.log('file', this.file)
    console.log('next', this.next)
  },
  mounted () {
    this.firstPoster = this.file.poster
    this.secondPoster = this.path + this.next.full_thumbnail
    this.firstSrc = this.file.src
    this.secondSrc = this.path + this.next.file_name
    setTimeout(() => {
      this.video1 = document.getElementById('vid' + this.container)
      this.video1.muted = this.mute
      this.source1 = document.getElementById('source' + 'vid' + this.container)
      this.video2 = document.getElementById('vid' + this.container + 'next')
      this.video2.muted = this.next.mute
      this.source2 = document.getElementById('source' + 'vid' + this.container + 'next')
      console.log('vid1', this.video1)
    }, 200)
  },
  computed: {
    changer () {
      // this.show = false
      if (this.first) {
        this.first = false
        console.log('первый тик')
      } else {
        this.first = true
        this.autoplay = false
        console.log('следующий тик')
        if (this.video) {
          this.video = 0
          console.log('vidi1', this.video1)
          this.video2.pause()
          this.video1.play()
          if (this.next.type === 2) {
            this.source2.setAttribute('src', this.path + this.next.file_name)
            this.video2.load()
            this.video2.muted = this.next.mute
            this.secondPoster = this.path + this.next.full_thumbnail
          }
        } else {
          this.video = 1
          this.video1.pause()
          this.video2.play()
          if (this.next.type === 2) {
            this.source1.setAttribute('src', this.path + this.next.file_name)
            this.video1.load()
            this.video1.muted = this.next.mute
            this.firstPoster = this.path + this.next.full_thumbnail
          }
        }
        console.log('видео', this.video)
      }
      console.log('changed')
      /* this.$nextTick(() => {
        // this.show = true
        this.$nextTick(() => {
          var video = document.getElementById(this.file.id)
          var source = document.getElementById('ss' + this.file.id)
          video.pause()
          if (this.mute) {
            video.volume = 0
          } else {
            video.volume = 1
          }
          source.setAttribute('src', this.file.src)
          video.load()
          this.$nextTick(() => {
            setTimeout(() => {
              video.play()
            }, 500)
          })
        })
      }) */
      return this.$props.file
    }
  }
}
</script>

<style scoped>
  .video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
  .fuller {
    width: 100%;
    height: 100%
  }
</style>
