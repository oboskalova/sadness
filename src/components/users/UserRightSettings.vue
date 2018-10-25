<template>
  <div class="container">
    <div class="checkbox-wrap" v-if="isAdmin">
      <b-form-checkbox
        :value="user.super_user"
        @change="toggleAdminRights">
        Является администратором
      </b-form-checkbox>
    </div>
    <AssignmentsList
      class="assignments"
      :list="assignments" />
  </div>
</template>

<script>
import UserAPI from '../../../api/user'
import AssignmentsList from './AssignmentsList'

export default {
  name: 'user-right-settings',
  components: { AssignmentsList },
  computed: {
    isAdmin () {
      return this.$store.getters.passport.super_user
    },
    activeUserId () {
      return +this.$route.params.id || 0
    },
    user () {
      return this.$store.getters.guests
        .find(e => this.activeUserId === e.id)
    },
    assignments () {
      return this.$store.getters.assignments
        .filter(e => this.activeUserId === e.user_id)
    }
  },
  created () {
    this.$store.dispatch('fetchAssignments')
  },
  methods: {
    toggleAdminRights (value) {
      const options = {
        id: this.activeUserId,
        super_user: !!value
      }
      UserAPI.update(options, () => {
        this.$store.commit('TOGGLE_ADMIN_RIGHTS', options)
      })
    }
  }
}
</script>

<style scoped> 
.checkbox-wrap {
  margin-top: 1rem;
}
.assignments {
  margin-top: 1rem;
}
</style>
