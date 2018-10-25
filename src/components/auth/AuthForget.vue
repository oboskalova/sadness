<template>
  <div>
    <h3>Восстановить пароль</h3>
    <form @submit.prevent="restore">
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
      <button class="auth-submit btn btn-primary btn-block">
        Восстановить
      </button>
      <p
        v-if="success"
        class="auth-message">
        Инструкции по восстановлению пароля направлены на '{{ email }}'
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
  data () {
    return {
      email: '',
      loading: false,
      success: false,
      errors: new ValidationError()
    }
  },
  methods: {
    validate () {
      this.errors.clear()
      if (Validator.notEmail(this.email)) {
        this.errors.push('email', 'Введен некорректный адрес эл. почты')
      }
    },
    restore () {
      this.validate()
      if (this.errors.empty()) {
        this.loading = true
        UserAPI.forget(
          { email: this.email },
          this.restored,
          this.failed
        )
      }
    },
    restored (data) {
      this.loading = false
      this.success = true
      setTimeout(() => {
        this.$router.push({ path: '/auth' })
      }, 3000)
    },
    failed (error) {
      this.loading = false
      this.success = false
      for (let e in error.data) {
        if (error.data.hasOwnProperty(e)) {
          this.errors.push(e, error.data[e][0])
        }
      }
      setTimeout(() => {
        this.$router.push({ path: '/auth/signup' })
      }, 3000)
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
