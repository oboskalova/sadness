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
        <div class="col-md-12">
          <p class="label">ФИО</p>
          <input
            class="input"
            ref="name"
            type="text"
            :disabled="isChanging"
            @change="validator"
            v-model="obj.name">
          <span class="error" v-show="err.name">
            {{ err.name }}
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <p class="label">Почта</p>
          <input
            class="input"
            ref="email"
            type="email"
            :disabled="isChanging"
            @change="validator"
            v-model="obj.email">
          <span class="error" v-show="err.email">
            {{ err.email }}
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <p class="label">Пароль</p>
          <input
            class="input"
            ref="password"
            type="password"
            :disabled="isChanging"
            @change="validator"
            @focus="clearPass"
            v-model="obj.password">
          <span class="error" v-show="err.password">
            {{ err.password }}
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <Dropdown
            title="Группы"
            :options="groups"
            @changed="updateGroups" />
        </div>
      </div>
      <button :disabled="isChanging" class="btn btn-md btn-secondary float-right" type="button" @click="cancel">Отмена</button>
      <button :disabled="isChanging" class="btn btn-md btn-primary float-right" type="button" @click="validate">Сохранить</button>
    </div>
    <img
      v-if="isChanging"
      src="/static/img/spinner.gif"
      class="loader">
  </b-modal>
</template>

<script>
import { editUser } from '../../../api/managment'
import Dropdown from '../common/Dropdown2'

export default {
  name: 'modal-edit-admin',
  components: { Dropdown },
  mounted () {
    this.fetchGroups()
  },
  computed: {
    active: {
      get () {
        // var path = this.$route.path
        return this.$store.getters.editUser
      },
      set (value) {
        this.$store.commit('TOGGLE_EDIT_USER', value)
      }
    },
    targetUser () {
      return this.$store.getters.targetUser
    },
    groupsList () {
      return this.$store.getters.groups
    },
    editMode () {
      return this.$store.getters.editUserMode
    },
    titleText () {
      if (this.editMode) {
        return 'Изменение пользователя'
      } else {
        return 'Создание пользователя'
      }
    }
  },
  watch: {
    editMode (v) {
      if (v) this.loadItem()
    }
  },
  methods: {
    clearPass () {
      if (this.obj.password === '000000') {
        this.obj.password = null
      }
    },
    fetchGroups () {
      this.groups = this.groupsList.map(e => {
        return {
          id: e.id,
          text: e.name,
          active: false
        }
      })
    },
    updateGroups () {
      console.log(this.groupsList)
    },
    validator () {
      for (let prop in this.err) {
        this.err[prop] = null
      }
    },
    loadItem () {
      this.fetchGroups()
      for (let prop in this.obj) {
        if (this.targetUser.hasOwnProperty(prop)) {
          this.obj[prop] = this.targetUser[prop]
        } else {
          this.obj[prop] = null
          if (prop === 'password') this.obj.password = '000000'
        }
      }
      var group = JSON.parse(this.targetUser.groups)
      this.groups.forEach((el) => {
        if (group.includes(el.id)) {
          el.active = true
        }
      })
      this.oldEmail = this.obj.email
    },
    validate () {
      var valid = true
      if (this.obj.name.length === 0) {
        valid = false
        this.err.name = 'ФИО не может быть пустым'
      }
      if (this.obj.email) {
        if (this.obj.email.search('@') === -1) {
          valid = false
          this.err.email = 'Поле email должно содержать символ @'
        }
      } else {
        valid = false
        this.err.email = 'Поле email не должно быть пустым'
      }
      if (this.oldEmail !== this.obj.email) {
        if (this.obj.password === '000000' || !this.obj.password || this.obj.password.length === 0) {
          valid = false
          this.err.password = 'Введите новый пароль'
        }
      }
      if (valid) this.changeItem()
    },
    changeItem () {
      this.isChanging = true
      var group = []
      this.clearPass()
      this.groups.forEach((el) => {
        if (el.active) group.push(el.id)
      })
      this.obj.groups = JSON.stringify(group)
      return editUser(this.obj).then(response => {
        const data = response.data
        if (!data) return
        console.log(data)
        this.closeModal()
        this.isChanging = false
      }).catch(error => {
        console.log(error.response.data)
        if (error.response.data.email) {
          this.err.email = error.response.data.email[0]
        }
        this.isChanging = false
      })
    },
    clearErr () {
      for (let prop in this.err) {
        this.err[prop] = null
      }
    },
    cancel () {
      this.$store.commit('TOGGLE_EDIT_USER', false)
      this.$store.commit('TOGGLE_EDIT_MODE_USER', false)
    },
    closeModal () {
      for (let prop in this.obj) {
        this.obj[prop] = null
        if (prop === 'name') this.obj[prop] = 'Новый пользователь'
        if (prop === 'groups') this.obj[prop] = '[]'
      }
      this.groups = []
      this.fetchGroups()
      this.$emit('update')
      this.$store.commit('TOGGLE_EDIT_USER', false)
      this.$store.commit('TOGGLE_EDIT_MODE_USER', false)
    }
  },
  data () {
    return {
      groups: [],
      obj: {
        id: null,
        name: 'Новый пользователь',
        email: '',
        password: null,
        groups: '[]'
      },
      err: {
        name: null,
        email: null,
        password: null
      },
      isChanging: false,
      oldEmail: null
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
</style>