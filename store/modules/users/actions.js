import UserAPI from '../../../api/user'
import User from '../../../helpers/user'

export default {
  fetchPassport ({ commit }) {
    return UserAPI.getPassport(response => {
      commit('UPDATE_PASSPORT', response)
    })
  },
  fetchGuests ({ commit }) {
    return UserAPI.getInvitedUsers(response => {
      commit('UPDATE_GUESTS_LIST', response)
    })
  },
  fetchAssignments ({ commit }) {
    return UserAPI.getAssignments(response => {
      commit('UPDATE_ASSIGNMENTS_LIST', response)
    })
  },
  fetchUserGroup ({ commit }) {
    return UserAPI.getUserGroup(response => {
      commit('UPDATE_USER_GROUP', response)
    })
  },
  logout () {
    User.signOut()
    location.href = '/'
  }
}
