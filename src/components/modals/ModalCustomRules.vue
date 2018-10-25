<template>
  <b-modal centered
    v-model="active"
    title="Назначить права"
    ok-title="Назначить"
    cancel-title="Отмена"
    size="lg"
    :ok-disabled="process"
    @ok="assign"
    @shown="openModal"
    @hidden="resetAssignment">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link" :class="{ 'active': page === 'all' }" @click="tooglePage('all')">Все</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ 'active': page === 'templates' }" @click="tooglePage('templates')">Конкретный шаблон</a>
      </li>
    </ul>
    <div v-show="page === 'all'" class="container">
      <div class="row">
        <div class="col-md-12">
          <Dropdown2
            title="Группы"
            :options="groups"
            @changed="updateGroupCheck" />
        </div>
        <div class="col-md-6">
          <p class="label">Файлы</p>
          <b-form-checkbox
          :disabled="dis.files"
          v-model="obj.files"
          class="modal-checkbox">
            Редактирование файлов
          </b-form-checkbox>
        </div>
        <div class="col-md-6">
          <p class="label">Пользователи</p>
          <b-form-checkbox
          :disabled="dis.users"
          v-model="obj.users"
          class="modal-checkbox">
            Редактирование пользователей
          </b-form-checkbox>
        </div>
        <div class="col-md-6">
          <p class="label">Статистика</p>
          <b-form-checkbox
          :disabled="dis.statistics"
          v-model="obj.statistics"
          class="modal-checkbox">
            Доступ к статистике
          </b-form-checkbox>
        </div>
        <div class="col-md-6">
          <p class="label">Группы</p>
          <b-form-checkbox
          :disabled="dis.groups"
          v-model="obj.groups"
          class="modal-checkbox">
            Редактирование групп пользователей
          </b-form-checkbox>
        </div>
        <div class="col-md-6">
          <p class="label">Плееры</p>
          <b-form-checkbox
          :disabled="dis.playersRead"
          v-model="obj.playersRead"
          class="modal-checkbox">
            Доступ к плеерам
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="!obj.playersRead || dis.playersEdit"
          v-model="obj.playersEdit"
          class="modal-checkbox">
            Редактирование плееров
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="!obj.playersRead || dis.playersCreate"
          v-model="obj.playersCreate"
          class="modal-checkbox">
            Создание плееров
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="!obj.playersRead || dis.playersDelete"
          v-model="obj.playersDelete"
          class="modal-checkbox">
            Удаление плееров
          </b-form-checkbox>
        </div>
        <div class="col-md-6">
          <p class="label">Шаблоны</p>
          <b-form-checkbox
          :disabled="dis.templatesPublish"
          v-model="obj.templatesPublish"
          class="modal-checkbox">
            Публикация шаблонов
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="dis.templatesEdit"
          v-model="obj.templatesEdit"
          class="modal-checkbox">
            Редактирование шаблонов
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="dis.templatesCreate"
          v-model="obj.templatesCreate"
          class="modal-checkbox">
            Создание шаблонов
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="dis.templatesDelete"
          v-model="obj.templatesDelete"
          class="modal-checkbox">
            Удаление шаблонов
          </b-form-checkbox>
        </div>
        <div class="col-md-6">
          <p class="label">Расписания</p>
          <b-form-checkbox
          :disabled="dis.schedulesPlayers"
          v-model="obj.schedulesPlayers"
          class="modal-checkbox">
            Назначение плееров
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="dis.schedulesEdit"
          v-model="obj.schedulesEdit"
          class="modal-checkbox">
            Редактирование расписаний
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="dis.schedulesCreate"
          v-model="obj.schedulesCreate"
          class="modal-checkbox">
            Создание расписаний
          </b-form-checkbox>
          <b-form-checkbox
          :disabled="dis.schedulesDelete"
          v-model="obj.schedulesDelete"
          class="modal-checkbox">
            Удаление расписаний
          </b-form-checkbox>
        </div>
      </div>
    </div>
    <div v-show="page === 'templates'" class="container">
      <p>Выберите шаблон и установите необходимые права</p>
      <div class="row align-items-center">
        <div class="col-8">
          <Dropdown
            type="radio"
            title="Шаблон"
            :options="templates"
            @changed="updateTemplateId" />
        </div>
        <div class="col-4">
          <b-form-checkbox @change="updater" v-model="assignment.edit_props">
            полные права
          </b-form-checkbox>
        </div>
      </div>
      <div v-if="!hide" class="row no-gutters header">
        <div class="col col-8">Название элемента</div>
        <div class="col col-2">
          <input type="checkbox" id="checkboxer1" :indeterminate.prop="this.indeterminateProps" v-model="allProps" @change="selectProps">
          <span class="texter">Редактировать свойства</span>
        </div>
        <div class="col col-2">
          <input type="checkbox" id="checkboxer2" :indeterminate.prop="this.indeterminateMedia" v-model="allMedia" @change="selectMedia">
          <span class="texter">Редактировать содержимое</span>
        </div>
      </div>
      <div class="bounded" v-if="this.containers.length && !hide">
        <div
          class="row no-gutters list-item"
          v-for="c in containers"
          :key="c.id">
          <div class="col col-8">{{ c.name }}</div>
          <div class="col col-2">
            <b-form-checkbox @change="makeChilds(c)" :disabled="c.disabled" v-model="c.edit_props">
              {{ c.edit_props ? 'да' : 'нет' }}
            </b-form-checkbox>
          </div>
          <div class="col col-2">
            <b-form-checkbox v-model="c.edit_playlist" @change="pick">
              {{ c.edit_playlist ? 'да' : 'нет' }}
            </b-form-checkbox>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col text-center">
          <button
            class="link"
            @click="unassign">
            Отменить назначение
          </button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import TemplateAPI from '../../../api/template'
import ContainerAPI from '../../../api/container'
import { getUserRules, saveCustomRules, editUser } from '../../../api/managment'
import Dropdown from '../common/Dropdown'
import { defaultAssignment } from '../../../helpers/defaults'
import Dropdown2 from '../common/Dropdown2'

export default {
  name: 'modal-create-assignment',
  components: { Dropdown, Dropdown2 },
  computed: {
    active: {
      get () {
        this.updater()
        return this.$store.getters.customRules
      },
      set (value) {
        this.$store.commit('TOGGLE_CUSTOM_RULES', value)
      }
    },
    targetUser () {
      return this.$store.getters.targetUser
    },
    activeAssignment () {
      return this.$store.getters.activeAssignment
    },
    assignments () {
      return this.$store.getters.assignments
    },
    groupsList () {
      return this.$store.getters.groups
    }
  },
  created () {
    this.resetAssignment()
    this.fetchTemplatesList()
  },
  methods: {
    updateGroupCheck () {
      this.clearObj()
      for (let prop in this.dis) {
        this.dis[prop] = false
      }
      this.groups.forEach((el) => {
        if (el['active']) {
          for (let prop in el) {
            if (this.dis.hasOwnProperty(prop)) {
              if (el[prop]) {
                this.obj[prop] = true
                this.dis[prop] = true
              }
            }
          }
          var templates = JSON.parse(el.templates)
          if (templates) {
            if (templates.edit) {
              this.obj.templatesEdit = true
              this.dis.templatesEdit = true
            }
            if (templates.create) {
              this.obj.templatesCreate = true
              this.dis.templatesCreate = true
            }
            if (templates.publish) {
              this.obj.templatesPublish = true
              this.dis.templatesPublish = true
            }
            if (templates.delete) {
              this.obj.templatesDelete = true
              this.dis.templatesDelete = true
            }
          }
          var schedules = JSON.parse(el.schedules)
          if (schedules) {
            if (schedules.editDisplays) {
              this.obj.schedulesPlayers = true
              this.dis.schedulesPlayers = true
            }
            if (schedules.create) {
              this.obj.schedulesCreate = true
              this.dis.schedulesCreate = true
            }
            if (schedules.edit) {
              this.obj.schedulesEdit = true
              this.dis.schedulesEdit = true
            }
            if (schedules.delete) {
              this.obj.schedulesDelete = true
              this.dis.schedulesDelete = true
            }
          }
          var players = JSON.parse(el.players)
          if (players) {
            this.obj.playersRead = true
            this.dis.playersRead = true
            if (players.edit) {
              this.obj.playersEdit = true
              this.dis.playersEdit = true
            }
            if (players.create) {
              this.obj.playersCreate = true
              this.dis.playersCreate = true
            }
            if (players.delete) {
              this.obj.playersDelete = true
              this.dis.playersDelete = true
            }
          }
        }
      })
    },
    tooglePage (v) {
      this.page = v
    },
    selectProps () {
      setTimeout(() => {
        this.containers.filter(el => el.parent_id === 0).forEach((el) => {
          el.edit_props = this.allProps
          this.fillChilds(el)
        })
        this.indeterminateProps = false
      }, 200)
    },
    selectMedia () {
      setTimeout(() => {
        this.containers.forEach((el) => {
          el.edit_playlist = this.allMedia
        })
        this.indeterminateMedia = false
      }, 200)
    },
    pickProps () {
      setTimeout(() => {
        var status = false
        var allCheck = true
        if (this.containers.length === 0) allCheck = false
        this.containers.filter(el => !el.disabled).forEach((el) => {
          if (el.edit_props) {
            if (!status) {
              status = true
            }
          } else {
            allCheck = false
          }
        })
        if (allCheck) {
          this.allProps = true
          this.indeterminateProps = false
        } else {
          this.allProps = false
          this.indeterminateProps = status
        }
      }, 200)
    },
    pick () {
      setTimeout(() => {
        var status = false
        var allCheck = true
        if (this.containers.length === 0) allCheck = false
        this.containers.forEach((el) => {
          if (el.edit_playlist) {
            if (!status) {
              status = true
            }
          } else {
            allCheck = false
          }
        })
        if (allCheck) {
          this.allMedia = true
          this.indeterminateMedia = false
        } else {
          this.allMedia = false
          this.indeterminateMedia = status
        }
      }, 200)
    },
    fillChilds (elem) {
      this.containers.forEach(e => {
        if (e.parent_id === elem.id) {
          if (elem.edit_props) {
            e.disabled = true
            e.edit_props = true
          } else {
            e.disabled = false
            e.edit_props = false
          }
          this.fillChilds(e)
        }
      })
    },
    makeChilds (c) {
      var elem = c
      setTimeout(() => {
        this.fillChilds(elem)
      }, 200)
      this.pickProps()
    },
    updater () {
      setTimeout(() => {
        this.hide = this.assignment.edit_props
      }, 20)
    },
    clearObj () {
      for (let prop in this.obj) {
        if (this.dis.hasOwnProperty(prop)) {
          if (this.dis[prop]) this.obj[prop] = false
        }
      }
    },
    assign (event) {
      this.process = true
      this.fetchBack()
      this.clearObj()
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
      console.log('save rules', this.rules)
      console.log('save custom', this.obj)
      var groups = []
      this.groups.forEach((el) => {
        if (el['active']) groups.push(el['id'])
      })
      console.log('ssfge', groups)
      if (groups.length === 0) groups = [1]
      saveCustomRules({ rules: this.rules, custom: this.obj, user_id: this.targetUser.id }).then(() => {
        editUser({ ...this.targetUser, groups: JSON.stringify(groups) }).then((data) => {
          this.$emit('update')
          console.log(data)
        })
        this.process = false
        this.$store.commit('TOGGLE_CUSTOM_RULES', false)
        this.closeModal()
      })
      event.preventDefault()
    },
    unassign (event) {
      this.closeModal()
      event.preventDefault()
    },
    reset () {
      this.containers = []
      this.allMedia = false
      this.allProps = false
      const keys = Object.keys(defaultAssignment)
      keys.forEach(key => {
        this.assignment[key] = this.activeAssignment[key]
      })
      const templateId = this.assignment.template_id
      this.templates.forEach(e => {
        e.active = (e.id === templateId)
      })
      this.fetchContainersList(templateId).then(this.updateContainerAssignments)
    },
    openModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', true)
      this.reset()
      this.updateUserId()
      this.fetchRules()
    },
    closeModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', false)
      this.resetAssignment()
    },
    fetchRules () {
      var savedGroups = JSON.parse(this.targetUser.groups) || []
      console.log(savedGroups)
      this.groupsList.forEach((el) => {
        if (savedGroups.includes(el.id)) {
          this.groups.push({...el, id: el.id, text: el.name, active: true})
        } else {
          this.groups.push({...el, id: el.id, text: el.name, active: false})
        }
      })
      const custom = JSON.parse(this.targetUser.custom)
      for (let prop in this.obj) {
        if (custom.hasOwnProperty(prop)) {
          this.obj[prop] = custom[prop]
        } else {
          this.obj[prop] = false
        }
      }
      if (custom.templates) {
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
      }
      this.updateGroupCheck()
      console.log('grr', this.groups)
      getUserRules(this.targetUser.id).then((response) => {
        console.log(response.data)
        this.rules = response.data
        console.log('rules', this.rules)
      })
    },
    resetAssignment () {
      // this.$store.commit('RESET_ASSIGNMENT')
      this.assignment = defaultAssignment
      this.page = 'all'
      this.containers = []
      this.rules = []
      this.groups = []
      for (let prop in this.obj) {
        this.obj[prop] = false
      }
    },
    updateUserId () {
      console.log(this.targetUser)
      this.assignment.user_id = this.targetUser.id
    },
    fetchBack () {
      this.updateContainerIds()
      if (this.assignment.template_id) {
        var founded = false
        this.rules.forEach((el) => {
          if (el.template_id === this.assignment.template_id) {
            el.containers = this.assignment.containers
            el.edit_props = this.assignment.edit_props
            founded = true
          }
        })
        if (!founded) {
          let copy = {}
          for (let key in this.assignment) {
            copy[key] = this.assignment[key]
          }
          this.rules.push(copy)
          console.log('pushed', this.assignment)
        }
        console.log('backed', this.assignment)
      }
    },
    updateTemplateId (template) {
      console.log('sass', this.assignment)
      this.fetchBack()
      const id = template.id
      console.log('temp_id', id)
      this.assignment.template_id = id
      var assignment = defaultAssignment
      var found = false
      // console.log('rules', this.rules)
      this.rules.forEach((el) => {
        if (el.template_id === id) {
          assignment.id = el.id
          assignment.template_id = el.template_id
          assignment.containers = el.containers
          assignment.edit_props = el.edit_props
          found = true
        }
      })
      if (!found) {
        assignment.id = null
        assignment.template_id = id
        assignment.containers = []
        assignment.edit_props = false
      }
      console.log('ss', assignment)
      const keys = Object.keys(defaultAssignment)
      keys.forEach(key => {
        this.assignment[key] = assignment[key]
      })
      if (this.assignment.template_id === null) {
        this.assignment.template_id = id
      }
      console.log('asss', this.assignment)
      console.log('rules', this.rules)
      this.fetchContainersList(id).then(this.updateContainerAssignments)
    },
    updateContainerIds () {
      this.assignment.containers = []
      this.containers.forEach(e => {
        if ((!e.disabled && e.edit_props) || e.edit_playlist) {
          if (e.disabled) {
            this.assignment.containers.push({
              id: e.id,
              name: e.name,
              parent_id: e.parent_id,
              edit_props: false,
              edit_playlist: e.edit_playlist
            })
          } else {
            this.assignment.containers.push(e)
          }
        }
      })
      console.log('ass cont', this.assignment.containers)
    },
    fetchTemplatesList () {
      return TemplateAPI.fetchAll(templates => {
        this.templates = templates.map(e => {
          return {
            id: e.id,
            text: e.name,
            active: false
          }
        })
      })
    },
    fetchContainersList (templateId) {
      return ContainerAPI.fetchAllOf({ templateId },
        containers => {
          this.containers = containers.map(e => {
            return {
              id: e.id,
              name: e.name,
              parent_id: e.parent_id,
              edit_props: false,
              edit_playlist: false,
              disabled: false
            }
          })
        },
        () => {
          this.containers = []
        })
    },
    updateContainerAssignments () {
      // const uId = this.assignment.user_id
      const tId = this.assignment.template_id
      const ass = this.rules.find(e => {
        return ((e.template_id === tId))
      })
      if (!ass) return
      const c = ass.containers
      if (!Array.isArray(c)) return
      let rights = Object.create(null)
      c.forEach(e => {
        rights[e.id] = {
          edit_props: e.edit_props,
          edit_playlist: e.edit_playlist
        }
      })
      this.containers.forEach(e => {
        const r = rights[e.id]
        if (r) {
          console.log(r.edit_props)
          Object.assign(e, r)
          if (r.edit_props) {
            setTimeout(() => {
              this.fillChilds(e)
            }, 200)
          }
        }
      })
      this.pickProps()
      this.pick()
      this.updater()
    }
  },
  data () {
    return {
      process: false,
      rules: [],
      templates: [],
      containers: [],
      assignment: {},
      groups: [],
      hide: true,
      indeterminateMedia: false,
      indeterminateProps: false,
      allMedia: false,
      allProps: false,
      page: 'all',
      obj: {
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
      dis: {
        files: false,
        change_info: false,
        users: false,
        statistics: false,
        groups: false,
        admin: false,
        templatesPublish: false,
        templatesEdit: false,
        templatesCreate: false,
        templatesDelete: false,
        playersRead: false,
        playersEdit: false,
        playersCreate: false,
        playersDelete: false,
        schedulesPlayers: false,
        schedulesEdit: false,
        schedulesCreate: false,
        schedulesDelete: false
      }
    }
  }
}
</script>

<style scoped>
label {
  display: block;
}
#checkboxer1, #checkboxer2 {
  float: left;
  margin-top: 7px;
  margin-right: 10px;
}
.link {
  margin-top: 0.5rem;
  margin-bottom: 0.4rem;
  padding: 0;
  border: none;
  border-bottom: 1px dotted;
  background: none;
  display: inline-block;
  cursor: pointer;
  opacity: 0.4;
  outline: none;
  transition: opacity 100ms ease-in;
}
.link:hover {
  opacity: 0.6;
}
.bounded {
  margin: 1rem 0;
  max-height: 160px;
  overflow-y: auto;
}
.header {
  padding: 4px 0;
  font-size: 10px;
  margin-right: 15px;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1.5px solid rgba(235,235,235,1);
  align-items: center;
}
.list-item {
  padding: 4px 0;
}
</style>
