<template>
  <b-modal centered
    v-model="active"
    title="Пригласить нового пользователя"
    ok-title="Пригласить"
    cancel-title="Отмена"
    :ok-disabled="inviting"
    @ok="invite"
    @shown="openModal"
    @hide="closeModal">
    <div class="container">
      <p>Выберите email, чтобы пригласить нового пользователя</p>
      <b-form-input
        v-model="email"
        placeholder="example@example.com" />
    </div>
  </b-modal>
</template>

<script>
import UserAPI from '../../../api/user'

export default {
  name: 'modal-invite-user',
  computed: {
    active: {
      get () {
        return this.$store.getters.inviteUser
      },
      set (value) {
        this.$store.commit('TOGGLE_INVITE_USER', value)
      }
    }
  },
  methods: {
    invite () {
      this.inviting = true
      UserAPI.invite({ email: this.email }, response => {
        this.$store.dispatch('fetchGuests')
        this.clear()
      }).then(() => {
        this.inviting = false
        this.fetchUsersList()
      })
    },
    clear () {
      this.email = ''
    },
    openModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', true)
      this.clear()
    },
    closeModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', false)
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
    }
  },
  data () {
    return {
      email: '',
      inviting: false
    }
  }
}
</script>
