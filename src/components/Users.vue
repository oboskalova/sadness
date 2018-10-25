<template>
  <div class="content row no-gutters">
    <TheSidebar class="col">
      <UsersList
        class="sidebar-list"
        :users="guests" />
    </TheSidebar>
    <main class="main col">
      <UserRightSettings />
    </main>
    <ModalCreateAssignment />
    <ModalInviteUser />
  </div>
</template>

<script>
import UserAPI from '../../api/user'
import TheSidebar from './common/TheSidebar'
import UsersList from './users/UsersList'
import UserRightSettings from './users/UserRightSettings'
import ModalCreateAssignment from './modals/ModalCreateAssignment'
import ModalInviteUser from './modals/ModalInviteUser'

export default {
  name: 'users',
  components: {
    TheSidebar,
    UsersList,
    UserRightSettings,
    ModalCreateAssignment,
    ModalInviteUser
  },
  computed: {
    guests () {
      return this.$store.getters.guests
    }
  },
  created () {
    this.$store.dispatch('fetchGuests')
    UserAPI.getPassport(passport => {
      this.$store.commit('UPDATE_PASSPORT', passport)
    })
  }
}
</script>

<style scoped>
.sidebar-list {
  margin-top: 1em !important; 
}
</style>
