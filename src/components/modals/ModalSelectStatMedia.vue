<template>
  <b-modal
    v-model="active"
    @show="openModal"
    @hide="closeModal"
    size="lg"
    title="Выберите медиафайл"
    hide-footer>
    <div class="container">
      <SearchMedia :mediaElement.sync="selectedMediaElement" :mediaElements.sync="selectedMediaElements"/>
      <div class="row row-footer justify-content-end">
        <button
          class="btn btn-primary"
          @click="createPlaylistItem">Выбрать</button>
        <button
          class="btn btn-secondary"
          @click="active = false">Отмена</button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import SearchMedia from '../template-editor/SearchMedia'

export default {
  name: 'modal-select-media',
  components: { SearchMedia },
  computed: {
    active: {
      get () {
        return this.$store.getters.selectStatMedia
      },
      set (value) {
        this.$store.commit('TOGGLE_SELECT_STAT_MEDIA', value)
      }
    },
    container () {
      return this.$store.getters.coreActiveContainer
    },
    templateId () {
      return this.$store.getters.coreTemplate.id
    },
    _allMedias () {
      const cId = this.container.id
      return this.$store.getters.coreWidgets[cId] || []
    }
  },
  methods: {
    clearSelectedMediaElement () {
      this.selectedMediaElement = {}
    },
    openModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', true)
      this.clearSelectedMediaElement()
    },
    closeModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', false)
    },
    /* createPlaylistItem () {
      const cId = this.container.id
      const mId = this.selectedMediaElement.id
      var timeline = defaultTimeline
      if (this.selectedMediaElement.type === 1) {
        timeline = { ...defaultTimeline, playUntilDone: false, duration: 5 }
      }
      if (mId && cId) {
        let order = 0
        let mute = false
        if (this._allMedias.length > 0) {
          const maxOrderMedia = this._allMedias.reduce((prev, cur) => (prev.order > cur.order) ? prev : cur)
          order = maxOrderMedia.order + 1
        }
        if (this.selectedMediaElement.type === 2) {
          mute = true
        }
        const widget = {
          name: this.selectedMediaElement.name,
          file_id: mId,
          container_id: cId,
          template_id: this.templateId,
          timeline: JSON.stringify(timeline),
          mute: mute,
          order
        }
        this.$store.dispatch('createWidget', widget)
          .then(w => {
            const params = { id: w.id, container_id: w.container_id, show: w.show }
            this.$store.dispatch('historyPush', {
              type: 'updateWidgetProps',
              context: { id: w.id, type: 'widget' },
              oldParams: { ...params, show: false },
              newParams: params
            })
          })
      }
      this.active = false
    }, */
    createPlaylistItem () {
      console.log(this.selectedMediaElements)
      this.$store.commit('SELECT_STAT_FILE', this.selectedMediaElements[0])
      this.active = false
      this.$emit('updateChart')
    }
  },
  data () {
    return {
      selectedMediaElement: {},
      selectedMediaElements: [],
      length: 0,
      por: 0
    }
  }
}
</script>