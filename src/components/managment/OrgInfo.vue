<template>
  <img
      v-if="isChanging"
      src="/static/img/spinner.gif"
      class="loader">
  <div v-else class="container orgInfo">
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
          class="input"
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
          class="input"
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
    <button :disabled="isChanging" class="btn btn-md btn-secondary float-right" type="button" @click="cancel">Отмена</button>
    <button :disabled="isChanging" class="btn btn-md btn-primary float-right" type="button" @click="validate">Сохранить</button>
    <div v-if="success" class="alert alert-success" role="alert">
      Данные успешно изменены
    </div>
  </div>
</template>
<script>
import { editOrgs, loadOrg } from '../../../api/managment'

export default {
  name: 'modal-rename',
  mounted () {
    this.loadItem()
  },
  methods: {
    validator () {
      for (let prop in this.err) {
        this.err[prop] = null
      }
      this.success = false
    },
    loadItem () {
      this.isChanging = true
      loadOrg().then(response => {
        const data = response.data
        if (!data) return
        console.log(data)
        for (let prop in this.obj) {
          if (data.hasOwnProperty(prop)) {
            this.obj[prop] = data[prop]
          } else {
            this.obj[prop] = null
          }
        }
        this.isChanging = false
      }).catch(error => {
        console.log(error)
        this.isChanging = false
      })
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
      if (valid) this.changeItem()
    },
    changeItem () {
      this.isChanging = true
      return editOrgs(this.obj).then(response => {
        const data = response.data
        if (!data) return
        console.log(data)
        this.isChanging = false
        this.success = true
      }).catch(error => {
        console.log(error)
        this.isChanging = false
      })
    },
    clearErr () {
      for (let prop in this.err) {
        this.err[prop] = null
      }
      this.success = false
    },
    cancel () {
      this.$emit('cancel')
    }
  },
  data () {
    return {
      success: false,
      obj: {
        id: null,
        name: '',
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
        quota: null
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
.orgInfo {
  padding-top: 5px;
}
</style>