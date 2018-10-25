<template>
  <div class="player">
    <Template
      v-if="loadedBase"
      :settings="templateSettings" />
  </div>
</template>

<script>
import Template from './player/Template'
import { getTemplate } from '../../api/player'

export default {
  name: 'Player',
  components: { Template },
  computed: {
    loading () {
      return !this.$store.getters.loaded
    }
  },
  created () {
    const id = this.$route.params.id
    getTemplate(id).then(response => {
      this.templateSettings = response.data
      this.$store.commit('UPDATE_PLAYER_PROPS', { width: response.data.width, height: response.data.height })
      this.loadedBase = true
    })
    this.$store.commit('HIDE_MENU')
  },
  destroy () {
    this.$store.commit('SHOW_MENU')
  },
  data () {
    return {
      loadedBase: false,
      templateSettings: {}
    }
  }
}
</script>

<style scoped>
  .player {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
    position: relative;
    background: #333333;
    overflow: auto;
  }
  .player-loading {
    top: 50%;
    left: 50%;
    width: 32px;
    display: block;
    position: absolute;
    transform: translate(-50%, -50%);
  }
  .player-hidden {
    visibility: hidden;
  }
</style>
