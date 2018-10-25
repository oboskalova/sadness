<template>
  <div>
    <h3>Войти</h3>
    <form class="auth-form" @submit.prevent="signIn">
      <input
        v-focus
        v-model="email"
        class="auth-input"
        type="text"
        name="email"
        placeholder="Email">
      <p
        v-if="errors.has('email')"
        class="auth-message">
        {{ errors.message('email') }}
      </p>
      <input
        v-model="password"
        class="auth-input"
        type="password"
        name="password"
        placeholder="Пароль">
      <p
        v-if="errors.has('password')"
        class="auth-message">
        {{ errors.message('password') }}
      </p>
      <button
        class="auth-submit btn btn-primary btn-block"
        :disabled="loading">
        Войти
      </button>
      <p
        v-if="errors.has('auth')"
        class="auth-message">
        {{ errors.message('auth') }}
      </p>
    </form>
    <div class="auth-footer">
      <!-- <router-link to="/auth/signup" class="auth-link">Зарегистрироваться</router-link> -->
      <!-- <router-link to="/auth/forget" class="auth-link">Забыли пароль</router-link> -->
    </div>
  </div>
</template>

<script>
import User from '../../../helpers/user'
import UserAPI from '../../../api/user'
import Validator from '../../../helpers/validator'
import ValidationError from '../../../helpers/validation-error'

export default {
  name: 'auth-enter',
  data () {
    return {
      email: '',
      password: '',
      loading: false,
      errors: new ValidationError()
    }
  },
  methods: {
    validate () {
      this.errors.clear()
      if (Validator.notEmail(this.email)) {
        this.errors.push('email', 'Введен некорректный адрес эл. почты')
      }
      if (Validator.empty(this.password)) {
        this.errors.push('password', 'Пароль не введен')
      }
    },
    signIn () {
      this.validate()
      if (this.errors.empty()) {
        this.loading = true
        UserAPI.signIn({
          email: this.email,
          password: this.password
        }, this.authorized, this.failed)
      }
    },
    authorized (data) {
      this.loading = false
      User.signIn(data)
      this.$router.go({ path: '/', forse: true })
    },
    failed (data) {
      console.log(data)
      this.loading = false
      if (data === 'Org locked') {
        this.errors.push('auth', 'Организация была заблокирована')
      }
      if (data === 'User not found') {
        this.errors.push('auth', 'Пользователь с введенным email не существует')
      }
      if (data !== 'User not found' && data !== 'Org locked') {
        this.errors.push('auth', 'Неверная пара эл. почта / пароль')
      }
    }
  },
  directives: {
    focus: {
      inserted (e) {
        e.focus()
      }
    }
  }
}
</script>