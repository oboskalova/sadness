<template>
  <div class="template" :style="styleObject">
    <div v-for="z in zones" :key="z.id">
      <Container
        v-if="z.settings.id === activeZoneId"
        :settings="z.settings"
        :children="z.children" />
    </div>
  </div>
</template>

<script>
import Container from './Container'
import { getWidgets } from '../../../api/template-editor'
import { getContainersOf } from '../../../api/player'

export default {
  name: 'Template',
  props: ['settings'],
  components: { Container },
  watch: {
    activeZoneId (id) {
      clearTimeout(this.timeId)
      const z = this.zones.find(e => e.settings.id === id)
      const a = JSON.parse(z.settings.action)
      if (a && a.timeout && a.timeout.active) {
        const { target, ms } = a.timeout
        this.timeId = setTimeout(() => {
          this.activeZoneId = target
        }, 1000 * ms)
      }
    }
  },
  computed: {
    styleObject () {
      const s = this.$props.settings
      const zoom = this.$store.getters.zoomValue
      return {
        width: `${s.width}px`,
        height: `${s.height}px`,
        transform: `scale(${zoom})`
      }
    }
  },
  methods: {
    transformList (list = []) {
      let hierarchy = { settings: { id: 0 }, children: [] }
      list.sort((a, b) => (a.parent_id - b.parent_id))
      list.forEach(e => this.insertContainer(e, hierarchy))
      return hierarchy.children
    },
    insertContainer (container = {}, hierarchy = {}) {
      if (hierarchy.settings.id === container.parent_id) {
        if (!Array.isArray(container.playlist)) container.playlist = []
        hierarchy.children.push({ settings: container, children: [] })
      }
      hierarchy.children.forEach(e => this.insertContainer(container, e))
    },
    distributeWidgets (widgets = [], hierarchy) {
      const h = { settings: { id: -1 }, children: hierarchy }
      widgets.forEach(e => this.insertWidget(e, h))
      return hierarchy
    },
    insertWidget (widget = {}, hierarchy = {}) {
      if (hierarchy.settings.id === widget.container_id) {
        hierarchy.settings.playlist.push(widget)
        return
      }
      hierarchy.children.forEach(e => this.insertWidget(widget, e))
    },
    initEverydayActions () {
      let now = new Date()
      let startOfTheNextDay = new Date(now)
      startOfTheNextDay.setMilliseconds(0)
      startOfTheNextDay.setSeconds(0)
      startOfTheNextDay.setMinutes(0)
      startOfTheNextDay.setHours(0)
      startOfTheNextDay.setDate(startOfTheNextDay.getDate() + 1)
      setTimeout(() => {
        console.log('lets rebuild')
        this.makeRebuild()
        this.initEverydayActions()
      }, startOfTheNextDay - now)
    },
    makeTick () {
      this.$root.$emit('tick')
    },
    makeRebuild () {
      this.$root.$emit('rebuild')
    }
  },
  created () {
    const templateId = this.settings.id
    getContainersOf(templateId).then(response => {
      const list = [].slice.call(response.data, 0)
      const hierarchy = this.transformList(list)
      getWidgets({ templateId }).then(response => {
        const widgets = response.data
        this.zones = this.distributeWidgets(widgets, hierarchy)
          .sort((a, b) => { return a.settings.order - b.settings.order })
        this.activeZoneId = this.zones[0].settings.id
      })
    })
    this.$root.$on('open', params => { this.activeZoneId = params.target })
    this.initEverydayActions()
    setInterval(this.makeTick, 300)
  },
  data () {
    return {
      zones: [],
      timeId: null,
      activeZoneId: 0
    }
  }
}
</script>

<style scoped>
  .template {
    overflow: hidden;
    transform-origin: 0 0;
    transition: transform 150ms ease-in-out;
  }
</style>