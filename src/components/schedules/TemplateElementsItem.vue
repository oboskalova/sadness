<template>
  <div class="template" :data-widget-id="template.id">
    <div class="template-name">      
      {{ template.name | truncate }}
    </div>
    <div class="template-tools">
      <button
        class="template-button template-button--long"
        title="Настройки воспроизведения"
        @click="toogleTimeline">
        <i class="mi">&#xE923;</i>
      </button>
      <button
        class="template-button template-button--short"
        title="Дублировать"
        @click="duplicate">
        <i class="mi mi-content-copy"></i>
      </button>
      <button
        class="template-button template-button--short"
        title="Удалить"
        @click="remove">
        <i class="mi mi-delete"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'template-elements-item',
  props: ['template'],
  filters: {
    truncate (value) {
      value += ''
      const maxNameLength = 150
      if (value.length > maxNameLength) {
        return value.substr(0, maxNameLength) + ' ...'
      }
      return value
    }
  },
  methods: {
    toogleTimeline () {
      this.$store.commit('SELECT_TIMELINE', {type: 'playlist', obj: this.template})
      this.$store.commit('TOGGLE_TIMELINE_SETTINGS', true)
    },
    duplicate () {
      const order = this.$store.getters.currentSchedule.playlist.length
      const item = {
        id: Math.floor(Math.random() * (1000 - 1)) + 1,
        name: this.template.name,
        timeline: this.template.timeline,
        template: this.template.template,
        order: order
      }
      this.$store.commit('ADD_PLAYLIST_ITEM', item)
    },
    remove () {
      this.$store.commit('REMOVE_PLAYLIST_ITEM', this.template.id)
      this.$store.commit('CHANGE_PLAYLIST_ORDER', this.$store.getters.currentSchedule.playlist)
    }
  }
}
</script>

<style scoped>
  .template {
    margin: 10px 0;
    padding: 6px;
    border: 1px solid #cccccc;
    box-shadow: 0 2px 3px 1px #e3e5e6;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .template-name {
    padding-left: 6px;
  }
  .template-button {
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
  .template-button--long {
    width: 100%;
    margin-bottom: 4px;
    color: #4aafb7;
    transition: color 200ms ease;
  }
  .template-button--long:focus:active {
    color: #ff4080;
  }
  .template-button--short {
    width: 20px;
    margin-right: 4px;
    float: left;
    opacity: 0.5;
    transition: opacity 200ms ease;
  }
  .template-button--short:hover {
    opacity: 1;
  }
  .template-button--short:last-of-type {
    margin-right: 0;
  }
  .template-tools {
    width: 45px;
  }
</style>