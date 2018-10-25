<template>
  <b-modal centered
    v-model="active"
    @show="openModal"
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
            :disabled="isChanging"
            @change="validator"
            v-model="obj.name">
          <span class="error" v-show="err.name">
            {{ err.name }}
          </span>
        </div>
        <div class="col-md-6">
          <p class="label">ИНН</p>
          <input
            class="input number"
            ref="inn"
            type="number"
            :disabled="isChanging"
            @change="validator"
            v-model="obj.inn">
          <span class="error" v-show="err.inn">
            {{ err.inn }}
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <p class="label">Адрес</p>
          <input
            class="input"
            ref="adress"
            type="text"
            :disabled="isChanging"
            @change="validator"
            v-model="obj.adress">
          <span class="error" v-show="err.adress">
            {{ err.adress }}
          </span>
        </div>
        <div class="col-md-6">
          <p class="label">Телефон</p>
          <input
            class="input"
            ref="phone"
            type="text"
            :disabled="isChanging"
            @change="validator"
            v-model="obj.phone">
          <span class="error" v-show="err.phone">
            {{ err.phone }}
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <p class="label">Веб Сайт</p>
          <input
            class="input"
            ref="site"
            type="text"
            :disabled="isChanging"
            @change="validator"
            v-model="obj.site">
          <span class="error" v-show="err.site">
            {{ err.site }}
          </span>
        </div>
        <div class="col-md-6">
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
        <div class="col-md-6">
          <p class="label">Дисковая квота, гб</p>
          <input
            class="input number"
            ref="quota"
            type="number"
            :disabled="isChanging"
            @change="validator"
            v-model="obj.quota">
          <span class="error" v-show="err.quota">
            {{ err.quota }}
          </span>
        </div>
      </div>
      <br>
      <h5 v-if="!editMode">Администратор организации</h5>
      <br>
      <div class="row" v-if="!editMode">
        <div class="col-md-12">
          <p class="label">ФИО</p>
          <input
            class="input"
            ref="name"
            type="text"
            :disabled="isChanging"
            @change="validator"
            v-model="usr.name">
          <span class="error" v-show="err.uName">
            {{ err.uName }}
          </span>
        </div>
      </div>
      <div class="row" v-if="!editMode">
        <div class="col-md-12">
          <p class="label">Почта</p>
          <input
            class="input"
            ref="email"
            type="email"
            :disabled="isChanging"
            @change="validator"
            v-model="usr.email">
          <span class="error" v-show="err.uEmail">
            {{ err.uEmail }}
          </span>
        </div>
      </div>
      <div class="row" v-if="!editMode">
        <div class="col-md-12">
          <p class="label">Пароль</p>
          <input
            class="input"
            ref="password"
            type="password"
            :disabled="isChanging"
            @change="validator"
            v-model="usr.password">
          <span class="error" v-show="err.uPassword">
            {{ err.uPassword }}
          </span>
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
import { editOrgs, editOrgsAdmin } from '../../../api/managment'

export default {
  name: 'modal-rename',
  computed: {
    active: {
      get () {
        // var path = this.$route.path
        return this.$store.getters.editOrg
      },
      set (value) {
        this.$store.commit('TOGGLE_EDIT_ORG', value)
      }
    },
    targetOrg () {
      return this.$store.getters.targetOrg
    },
    editMode () {
      return this.$store.getters.editOrgMode
    },
    titleText () {
      if (this.editMode) {
        return 'Изменение организации'
      } else {
        return 'Создание организации'
      }
    }
  },
  watch: {
    editMode (v) {
      if (v) this.loadItem()
    }
  },
  methods: {
    openModal () {
      this.success = false
    },
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
          this.obj[prop] = null
        }
      }
    },
    validate () {
      var valid = true
      if (this.obj.name.length === 0) {
        valid = false
        this.err.name = 'Название организации не может быть пустым'
      }
      if (!this.obj.quota) {
        valid = false
        this.err.quota = 'Дисковая квота должна быть задана'
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
      if (this.usr.name.length === 0 && !this.editMode) {
        valid = false
        this.err.uName = 'ФИО пользователя не может быть пустым'
      }
      if (!this.editMode) {
        if (this.usr.email) {
          if (this.usr.email.search('@') === -1) {
            valid = false
            this.err.uEmail = 'Поле email должно содержать символ @'
          }
        } else {
          valid = false
          this.err.uEmail = 'Поле email не должно быть пустым'
        }
      }
      if (this.usr.password.length === 0 && !this.editMode) {
        valid = false
        this.err.uPassword = 'Пароль пользователя не может быть пустым'
      }
      if (valid) this.changeItem()
    },
    changeItem () {
      this.isChanging = true
      if (this.success) {
        this.changeUser()
      } else {
        return editOrgs(this.obj).then(response => {
          const data = response.data
          if (!data) return
          console.log(data)
          this.usr.org = data.id
          this.success = true
          if (this.editMode) {
            this.closeModal()
            this.isChanging = false
          } else {
            this.changeUser()
          }
        }).catch(error => {
          console.log(error)
          this.isChanging = false
        })
      }
    },
    changeUser () {
      return editOrgsAdmin(this.usr).then(response => {
        const data2 = response.data
        if (!data2) return
        console.log(data2)
        this.closeModal()
        this.isChanging = false
      }).catch(error => {
        if (error.response.data.email) {
          this.err.uEmail = error.response.data.email[0]
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
      this.$store.commit('TOGGLE_EDIT_ORG', false)
      this.$store.commit('TOGGLE_EDIT_MODE_ORG', false)
    },
    closeModal () {
      for (let prop in this.obj) {
        this.obj[prop] = null
        if (prop === 'quota') this.obj[prop] = 20
        if (prop === 'name') this.obj[prop] = 'Новая организация'
      }
      this.$emit('update')
      this.$store.commit('TOGGLE_EDIT_ORG', false)
      this.$store.commit('TOGGLE_EDIT_MODE_ORG', false)
    }
  },
  data () {
    return {
      success: false,
      obj: {
        id: null,
        name: 'Новая организация',
        inn: null,
        email: '',
        adress: '',
        site: '',
        phone: '',
        quota: 20
      },
      err: {
        name: null,
        inn: null,
        email: null,
        adress: null,
        site: null,
        phone: null,
        quota: null,
        uName: null,
        uEmail: null,
        uPassword: null
      },
      usr: {
        id: null,
        name: 'Новый пользователь',
        email: null,
        password: '',
        org: null,
        org_admin: true
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
input.number::-webkit-outer-spin-button,
input.number::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}
</style>