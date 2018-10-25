<template>
  <div class="editor">
    <TheLeftSidebar :loading="loading"/>
    <main class="editor-main">
      <EditorCore :loading="loading"/>
    </main>
    <TheRightSidebar :loading="loading"/>
    <ModalSelectMedia />
    <ModalSelectWidget />
    <ModalTimelineSettings :timeline="timeline.obj.timeline" @changeTimeline="changeTimeline"/>
    <ModalTemplateSettings
      type="update"
      :activeTemplate="template" />
    <ModalInteractiveSettings />
    <ModalConfirmLeaving
      title="Все изменения будут утеряны"
      warning="Вы уверены, что хотите покинуть эту страницу?"
      :ok="leaveEditor" />
    <div v-if="!this.template.editable" class="alert alert-danger" role="alert">
      Шаблон в данный момент редактируется другим пользователем, доступен только просмотр
    </div>
    <ModalDeleteContainer/>
  </div>
</template>

<script>
import TheLeftSidebar from './TheLeftSidebar'
import TheRightSidebar from './TheRightSidebar'
import EditorCore from './EditorCore'
import ModalSelectMedia from '../modals/ModalSelectMedia'
import ModalSelectWidget from '../modals/ModalSelectWidget'
import ModalDeleteContainer from '../modals/ModalDeleteContainer'
import ModalTemplateSettings from '../modals/ModalTemplateSettings'
import ModalTimelineSettings from '../modals/ModalTimelineSettings'
import ModalInteractiveSettings from '../modals/ModalInteractiveSettings'
import ModalConfirmLeaving from '../modals/ModalConfirmLeaving'
import { leaveTemplate } from '../../../api/template-editor'

export default {
  name: 'editor-single',
  computed: {
    templateId () {
      return +this.$route.params.id || 1
    },
    template () {
      return this.$store.getters.coreTemplate
    },
    timeline () {
      return this.$store.getters.timelineSelection
    },
    historyIsEmpty () {
      return !this.$store.getters.historyMaySave
    },
    loading () {
      this.$root.$emit('setZoom')
      return this.$store.getters.loading
    },
    widgets () {
      return this.$store.getters.coreWidgets
    },
    activeScene () {
      return this.$store.getters.coreActiveScene
    },
    activeContainer () {
      return this.$store.getters.coreActiveContainer
    }
  },
  components: {
    TheLeftSidebar,
    TheRightSidebar,
    EditorCore,
    ModalSelectMedia,
    ModalSelectWidget,
    ModalTemplateSettings,
    ModalTimelineSettings,
    ModalInteractiveSettings,
    ModalConfirmLeaving,
    ModalDeleteContainer
  },
  created () {
    this.$store.commit('CHANGE_SCALE', { oldZoom: 0, newZoom: 0.33 })
    this.$store.commit('CHANGE_LOADING_STATE', true)
    this.$store.dispatch('fetchTemplate', {
      id: this.templateId
    })
    this.$store.dispatch('fetchContainersOf', {
      templateId: this.templateId
    })
    this.$store.dispatch('fetchWidgetsOf', {
      templateId: this.templateId
    })
    this.$store.dispatch('fetchPassport')
  },
  beforeRouteLeave (to, from, next) {
    this.fn = () => {
      this.$store.dispatch('historyClear')
      leaveTemplate(this.templateId)
      next()
    }
    if (!this.historyIsEmpty) {
      this.$store.commit('TOGGLE_CONFIRM_LEAVING', true)
    }
    if (this.historyIsEmpty) {
      leaveTemplate(this.templateId)
    }
    next(this.historyIsEmpty)
  },
  methods: {
    leaveEditor () {
      if (typeof this.fn === 'function') this.fn()
    },
    changeTimeline (data) {
      if (this.timeline.type === 'media') {
        let selection = this.timeline.obj.id
        const params = this.widgets[this.activeContainer.id].find(e => e.id === selection)
        console.log(params)
        this.$store.dispatch('historyPush', {
          type: 'updateWidgetProps',
          context: { id: this.timeline.obj.id, type: 'widget' },
          oldParams: { ...params, timeline: JSON.stringify(data.old) },
          newParams: { ...params, timeline: JSON.stringify(data.new) }
        })
        this.$store.commit('UPDATE_MEDIA_PLAYLIST_ITEM', {obj: this.timeline.obj, timeline: data.new})
      }
    }
  },
  data () {
    return {
      fn: null
    }
  }
}
</script>

<style scoped>
.editor {
  height: calc(100vh - 52px);
  display: flex;
}
.editor-main {
  padding: 3px;
  min-width: 64%;
  max-width: 64%;
  background-color: #333;
}
</style>
