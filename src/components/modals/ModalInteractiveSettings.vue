<template>
  <b-modal v-model="active"
    title="Настройки интерактивности"
    cancel-title="Отмена"
    @ok="saveSettings"
    @shown="openModal"
    @hide="closeModal"
    centered>
    <div>
      <b-form-checkbox
        v-model="action.click.active"
        class="modal-checkbox">
        Переход по клику
      </b-form-checkbox>
      <p
        class="legend"
        :class="{ 'active': action.click.active }">
        Сцена для перехода
      </p>
      <b-form-select
        :value="action.click.target"
        :options="optionsScenes"
        @input="value => { action.click.target = value }"
        :disabled="!action.click.active">
      </b-form-select>
      <template v-if="isScene">
        <b-form-checkbox
          v-model="action.timeout.active"
          class="modal-checkbox">
          Переход по времени
        </b-form-checkbox>
        <p
          class="legend"
          :class="{ 'active': action.timeout.active }">
          Сцена для перехода
        </p>
        <b-form-select
          :value="action.timeout.target"
          :options="optionsScenes"
          @input="value => { action.timeout.target = value }"
          :disabled="!action.timeout.active">
        </b-form-select>
        <p
          class="legend"
          :class="{ 'active': action.timeout.active }">
          Таймаут (в секундах)
        </p>
        <input
          type="number"
          :value="action.timeout.ms"
          @input.prevent="updateTimeout"
          :disabled="!action.timeout.active" />
      </template>
    </div>
  </b-modal>
</template>

<script>
import { cloneDeep } from 'lodash'
import { defaultAction } from '../../../helpers/defaults'

export default {
  name: 'modal-interactive-settings',
  computed: {
    active: {
      get () {
        return this.$store.getters.interactiveSettings
      },
      set (value) {
        this.$store.commit('TOGGLE_INTERACTIVE_SETTINGS', value)
      }
    },
    activeContainer () {
      return this.$store.getters.coreActiveContainer || {}
    },
    coreActiveSceneId () {
      return this.$store.getters.coreActiveScene || 0
    },
    optionsScenes () {
      const scenes = this.$store.getters.coreGraph[0] || {}
      const options = []
      for (let sceneId in scenes) {
        if (scenes.hasOwnProperty(sceneId)) {
          const e = scenes[sceneId]
          if (e.show) {
            options.push({
              value: e.id,
              text: e.name
            })
          }
        }
      }
      return options
    },
    isScene () {
      return this.activeContainer.parent_id === 0
    }
  },
  methods: {
    reset () {
      const a = this.activeContainer.action
      if (a === '{}') {
        this.action = cloneDeep(defaultAction)
        this.action.click.target = this.coreActiveSceneId
        this.action.timeout.target = this.coreActiveSceneId
      } else {
        this.action = a ? JSON.parse(a) : cloneDeep(defaultAction)
      }
      this.type = 'click'
    },
    openModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', true)
      this.reset()
    },
    closeModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', false)
    },
    updateTimeout (event) {
      const value = +event.target.value
      this.action.timeout.ms = (value < 0) ? 0 : value
      event.target.value = this.action.timeout.ms
    },
    saveSettings () {
      const action = JSON.stringify(this.action)
      const oldAction = this.activeContainer.action
      const command = {
        type: 'updateContainerProps',
        context: { id: this.activeContainer.id, type: 'container' },
        newParams: { action },
        oldParams: { action: oldAction }
      }
      this.$store.commit('UPDATE_CONTAINER_PROPS', { action })
      this.$store.dispatch('historyPush', command)
    }
  },
  data () {
    return {
      action: { click: {}, timeout: {} }
    }
  }
}
</script>

<style scoped>
.legend {
  opacity: 0.6
}
.legend.active {
  opacity: 1
}
.legend, .modal-checkbox {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
</style>
