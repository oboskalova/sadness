<template>
  <b-modal centered
    v-model="active"
    :title="file.name"
    @show="openFileViewer"
    @hidden="closeFileViewer"
    size="lg"
    hide-footer>
    <div v-if="active">
      <img v-if="file.type === 1"
        class="block"
        :src="file.src">
      <video-player v-else-if="file.type === 2"
        class="video-player-box"
        ref="videoPlayer"
        :options="videoPlayerOptions"
        :playsinline="true">
      </video-player>
      <audio v-else-if="file.type === 3"
        class="block"
        autoplay
        controls>
        <source
          :src="file.src"
          :type="file.mime">
      </audio>
      <div v-else-if="file.type === 5">
        <img
          v-for="(page, index) in JSON.parse(file.additions)"
          :key="index"
          class="pdf-image"
          :src="storagePath + page">
      </div>
      <p v-else>Невозможно открыть файл</p>
    </div>
  </b-modal>
</template>

<script>
import { videoPlayer } from 'vue-video-player'

export default {
  name: 'modal-view-media-files',
  props: ['file'],
  components: { videoPlayer },
  computed: {
    storagePath () {
      return this.$store.getters.storagePath
    },
    active: {
      get () {
        return this.$store.getters.viewMediaFiles
      },
      set (value) {
        this.$store.commit('TOGGLE_VIEW_MEDIA_FILES', value)
      }
    },
    videoPlayerOptions () {
      const type = this.$props.file.mime
      const src = this.$props.file.src
      return {
        width: '770px',
        autoplay: true,
        muted: false,
        language: 'ru',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{ type, src }]
      }
    }
  },
  methods: {
    openFileViewer () {
      this.$store.commit('SET_MODAL_IS_OPEN', true)
    },
    closeFileViewer: function () {
      this.$router.push('/files/' + this.$props.file.parent_id)
      this.$store.commit('SET_MODAL_IS_OPEN', false)
    }
  }
}
</script>

<style scoped>
  .pdf-image {
    width: 100%;
  }
</style>
