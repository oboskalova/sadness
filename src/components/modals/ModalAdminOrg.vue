<template>
  <b-modal centered
    v-model="active"
    @hide="closeModal"
    @show="openModal"
    size="lg"
    title="Администратор организации" 
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
            @focus="clearPass"
            @change="validator"
            v-model="obj.password">
          <span class="error" v-show="err.password">
            {{ err.password }}
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
import { editOrgsAdmin } from '../../../api/managment'

export default {
  name: 'modal-edit-admin',
  computed: {
    active: {
      get () {
        // var path = this.$route.path
        return this.$store.getters.editAdmin
      },
      set (value) {
        this.$store.commit('TOGGLE_ADMIN_ORG', value)
      }
    },
    targetOrg () {
      return this.$store.getters.targetOrg
    }
  },
  methods: {
    validator () {
      for (let prop in this.err) {
        this.err[prop] = null
      }
    },
    openModal () {
      if (this.targetOrg.admin) this.loadItem()
    },
    clearPass () {
      if (this.obj.password === '000000') {
        this.obj.password = null
      }
    },
    loadItem () {
      console.log('adm', this.targetOrg.admin)
      for (let prop in this.obj) {
        if (this.targetOrg.admin.hasOwnProperty(prop)) {
          this.obj[prop] = this.targetOrg.admin[prop]
        } else {
          this.obj[prop] = null
          if (prop === 'password') this.obj.password = '000000'
        }
      }
      this.oldEmail = this.obj.email
      console.log('adm_obj', this.obj)
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
      this.obj.org = this.targetOrg.id
      this.clearPass()
      return editOrgsAdmin(this.obj).then(response => {
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
      this.$store.commit('TOGGLE_ADMIN_ORG', false)
    },
    closeModal () {
      for (let prop in this.obj) {
        this.obj[prop] = null
        if (prop === 'name') this.obj[prop] = 'Новый пользователь'
        if (prop === 'org_admin') this.obj[prop] = true
      }
      this.$emit('update')
      this.$store.commit('TOGGLE_ADMIN_ORG', false)
    }
  },
  data () {
    return {
      obj: {
        id: null,
        name: 'Новый пользователь',
        email: '',
        password: '',
        org: null,
        org_admin: true
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