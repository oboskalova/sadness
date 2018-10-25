<template>
  <div class="settings">
    <div class="row no-gutters">
      <div class="col settings-cell">
        <label class="settings-label">Название</label>
        <input
          class="settings-input"
          :readonly="!container.editable"
          :value="container.name"
          @change.prevent="e => { pushToHistory('name', e) }"
          @input.prevent="e => { liveUpdate('name', e) }">
      </div>
    </div>
    <h3 class="settings-title">Положение</h3>
    <div class="row no-gutters">
      <div class="col settings-cell">
        <label class="settings-label">по горизонтали</label>
        <input
          class="settings-input"
          :value="container.x"
          :readonly="isScene || !container.editable"
          @change.prevent="e => { pushToHistory('x', e) }"
          @input.prevent="e => { liveUpdate('x', e) }"
          @keydown.up="e => { increase('x', e) }"
          @keydown.down="e => { decrease('x', e) }"
          @blur="updateBounds">
      </div>
      <div class="col settings-cell">
        <label class="settings-label">по вертикали</label>
        <input
          class="settings-input"
          :value="container.y"
          :readonly="isScene || !container.editable"
          @change.prevent="e => { pushToHistory('y', e) }"
          @input.prevent="e => { liveUpdate('y', e) }"
          @keydown.up="e => { increase('y', e) }"
          @keydown.down="e => { decrease('y', e) }"
          @blur="updateBounds">
      </div>
    </div>
    <h3 class="settings-title">Размеры</h3>
    <div class="row no-gutters">
      <div class="col settings-cell">
        <label class="settings-label">Ширина</label>
        <input
          class="settings-input"
          :value="container.width"
          :readonly="isScene || !container.editable"
          @change.prevent="e => { pushToHistory('width', e) }"
          @input.prevent="e => { liveUpdate('width', e) }"
          @keydown.up="e => { increase('width', e) }"
          @keydown.down="e => { decrease('width', e) }"
          @blur="updateBounds">
      </div>
      <div class="col settings-cell">
        <label class="settings-label">Высота</label>
        <input
          class="settings-input"
          :value="container.height"
          :readonly="isScene || !container.editable"
          @change.prevent="e => { pushToHistory('height', e) }"
          @input.prevent="e => { liveUpdate('height', e) }"
          @keydown.up="e => { increase('height', e) }"
          @keydown.down="e => { decrease('height', e) }"
          @blur="updateBounds">
      </div>
    </div>
    <div class="row no-gutters">
      <div class="col settings-cell">
        <label class="settings-label">Порядок наложения</label>
        <input
          class="settings-input"
          :value="container.z"
          :readonly="isScene || !container.editable"
          @change.prevent="e => { pushToHistory('z', e) }"
          @input.prevent="e => { liveUpdate('z', e) }"
          @keydown.up="e => { increase('z', e) }"
          @keydown.down="e => { decrease('z', e) }">
      </div>
      <div class="col settings-cell"></div>
    </div>
    <div class="row no-gutters">
      <div class="col settings-cell">
        <label class="settings-label">Цвет фона</label>
        <InputColor
          :disabled="container.editPlaylist"
          :color.sync="color"
          @change="changeColorHandler" />
      </div>
      <div class="col settings-cell"></div>
    </div>
    <div class="btn-margin">
      <button
        :disabled="!container.editable"
        class="btn btn-default aside-button"
        @click="openInteractiveSettings">
        <span>
          <i class="mi mi-link"></i>
          Интерактив
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { isFinite } from 'lodash'
import InputColor from '../common/InputColor'

export default {
  name: 'core-container-playlist',
  watch: {
    container (c) {
      this.copyContainer()
    }
  },
  created () {
    this.copyContainer()
  },
  components: { InputColor },
  computed: {
    scale () {
      return this.$store.getters.scale
    },
    container () {
      return this.$store.getters.coreActiveContainer
    },
    isScene () {
      return (this.container && (this.container.parent_id === 0)) || (this.container && (this.container.lock))
    },
    color: {
      get () {
        return (this.container.background_color === null)
          ? 'rgba(255,255,255,1)'
          : this.container.background_color
      },
      set (v) {
        this.updateContainer('background_color', v)
      }
    }
  },
  methods: {
    liveUpdate (prop, event) {
      const value = +event.target.value | 0
      if (prop === 'name') {
        this.updateContainer(prop, event.target.value)
      } else {
        if (isFinite(value)) {
          this.updateContainer(prop, value)
          event.target.value = value
        }
      }
    },
    increase (prop, event) {
      const target = event.target
      this.updateContainer(prop, (+target.value + 1) | 0)
      target.value = this.container[prop]
    },
    decrease (prop, event) {
      const target = event.target
      this.updateContainer(prop, (+target.value - 1) | 0)
      target.value = this.container[prop]
    },
    updateContainer (prop, value) {
      this.$store.commit('UPDATE_CONTAINER_PROPS', { [prop]: value })
    },
    changeColorHandler () {
      this.pushToHistory('color')
    },
    pushToHistory (prop) {
      let changedPropsNumber = 0
      const id = this.containerCopy.id
      const type = 'container'
      const container = this.$store.getters.coreContainerById(id)
      const command = {
        type: 'updateContainerProps',
        context: { id, type },
        newParams: {},
        oldParams: {}
      }
      if (!container) return
      for (let prop in this.containerCopy) {
        const oldValue = this.containerCopy[prop]
        const newValue = container[prop]
        if (newValue !== oldValue) {
          command.oldParams[prop] = oldValue
          command.newParams[prop] = newValue
          changedPropsNumber++
        }
      }
      if (changedPropsNumber) {
        this.$store.dispatch('historyPush', command)
        this.copyContainer()
      }
    },
    updateBounds () {
      this.$store.commit('UPDATE_BOUNDS')
    },
    copyContainer () {
      this.containerCopy = { ...this.container }
    },
    openInteractiveSettings () {
      this.$store.commit('TOGGLE_INTERACTIVE_SETTINGS', true)
    },
    preventDefaults (event) {
      if (event.ctrlKey) {
        event.preventDefault()
        return false
      }
    }
  },
  data () {
    return {
      containerCopy: {}
    }
  }
}
</script>

<style scoped>
.settings-label {
  margin-bottom: 0.35rem;
  font-size: 12px;
}
.settings-input {
  width: 100%;
  height: auto;
  margin-bottom: 1.05rem;
  padding: 1px 0 !important;
  color: #333;
  border: none;
  font-size: 14px;
  border-bottom: 1px solid;
  border-color: #d9d9d9;
  background-color: white;
  transition: border-color .3s cubic-bezier(.11,.7,0,1);
  outline: none;
}
.settings-input[readonly="readonly"] {
  color: rgba(0, 0, 0, 0.46)
}
.settings-input:not([readonly="readonly"]):focus {
  border-color: #0275d8;
}
.settings-title {
  margin-top: 0.7rem;
  margin-bottom: 0.7rem;
  padding-left: 0.5rem; 
  font-size: 13px;
  font-weight: bold;
}
.settings-cell {
  padding: 0 0.5rem !important;
}
.btn-margin {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
</style>
