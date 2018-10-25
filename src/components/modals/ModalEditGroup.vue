<template>
  <b-modal centered
    v-model="active"
    @hide="closeModal"
    size="lg"
    :title="titleText" 
    ok-title="Сохранить"
    cancel-title="Отмена"
    :hide-footer="true"
    @ok="changeItem">
    <div>
      <div class="row">
        <div class="col-md-6">
          <p class="label">Название</p>
          <input
            class="input"
            ref="name"
            type="text"
            :disabled="isChanging || !editable"
            @change="validator"
            v-model="obj.name">
          <span class="error" v-show="err.name">
            {{ err.name }}
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <p class="label">Файлы</p>
          <b-form-checkbox
          :disabled="!editable"
          v-model="obj.files"
          class="modal-checkbox">
            Редактирование файлов
          </b-form-checkbox>
        </div>
        <div class="col-md-6">
          <p class="label">Пользователи</p>
          <b-form-checkbox
          :disabled="!editable"
          v-model="obj.users"
          class="modal-checkbox">
            Редактирование пользователей
          </b-form-checkbox>
        </div>
        <div class="col-md-6">
          <p class="label">Статистика</p>
          <b-form-checkbox
          :disabled="!editable"
          v-model="obj.statistics"
          class="modal-checkbox">
            Доступ к статистике
          </b-form-checkbox>
        </div>
        <div class="col-md-6">
          <p class="label">Группы</p>
          <b-form-checkbox
          :disabled="!editable"
          v-model="obj.groups"
          class="modal-checkbox">
            Редактирование групп пользователей
          </b-form-checkbox>
        </div>
        <div class="col-md-6">
          <p class="label">Плееры</p>
          <b-form-checkbox
          :disabled="!editable"
          v-model="obj.playersRead"
          class="modal-checkbox">
            Доступ к плеерам
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="!obj.playersRead || !editable"
          v-model="obj.playersEdit"
          class="modal-checkbox">
            Редактирование плееров
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="!obj.playersRead || !editable"
          v-model="obj.playersCreate"
          class="modal-checkbox">
            Создание плееров
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="!obj.playersRead || !editable"
          v-model="obj.playersDelete"
          class="modal-checkbox">
            Удаление плееров
          </b-form-checkbox>
        </div>
        <div class="col-md-6">
          <p class="label">Шаблоны</p>
          <b-form-checkbox
          :disabled="!editable"
          v-model="obj.templatesPublish"
          class="modal-checkbox">
            Публикация шаблонов
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="!editable"
          v-model="obj.templatesEdit"
          class="modal-checkbox">
            Редактирование шаблонов
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="!editable"
          v-model="obj.templatesCreate"
          class="modal-checkbox">
            Создание шаблонов
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="!editable"
          v-model="obj.templatesDelete"
          class="modal-checkbox">
            Удаление шаблонов
          </b-form-checkbox>
        </div>
        <div class="col-md-6">
          <p class="label">Расписания</p>
          <b-form-checkbox
          :disabled="!editable"
          v-model="obj.schedulesPlayers"
          class="modal-checkbox">
            Назначение плееров
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="!editable"
          v-model="obj.schedulesEdit"
          class="modal-checkbox">
            Редактирование расписаний
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="!editable"
          v-model="obj.schedulesCreate"
          class="modal-checkbox">
            Создание расписаний
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="!editable"
          v-model="obj.schedulesDelete"
          class="modal-checkbox">
            Удаление расписаний
          </b-form-checkbox>
        </div>
      </div>
      <button v-if="editable" :disabled="isChanging" class="btn btn-md btn-secondary float-right" type="button" @click="cancel">Отмена</button>
      <button v-if="editable" :disabled="isChanging" class="btn btn-md btn-primary float-right" type="button" @click="validate">Сохранить</button>
    </div>
    <img
      v-if="isChanging"
      src="/static/img/spinner.gif"
      class="loader">
  </b-modal>
</template>

<script>
import { editGroups } from '../../../api/managment'

export default {
  name: 'modal-edit-groups',
  computed: {
    active: {
      get () {
        // var path = this.$route.path
        return this.$store.getters.editGroup
      },
      set (value) {
        this.$store.commit('TOGGLE_EDIT_GROUP', value)
      }
    },
    targetOrg () {
      return this.$store.getters.targetGroup
    },
    editable () {
      if (this.$store.getters.targetGroup != null) {
        return this.$store.getters.targetGroup.org
      } else return true
    },
    editMode () {
      return this.$store.getters.editGroupMode
    },
    titleText () {
      if (this.editMode) {
        return 'Изменение группы'
      } else {
        return 'Создание группы'
      }
    }
  },
  watch: {
    editMode (v) {
      if (v) this.loadItem()
    }
  },
  methods: {
    validator () {
      for (let prop in this.err) {
        this.err[prop] = null
      }
    },
    loadItem () {
      for (let prop in this.obj) {
        if (this.targetOrg.hasOwnProperty(prop)) {
          this.obj[prop] = this.targetOrg[prop]
        } else {
          this.obj[prop] = false
        }
      }
      var templates = JSON.parse(this.obj.templates)
      this.obj.templatesEdit = templates.edit
      this.obj.templatesCreate = templates.create
      this.obj.templatesDelete = templates.delete
      this.obj.templatesPublish = templates.publish
      var schedules = JSON.parse(this.obj.schedules)
      this.obj.schedulesPlayers = schedules.editDisplays
      this.obj.schedulesCreate = schedules.create
      this.obj.schedulesEdit = schedules.edit
      this.obj.schedulesDelete = schedules.delete
      var players = JSON.parse(this.obj.players)
      if (players) {
        this.obj.playersRead = true
        this.obj.playersEdit = players.edit
        this.obj.playersCreate = players.create
        this.obj.playersDelete = players.delete
      }
    },
    validate () {
      var valid = true
      if (this.obj.name.length === 0) {
        valid = false
        this.err.name = 'Название группы не может быть пустым'
      }
      if (valid) this.changeItem()
    },
    changeItem () {
      this.isChanging = true
      if (this.obj.playersRead) {
        this.obj.players = JSON.stringify({
          edit: this.obj.playersEdit,
          create: this.obj.playersCreate,
          delete: this.obj.playersDelete
        })
      } else {
        this.obj.players = null
      }
      this.obj.templates = JSON.stringify({
        edit: this.obj.templatesEdit,
        create: this.obj.templatesCreate,
        delete: this.obj.templatesDelete,
        publish: this.obj.templatesPublish
      })
      this.obj.schedules = JSON.stringify({
        editDisplays: this.obj.schedulesPlayers,
        edit: this.obj.schedulesEdit,
        create: this.obj.schedulesCreate,
        delete: this.obj.schedulesDelete
      })
      return editGroups(this.obj).then(response => {
        const data = response.data
        if (!data) return
        console.log(data)
        this.closeModal()
        this.isChanging = false
      }).catch(error => {
        console.log(error)
        this.isChanging = false
      })
    },
    clearErr () {
      for (let prop in this.err) {
        this.err[prop] = null
      }
    },
    cancel () {
      this.$store.commit('TOGGLE_EDIT_GROUP', false)
      this.$store.commit('TOGGLE_EDIT_MODE_GROUP', false)
    },
    closeModal () {
      for (let prop in this.obj) {
        this.obj[prop] = false
        if (prop === 'id') this.obj[prop] = null
        if (prop === 'name') this.obj[prop] = 'Новая группа'
      }
      this.$emit('update')
      this.$store.commit('TOGGLE_EDIT_GROUP', false)
      this.$store.commit('TOGGLE_EDIT_MODE_GROUP', false)
    }
  },
  data () {
    return {
      obj: {
        id: null,
        name: 'Новая группа',
        files: false,
        change_info: false,
        users: false,
        statistics: false,
        groups: false,
        admin: false,
        templates: '',
        templatesPublish: false,
        templatesEdit: false,
        templatesCreate: false,
        templatesDelete: false,
        players: '',
        playersRead: false,
        playersEdit: false,
        playersCreate: false,
        playersDelete: false,
        schedules: '',
        schedulesPlayers: false,
        schedulesEdit: false,
        schedulesCreate: false,
        schedulesDelete: false
      },
      err: {
        name: null
      },
      id: 0,
      isChanging: false
    }
  }
}
</script>

<style scoped>
.label {
  margin-bottom: 0px;
}
.row {
  margin-bottom: 10px;
}
label {
  display: block;
}
</style>