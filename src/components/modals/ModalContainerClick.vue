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
import { clone, cloneDeep } from 'lodash'
import { defaultAction } from '../../../helpers/defaults'

export default {
  name: 'modal-container-click',
  computed: {
    active: {
      get () {
        return this.$store.getters.containerClickSettings
      },
      set (value) {
        this.$store.commit('TOGGLE_CONTAINER_CLICK_SETTINGS', value)
      }
    },
    activeContainer () {
      return this.$store.getters.containerProperties || {}
    },
    optionsScenes () {
      return this.$store.getters.containerTree
        .filter(e => e.parent_id === 0)
        .map(e => {
          return {
            value: e.id,
            text: e.name
          }
        })
    },
    isScene () {
      return this.activeContainer.parent_id === 0
    }
  },
  methods: {
    reset () {
      const a = this.activeContainer.action
      this.action = a ? JSON.parse(a) : cloneDeep(defaultAction)
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
      const oldData = clone(this.activeContainer)
      const action = JSON.stringify(this.action)
      this.$store.commit('CHANGE_CONTAINER_PROPERTIES', { action })
      const newData = clone(this.activeContainer)
      this.$store.commit('CHANGE_CONTAINER_STATE', {
        type: 'container',
        old: oldData,
        new: newData
      })
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
