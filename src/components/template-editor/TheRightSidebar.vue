<template>
  <aside class="aside">
    <div class="aside-header">
      <button
        class="aside-button"
        :class="{ 'active': activeTab === 0 }"
        @click="toggleTo(0)">
        Свойства
      </button>
      <button
        class="aside-button"
        :class="{ 'active': activeTab === 1 }"
        @click="toggleTo(1)">
        Медиа-элементы
      </button>
    </div>
    <div class="aside-inner">
      <img
        v-if="loading"
        src="/static/img/spinner.gif"
        class="loader">
      <component v-if="!loading" :is="tabs[activeTab].component" />
    </div>
  </aside>
</template>

<script>
import MediaElements from './MediaElements'
import CoreContainerSettings from './CoreContainerSettings'
import CoreContainerPlaylist from './CoreContainerPlaylist'

export default {
  name: 'editor-right-sidebar',
  props: ['loading'],
  components: {
    MediaElements,
    CoreContainerSettings,
    CoreContainerPlaylist
  },
  computed: {
    buttonIcon () {
      return 'mi-keyboard-arrow-' + (this.activeTab ? 'left' : 'right')
    }
  },
  methods: {
    toggleTo (value) {
      this.activeTab = +value % 2
    }
  },
  data () {
    return {
      tabs: [
        { name: 'Настройки', component: 'CoreContainerSettings' },
        { name: 'Контент', component: 'CoreContainerPlaylist' }
      ],
      activeTab: 0
    }
  }
}
</script>
<style scoped>
.aside {
  min-width: 18%;
  max-width: 18%;
}
</style>