<template>
  <b-modal
    v-model="active"
    @show="openModal"
    @hide="closeModal"
    size="lg"
    title="Выберите медиафайл"
    hide-footer>
    <div class="container">
      <SearchMedia v-if="isSearchMedia" :mediaElement.sync="selectedMediaElement" :mediaElements.sync="selectedMediaElements"/>
      <div class="row row-footer justify-content-end">
        <button
          class="btn btn-primary"
          @click="choose">Выбрать</button>
        <button
          class="btn btn-secondary"
          @click="active = false">Отмена</button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import SearchMedia from '../template-editor/SearchMedia'
import { defaultTimeline } from '../../../helpers/defaults'

export default {
  name: 'modal-select-media',
  components: { SearchMedia },
  computed: {
    active: {
      get () {
        return this.$store.getters.selectMedia
      },
      set (value) {
        this.$store.commit('TOGGLE_SELECT_MEDIA', value)
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
      this.$store.commit('SET_MODAL_IS_OPEN', true)
      this.selectedMediaElement = {}
    },
    openModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', true)
      this.clearSelectedMediaElement()
    },
    closeModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', false)
      this.$store.commit('TOGGLE_PDF_SELECTING', false)
      this.isSearchMedia = false
      this.$nextTick(() => {
        this.isSearchMedia = true
      })
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
      this.length = this.selectedMediaElements.length
      this.por = 0
      this.createItem(this.selectedMediaElements[0])
      this.active = false
    },
    createItem (selectedMediaElement) {
      const cId = this.container.id
      const mId = selectedMediaElement.id
      var timeline = defaultTimeline
      if (selectedMediaElement.type === 1) {
        timeline = { ...defaultTimeline, playUntilDone: false, duration: 5 }
      }
      if (mId && cId) {
        let order = 0
        let mute = false
        if (this._allMedias.length > 0) {
          const maxOrderMedia = this._allMedias.reduce((prev, cur) => (prev.order > cur.order) ? prev : cur)
          order = maxOrderMedia.order + 1
        }
        if (selectedMediaElement.type === 2) {
          mute = true
        }
        const widget = {
          name: selectedMediaElement.name,
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
            this.por = this.por + 1
            if (this.por < this.length) {
              this.createItem(this.selectedMediaElements[this.por])
            } else {
              this.active = false
              this.selectedMediaElements = []
            }
          })
      }
    },
    choose () {
      if (this.$store.getters.isPdfSelecting) {
        this.length = this.selectedMediaElements.length
        this.por = 0
        const data = this.selectedMediaElements[0]
        console.log(data)

        this.$store.commit('SET_PDF_MODAL_DATA', data)
        this.$store.commit('SET_MODAL_WIDGET_TYPE', 12)
        this.$store.commit('SET_MODAL_IS_OPEN', true)
        this.$store.commit('TOGGLE_PDF_SELECTING', false)
      } else {
        this.createPlaylistItem()
      }
    }
  },
  data () {
    return {
      selectedMediaElement: {},
      selectedMediaElements: [],
      length: 0,
      por: 0,
      isSearchMedia: true
    }
  }
}
</script>