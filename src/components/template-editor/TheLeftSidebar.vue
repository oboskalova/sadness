<template>
  <aside class="aside">
    <div class="aside-header">
      <h3 class="aside-title">Структура</h3>
    </div>
    <div class="aside-inner">
      <img
        v-if="loading"
        src="/static/img/spinner.gif"
        class="loader">
      <div v-if="!loading" class="btn-margin">
        <button
          class="btn btn-default"
          :disabled="!templateSettings.edit_props"
          @click="createScene">
          <span>
            <i class="mi mi-add"></i>
            Добавить сцену
          </span>
        </button>
        <button
          class="btn btn-default"
          :disabled="!activeContainer.editable || !templateSettings.editable"
          @click="createContainer">
          <span>
            <i class="mi mi-add"></i>
            Добавить контейнер
          </span>
        </button>
      </div>
      <div v-if="this.templateSettings.editable" class="treerer">
        <draggable
          v-if="!loading"
          v-model="scenesList">
          <CoreTree
            v-for="scene in scenesList"
            :key="scene.id"
            :tree="scene" />
        </draggable>
      </div>
      <div v-else>
        <div class="treerer"
          v-if="!loading">
          <CoreTree
            v-for="scene in scenesList"
            :key="scene.id"
            :tree="scene" />
        </div>
      </div>
      <div class="edited-by">
        Изменено пользователем {{ templateSettings.edited_by }} <br/>
        в {{ modify }}
      </div>
    </div>
  </aside>
</template>

<script>
import CoreTree from './CoreTree'
import draggable from 'vuedraggable'
import moment from 'moment'

export default {
  name: 'editor-left-sidebar',
  props: ['tree', 'loading'],
  components: {
    CoreTree,
    draggable
  },
  computed: {
    scenesList: {
      get () {
        let l = Object.values(this.$store.getters.coreGraph[0] || {})
        return l.sort((a, b) => a.order - b.order)
      },
      set (value) {
        this.$store.commit('CHANGE_SCENES_ORDERS', value)
      }
    },
    modify () {
      const date = moment.utc(this.templateSettings.updated_at).format()
      if (date === 'Invalid Date') return this.templateSettings.updated_at
      return moment(date).format('HH:mm, DD.MM.YYYY')
    },
    maxOrder () {
      const i = this.scenesList.length
      return i > 0 ? this.scenesList[i - 1].order : 0
    },
    activeContainer () {
      return this.$store.getters.coreActiveContainer
    },
    activeContainerId () {
      const cId = this.$store.getters.coreActiveContainer.id
      const sId = this.$store.getters.coreActiveScene
      return cId || sId
    },
    templateSettings () {
      return this.$store.getters.coreTemplate
    },
    commonProps () {
      return {
        x: 0,
        y: 0,
        z: 0,
        parent_id: 0,
        template_id: this.templateSettings.id
      }
    }
  },
  data () {
    return {
      active: false,
      timeId: null
    }
  },
  methods: {
    showMenu () {
      clearTimeout(this.timeId)
      this.active = true
    },
    hideMenu () {
      clearTimeout(this.timeId)
      this.timeId = setTimeout(() => {
        this.active = false
      }, 500)
    },
    createScene () {
      clearTimeout(this.timeId)
      const order = this.maxOrder + 1
      this.active = false
      this.$store.dispatch('createContainer', {
        ...this.commonProps,
        name: 'Новая сцена',
        width: this.templateSettings.width,
        height: this.templateSettings.height,
        order
      })
    },
    createContainer () {
      const activeContainer = this.$store.getters.coreActiveContainer
      const width = 0.333 * (activeContainer.width || this.templateSettings.width) | 0
      const height = 0.333 * (activeContainer.height || this.templateSettings.height) | 0
      clearTimeout(this.timeId)
      this.active = false
      this.$store.dispatch('createContainer', {
        width,
        height,
        ...this.commonProps,
        name: 'Новый контейнер',
        parent_id: this.activeContainerId
      })
      this.$store.commit('OPEN_PARENT', this.activeContainerId)
    }
  }
}
</script>

<style scoped>
.treerer {
  padding: 0.5rem;
  margin: -0.5rem;
  overflow: auto;
  height: calc(100vh - 305px);
}
.aside {
  min-width: 18%;
  max-width: 18%;
}
.menu {
  top: 8px;
  right: -12px;
  width: 210px;
  display: none;
  position: absolute;
  cursor: default;
  border-radius: 3px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  background: rgba(16,16,16,16.95);
  transform: translate(100%);
  z-index: 999999999999;
}
.menu.active {
  display: block;
}
.menu-tail {
  top: 10px;
  left: 0;
  width: 14px;
  height: 14px;
  margin-left: -6px;
  position: absolute;
  background: inherit;
  transform: rotate(45deg);
  box-shadow: inherit;
}
.menu-inner {
  width: 100%;
  padding: 0.5rem 1rem;
  position: relative;
  background: inherit;
  border-radius: inherit;
}
.menu-button {
  border: none;
  outline: none;
  display: block;
  background: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: color 400ms ease;
  line-height: 1.7;
}
.menu-button:hover {
  color: rgba(255,255,255,1);
}
.btn-margin {
  margin: 0.5rem !important;
}
.btn-margin > .btn {
  margin-bottom: 0.5rem !important;
}
.edited-by {
  color: #9e9e9e;
  padding: 15px 23px;
  position: absolute;
  bottom: 5px;
  left: 5px;
}
</style>
