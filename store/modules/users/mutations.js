import { clone } from 'lodash'
import { defaultAssignment } from '../../../helpers/defaults'

export default {
  UPDATE_PASSPORT (state, data) {
    state.passport = data
  },
  UPDATE_GUESTS_LIST (state, data) {
    state.guests = data
  },
  UPDATE_ASSIGNMENTS_LIST (state, data) {
    state.assignments = data
  },
  RESET_ASSIGNMENT (state, data = defaultAssignment) {
    state.activeAssignment = data
  },
  REMOVE_ASSIGNMENT (state, options = {}) {
    const id = options.id
    state.assignments = state.assignments.filter(e => e.id !== id)
  },
  TOGGLE_ADMIN_RIGHTS (state, options = {}) {
    const { id, super_user } = options
    const user = state.guests.find(e => id === e.id)
    if (user) user.super_user = !!super_user
  },
  UPDATE_USER_GROUP (state, options = []) {
    state.userGroup = options
  }
}
