<template>
  <div>
    <h3>Зарегистрироваться</h3>
    <form @submit.prevent="register">
      <input
        v-focus
        v-model="name"
        class="auth-input"
        type="text"
        name="name"
        placeholder="Имя">
      <p
        v-if="errors.has('name')"
        class="auth-message">
        {{ errors.message('name') }}
      </p>
      <input
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
      <input
        v-model="confirm"
        class="auth-input"
        type="password"
        name="confirm"
        placeholder="Подтвердите пароль">
      <p
        v-if="errors.has('confirm')"
        class="auth-message">
        {{ errors.message('confirm') }}
      </p>
      <button class="auth-submit btn btn-primary btn-block">
        Зарегистрироваться
      </button>
      <p
        v-if="success"
        class="auth-message">
        Вы успешно зарегистрировались!
      </p>
    </form>
  </div>
</template>

<script>
import UserAPI from '../../../api/user'
import Validator from '../../../helpers/validator'
import ValidationError from '../../../helpers/validation-error'

export default {
  name: 'auth-signup',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      confirm: '',
      loading: false,
      success: false,
      errors: new ValidationError()
    }
  },
  created () {
    const email = this.$route.params.email
    if (email) this.email = email
  },
  methods: {
    validate () {
      this.errors.clear()
      if (Validator.empty(this.name)) {
        this.errors.push('name', 'Укажите ваше имя')
      }
      if (Validator.notEmail(this.email)) {
        this.errors.push('email', 'Введен некорректный адрес эл. почты')
      }
      if (Validator.empty(this.password)) {
        this.errors.push('password', 'Пароль не введен')
      }
      if (Validator.notEqual(this.password, this.confirm)) {
        this.errors.push('confirm', 'Введенные пароли не совпадают')
      }
    },
    register () {
      this.validate()
      if (this.errors.empty()) {
        this.loading = true
        UserAPI.signUp({
          name: this.name,
          email: this.email,
          password: this.password
        }, this.registered, this.failed)
      }
    },
    registered (data) {
      this.loading = false
      this.success = true
      setTimeout(() => {
        this.$router.push({ path: '/auth' })
      }, 3000)
    },
    failed (error) {
      this.loading = false
      this.success = false
      this.errors.clear()
      for (let e in error.data) {
        if (error.data.hasOwnProperty(e)) {
          this.errors.push(e, error.data[e][0])
        }
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
