<template>
  <div>
    <MediaElements
      :random.sync="random"
      :playlist.sync="playlist" />
  </div>
</template>

<script>
import MediaElements from './MediaElements'

export default {
  name: 'core-container-settings',
  components: { MediaElements },
  computed: {
    activeContainer () {
      return this.$store.getters.coreActiveContainer
    },
    playlist: {
      get () {
        const id = this.activeContainer.id
        const w = this.$store.getters.coreWidgets[id] || []
        console.log('Media Elements:')
        console.log(w)
        return w.filter(e => e.show)
      },
      set (value) {
        var oldData = []
        var newData = []
        const id = this.activeContainer.id
        const w = this.$store.getters.coreWidgets[id] || []
        w.forEach(element => {
          oldData.push(element)
        })
        this.$store.commit('UPDATE_WIDGETS_ORDER', value)
        w.forEach(element => {
          newData.push(element)
        })
        newData.sort((a, b) => a.order - b.order)
        const command = {
          type: 'updateMediaOrder',
          context: { id, type: 'playlist' },
          newParams: newData,
          oldParams: oldData
        }
        this.$store.dispatch('historyPush', command)
      }
    },
    random: {
      get () {
        return this.activeContainer.random
      },
      set (value) {
        const id = this.activeContainer.id
        const rand = this.activeContainer.random
        const command = {
          type: 'updateContainerProps',
          context: { id, type: 'container' },
          newParams: { random: !!value },
          oldParams: { random: rand }
        }
        this.$store.dispatch('updateContainerProps', {
          random: !!value
        })
        this.$store.dispatch('historyPush', command)
      }
    }
  }
}
</script>

<style scoped></style>
