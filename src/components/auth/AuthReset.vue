<template>
  <div>
    <h3>Введите новый пароль</h3>
    <form @submit.prevent="restore">
      <input
        v-model="password"
        class="auth-input"
        type="password"
        name="password"
        placeholder="Пароль">
      <p
        v-if="errors.has('empty')"
        class="auth-message">
        {{ errors.message('empty') }}
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
        Отправить
      </button>
      <p
        v-if="errors.has('password')"
        class="auth-message">
        {{ errors.message('password') }}
      </p>
      <p
        v-if="success"
        class="auth-message">
        Пароль успешно восстановлен
      </p>
    </form>
  </div>
</template>

<script>
import UserAPI from '../../../api/user'
import Validator from '../../../helpers/validator'
import ValidationError from '../../../helpers/validation-error'

export default {
  name: 'auth-forget',
  computed: {
    token () {
      return this.$route.params.token
    }
  },
  data () {
    return {
      password: '',
      confirm: '',
      loading: false,
      success: false,
      errors: new ValidationError()
    }
  },
  methods: {
    validate () {
      this.errors.clear()
      if (Validator.empty(this.password)) {
        this.errors.push('empty', 'Пароль не введен')
      }
      if (Validator.notEqual(this.password, this.confirm)) {
        this.errors.push('confirm', 'Введенные пароли не совпадают')
      }
    },
    restore () {
      this.validate()
      if (this.errors.empty()) {
        const token = this.token
        const password = this.password
        this.loading = true
        UserAPI.resetPassword(
          { token, password },
          this.restored,
          this.failed
        )
      }
    },
    restored (data) {
      this.loading = false
      this.success = true
      this.password = ''
      this.confirm = ''
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
