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
    <div class="container">
      <p>Выберите шаблон и пользователя и установите необходимые права</p>
      <div class="row align-items-center">
        <div class="col-8">
          <Dropdown
            type="radio"
            title="Пользователь"
            :options="usersList"
            @changed="updateUserId" />
        </div>
        <div class="col-4">
          <b-form-checkbox v-model="assignment.delegate">
            делегирование прав *  
          </b-form-checkbox>
        </div>
      </div>
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
      <p>* Возможность пригласить других пользователей работать с шаблоном</p>
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
import UserAPI from '../../../api/user'
import TemplateAPI from '../../../api/template'
import ContainerAPI from '../../../api/container'
import Dropdown from '../common/Dropdown'
import { defaultAssignment } from '../../../helpers/defaults'

export default {
  name: 'modal-create-assignment',
  components: { Dropdown },
  computed: {
    active: {
      get () {
        this.updater()
        return this.$store.getters.createAssignment
      },
      set (value) {
        this.$store.commit('TOGGLE_CREATE_ASSIGNMENT', value)
      }
    },
    usersList () {
      return this.$store.getters.usersModalList
    },
    activeAssignment () {
      return this.$store.getters.activeAssignment
    },
    assignments () {
      return this.$store.getters.assignments
    }
  },
  created () {
    this.fetchUsersList()
    this.fetchTemplatesList()
    this.resetAssignment()
  },
  methods: {
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
    assign (event) {
      this.process = true
      this.updateContainerIds()
      console.log(this.assignment)
      UserAPI.assign(this.assignment, response => {
        this.$store.dispatch('fetchAssignments')
        this.$store.commit('TOGGLE_CREATE_ASSIGNMENT', false)
      }).then(() => {
        this.process = false
      })
      event.preventDefault()
    },
    unassign (event) {
      const id = this.assignment.id
      this.process = true
      UserAPI.unassign({ id }, response => {
        this.$store.commit('REMOVE_ASSIGNMENT', { id })
      }).then(() => {
        this.process = false
        this.$store.commit('TOGGLE_CREATE_ASSIGNMENT', false)
      })
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
      this.usersList.forEach(e => {
        e.active = (e.id === this.assignment.user_id)
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
    },
    closeModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', false)
      this.resetAssignment()
    },
    resetAssignment () {
      this.$store.commit('RESET_ASSIGNMENT')
      this.assignment = {}
      this.containers = []
    },
    updateUserId (user) {
      this.assignment.user_id = user.id
    },
    updateTemplateId (template) {
      const id = template.id
      this.assignment.template_id = id
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
    },
    fetchUsersList () {
      return UserAPI.getInvitedUsers(users => {
        let usersList = users.map(e => {
          return {
            id: e.id,
            text: e.name,
            active: false
          }
        })
        this.$store.commit('LOAD_USERS_LIST', usersList)
      })
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
      const uId = this.assignment.user_id
      const tId = this.assignment.template_id
      const ass = this.assignments.find(e => {
        return ((e.user_id === uId) && (e.template_id === tId))
      })
      if (!ass) return
      const c = JSON.parse(ass.containers)
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
      templates: [],
      containers: [],
      assignment: {},
      hide: true,
      indeterminateMedia: false,
      indeterminateProps: false,
      allMedia: false,
      allProps: false
    }
  }
}
</script>

<style scoped>
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
