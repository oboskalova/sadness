<template>
  <div class="media" v-show="media.show" :data-widget-id="media.id">
    <div class="media-name">
      <img :src="media.thumbnail">      
      {{ media.name | truncate }}
    </div>
    <div class="media-tools">
      <div class="top-row">
        <button
          v-show="media.content"
          class="media-button media-button--short"
          title="Изменить"
          @click="openChangeWidgetModal">
          <i class="mi mi-build"></i>
        </button>
        <button
          class="media-button timer media-button--short"
          title="Настройки воспроизведения"
          @click="openTimelineSettings">
          <i class="mi">&#xE923;</i>
        </button>
        <button
          class="media-button media-button--short"
          title="Дублировать"
          @click="duplicate">
          <i class="mi mi-content-copy"></i>
        </button>
        <button
          class="media-button media-button--short"
          title="Удалить"
          @click="remove">
          <i class="mi mi-delete"></i>
        </button>
        <button
          v-if="!media.watch && media.type"
          class="media-button media-button--short"
          title="Включить отслеживание показов"
          @click="track(true)">
          <i class="mi mi-assessment"></i>
        </button>
        <button
          v-if="media.watch && media.type"
          class="media-button media-button--short"
          title="Выключить отслеживание показов"
          @click="track(false)">
          <i class="mi mi-assessment showed"></i>
        </button>
        <button
          v-if="media.type === 2 && !media.mute"
          class="media-button media-button--short"
          title="Выключить звук у видео"
          @click="mute(true)">
          <i class="mi mi-volume-up"></i>
        </button>
        <button
          v-if="media.type === 2 && media.mute"
          class="media-button media-button--short"
          title="Включить звук у видео"
          @click="mute(false)">
          <i class="mi mi-volume-off"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'media-elements-item',
  props: ['media'],
  filters: {
    truncate (value) {
      value += ''
      const maxNameLength = 20
      if (value.length > maxNameLength) {
        return value.substr(0, maxNameLength) + ' ...'
      }
      return value
    }
  },
  methods: {
    mute (stat) {
      const params = { id: this.media.id, container_id: this.media.container_id, mute: this.media.mute }
      this.$store.dispatch('historyPush', {
        type: 'updateWidgetProps',
        context: { id: this.media.id, type: 'widget' },
        oldParams: params,
        newParams: { ...params, mute: stat }
      })
      this.$store.commit('UPDATE_WIDGET_PROPS', { ...params, mute: stat })
    },
    track (stat) {
      const params = { id: this.media.id, container_id: this.media.container_id, watch: this.media.watch }
      this.$store.dispatch('historyPush', {
        type: 'updateWidgetProps',
        context: { id: this.media.id, type: 'widget' },
        oldParams: params,
        newParams: { ...params, watch: stat }
      })
      this.$store.commit('UPDATE_WIDGET_PROPS', { ...params, watch: stat })
    },
    openTimelineSettings () {
      this.$store.commit('SELECT_TIMELINE', {type: 'media', obj: this.media})
      this.$store.commit('TOGGLE_TIMELINE_SETTINGS', true)
    },
    openChangeWidgetModal () {
      console.log('openChangeWidgetModal')
      console.log(this.media)
      if (this.media.content) {
        let content = JSON.parse(this.media.content)
        content.name = this.media.name
        content.id = this.media.id
        console.log(content)
        this.$store.commit('SET_MODAL_WIDGET_TYPE', content.type)
        this.$store.commit('SET_MODAL_WIDGET_CONTENT', content)
      }
    },
    duplicate () {
      const allMedias = this.$store.getters.coreWidgets[this.media.container_id]
      const maxOrderMedia = allMedias.reduce((prev, cur) => (prev.order > cur.order) ? prev : cur)
      const order = maxOrderMedia.order + 1
      console.log('order = ' + order)
      const widget = {
        name: this.media.name,
        file_id: this.media.file_id,
        content: this.media.content,
        timeline: this.media.timeline,
        mute: this.media.mute,
        watch: this.media.watch,
        template_id: this.media.template_id,
        container_id: this.media.container_id,
        order: order
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
    },
    remove () {
      const { id, container_id } = this.$props.media
      const params = { id, container_id, show: false }
      this.$store.dispatch('updateWidgetProps', params)
      this.$store.dispatch('historyPush', {
        type: 'updateWidgetProps',
        context: { id, type: 'widget' },
        oldParams: { ...params, show: true },
        newParams: params
      })
    }
  }
}
</script>

<style scoped>
  .top-row{
    clear: both;
  }
  .media {
    margin-bottom: 6px;
    padding: 6px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    border-radius: 3px;
    display: block;
  }
  .media-tools {
    min-width: 44px;
    width: 100%;
    clear: both;
    height:25px;
  }
  .media-name {
    width: 100%;
  }
  .media-name img {
    padding-right: 6px;
  }
  .media-button {
    height: 20px;
    padding: 0;
    display: block;
    text-align: right;
    font-size: 18px;
    background: none;
    border: none;
    cursor: pointer;
    color: #333;
  }
  .timer {
    color: #4aafb7;
  }
  .media-button--long {
    width: 100%;
    margin-bottom: 4px;
    color: #4aafb7;
    transition: color 200ms ease;
  }
  .media-button--long:focus:active {
    color: #ff4080;
  }
  .media-button--short {
    width: 20px;
    margin-right: 0px;
    float: right;
    opacity: 0.5;
    transition: opacity 200ms ease;
  }
  .media-button--short:hover {
    opacity: 1;
  }
  .media-button--short:first-of-type {
    margin-right: 4px;
  }
  .showed {
    color: #4aafb7;
  }
</style>
