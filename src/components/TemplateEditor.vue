<template>
  <div>
    <div class="content row no-gutters">
      <main class="main col" @click.self="removeSelection">
        <div class="file-manager container">
          <EditorList :templates="templates"
          :isLoading="isLoading"/>
        </div>
      </main>
      <ModalTemplateSettings
        :type="templateSettingsModalType"
        :activeTemplate="targetObject" />
      <b-modal centered
        id="confirm-publish"
        ref="confirmPublish"
        title="Подтвердите опубликование"
        cancel-title="Отмена"
        @ok="publishTemplate">
        <p class="text-left">Выделенный объект будет опубликован</p>
        <img v-if="isDeleting" src="/static/img/spinner.gif" class="loader">
      </b-modal>
      <b-modal centered
        id="confirm-delete"
        ref="confirmDelete"
        title="Подтвердите удаление"
        cancel-title="Отмена"
        :hide-footer="isDeleting"
        @ok="removeTemplate">
        <p class="text-left">Шаблон будет безвозвратно удален.<br>Вы действительно хотите удалить выбранный шаблон?</p>
        <img v-if="isDeleting" src="/static/img/spinner.gif" class="loader">
      </b-modal>
    </div>
  </div>
</template>

<script>
import ModalTemplateSettings from './modals/ModalTemplateSettings'
import EditorList from './template-editor/EditorList.vue'
import {
  getTemplateObjects,
  removeTemplateObjects,
  publishTemplateObject
} from '../../api/template-editor'

export default {
  name: 'template-editor',
  components: {
    EditorList,
    ModalTemplateSettings
  },
  data () {
    return {
      id: this.$route.params.id,
      modalState: false,
      isDeleting: false,
      isChanging: false,
      responseCode: -1,
      newTemplate: {}
    }
  },
  created () {
    this.fetchData()
  },
  computed: {
    isLoading () {
      return this.$store.getters.templateLoading
    },
    templates () {
      const isSearching = false
      return isSearching
        ? this.$store.getters.searchTagResults
        : this.$store.getters.editorCatalogue
    },
    targetObject () {
      return this.$store.getters.targetTemplate
    },
    templateSettingsModalType () {
      return this.$store.getters.templateSettingsType
    }
  },
  methods: {
    removeSelection: function () {
      this.$store.commit('REMOVE_TEMPLATE_SELECTION')
    },
    fetchData: function () {
      this.$store.commit('TOOGLE_TEMPLATE_LOADING', true)
      this.$store.dispatch('fetchPassport')
      this.$store.commit('TOGGLE_TEMPLATE_OBJECT', {})
      return getTemplateObjects().then(response => {
        const data = response.data
        if (!data) return
        this.$store.dispatch('uploadTemplates', data)
        this.$store.commit('TOOGLE_TEMPLATE_LOADING', false)
      }).catch(error => {
        const messageType = 'notFound'
        const responseCode = error.response.status
        this.$store.commit('DISPLAY_ALERT', { messageType, responseCode })
        this.$store.commit('TOOGLE_TEMPLATE_LOADING', false)
        this.$router.push('/templates')
      })
    },
    removeTemplate: function (event) {
      event.preventDefault()
      this.isDeleting = true
      removeTemplateObjects([ this.targetObject.id ]).then(response => {
        this.$store.commit('DELETE_TEMPLATE_OBJECTS')
        this.$refs.confirmDelete.hide()
        this.isDeleting = false
      }).catch(error => {
        console.log(error.response)
      })
    },
    publishTemplate: function (event) {
      event.preventDefault()
      const id = this.targetObject.id
      const status = true
      publishTemplateObject({ id, status }).then(response => {
        this.$refs.confirmPublish.hide()
        this.fetchData()
        this.$root.sockets.sendData('update', { template: id })
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style>
  .file-manager {
    padding: 1rem 1.25rem;
  }
  .row--divided {
    padding: 0.75rem 1.25rem;
    border-top: 1.5px solid rgba(235,235,235,1);
  }
  .row--dragging {
    opacity: 0.4;
  }
  .row--active {
    box-shadow: 0 0 0 1px #05a inset;
  }
  .row--choosed {
    background: rgba(245,245,245,1);
  }
  .row--choosed,
  .row--choosed + .row--divided {
    border-color: rgba(245,245,245,1);
  }
  .row--right {
    padding: 0;
    justify-content: flex-end;
  }
  .row--sb {
    padding: 0;
    justify-content: space-between;
  }
  .block {
    width: 100%;
    display: block;
  }
</style>
