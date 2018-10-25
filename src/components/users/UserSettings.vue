<template>
    <div>
    <div class="content row no-gutters">
      <main class="main col">
        <div class="schedule-editor container">
          <h5>Изменение параметров пользователя</h5>
          <p class="label">ФИО</p>
          <input
            class="input marginBottom"
            ref="name"
            type="text"
            :disabled="isChanging"
            @change="validator"
            v-model="obj.name">
          <span class="error" v-show="err.name">
            {{ err.name }}
          </span>
          <p class="label">Пароль</p>
          <input
            class="input marginBottom"
            ref="password"
            type="password"
            :disabled="isChanging"
            @change="validator"
            @focus="clearPass"
            v-model="obj.password">
          <span class="error" v-show="err.password">
            {{ err.password }}
          </span>
          <button :disabled="isChanging" class="btn btn-md btn-secondary float-right" type="button">Отмена</button>
          <button :disabled="isChanging" class="btn btn-md btn-primary float-right" type="button" @click="changeItem">Сохранить</button>
          <div v-if="success" class="alert alert-success" role="alert">
            Данные успешно изменены
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
import UserAPI from '../../../api/user'
import User from '../../../helpers/user'
import { editUserHimself } from '../../../api/managment'
export default {
  name: 'user-settings',
  data: () => ({
    isChanging: false,
    obj: {
      id: null,
      name: '',
      password: '000000'
    },
    err: {
      name: null,
      password: null
    },
    success: false
  }),
  computed: {
    user () {
      return this.$store.getters.passport
    }
  },
  mounted () {
    if (!this.user.id) {
      UserAPI.getPassport(response => {
        this.$store.commit('UPDATE_PASSPORT', response)
        this.obj.name = this.user.name
        this.obj.id = this.user.id
      })
    } else {
      this.obj.name = this.user.name
      this.obj.id = this.user.id
    }
  },
  methods: {
    validator () {
      for (let prop in this.err) {
        this.err[prop] = null
      }
    },
    clearPass () {
      if (this.obj.password === '000000') {
        this.obj.password = null
      }
    },
    validate () {
      var valid = true
      if (this.obj.name.length === 0) {
        valid = false
        this.err.name = 'ФИО не может быть пустым'
      }
      if (this.obj.password.length === 0) {
        valid = false
        this.err.password = 'Введите пароль'
      }
      if (valid) this.changeItem()
    },
    changeItem () {
      this.isChanging = true
      this.clearPass()
      return editUserHimself(this.obj).then(response => {
        const data = response.data
        if (!data) return
        this.success = true
        console.log(data)
        if (this.obj.password) {
          User.signOut()
          this.$router.go({
            path: 'auth',
            forse: true
          })
        } else {
          this.obj.password = '000000'
          this.$store.dispatch('fetchPassport')
        }
        this.isChanging = false
      }).catch(error => {
        console.log(error.response.data)
        if (error.response.data.name) {
          this.err.name = error.response.data.name[0]
        }
        this.isChanging = false
      })
    }
  }
}
</script>
<style scoped>
.label {
  margin-bottom: 0px;
}
.marginBottom {
  margin-bottom: 15px;
}
</style>