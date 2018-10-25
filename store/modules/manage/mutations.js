import { getComporator } from '../../../helpers'

export default {
  TOGGLE_ORG_OBJECT (state, options) {
    state.targetOrg = options
  },
  SORT_ORGS (state, options) {
    const compare = getComporator(options.key, options.direction)
    state.orgs.sort((a, b) => compare(a, b))
  },
  SORT_ORGS_INITIAL (state) {
    for (let key in state.sortingDirectionsOrgs) {
      if (state.sortingDirectionsOrgs.hasOwnProperty(key)) {
        const direction = state.sortingDirectionsOrgs[key]
        if (direction === 0) continue
        let compare = getComporator(key, direction)
        state.orgs.sort((a, b) => compare(b, a))
      }
    }
  },
  UPDATE_SORTING_DIRECTION_ORGS (state, options) {
    for (let key in state.sortingDirectionsOrgs) {
      state.sortingDirectionsOrgs[key] = options.hasOwnProperty(key) ? options[key] : 0
    }
  },
  GET_ORGS (state, options = []) {
    state.orgs = options
  },
  TOGGLE_ORG_BASKET(state, data) {
    state.orgBasket = !!data
  },
  CHANGE_ACTIVE_TAB (state, opt) {
    state.activeAdminTab = opt
  },
  TOGGLE_GROUPS_OBJECT (state, options) {
    state.targetGroup = options
  },
  SORT_GROUPS (state, options) {
    const compare = getComporator(options.key, options.direction)
    state.groups.sort((a, b) => compare(a, b))
  },
  SORT_GROUPS_INITIAL (state) {
    for (let key in state.sortingDirectionsGroups) {
      if (state.sortingDirectionsGroups.hasOwnProperty(key)) {
        const direction = state.sortingDirectionsGroups[key]
        if (direction === 0) continue
        let compare = getComporator(key, direction)
        state.groups.sort((a, b) => compare(b, a))
      }
    }
  },
  UPDATE_SORTING_DIRECTION_GROUPS (state, options) {
    for (let key in state.sortingDirectionsGroups) {
      state.sortingDirectionsGroups[key] = options.hasOwnProperty(key) ? options[key] : 0
    }
  },
  GET_GROUPS (state, options = []) {
    state.groups = options
  },
  TOGGLE_USER_OBJECT (state, options) {
    state.targetUser = options
  },
  SORT_USERS (state, options) {
    const compare = getComporator(options.key, options.direction)
    state.users.sort((a, b) => compare(a, b))
  },
  SORT_USERS_INITIAL (state) {
    for (let key in state.sortingDirectionsUsers) {
      if (state.sortingDirectionsUsers.hasOwnProperty(key)) {
        const direction = state.sortingDirectionsUsers[key]
        if (direction === 0) continue
        let compare = getComporator(key, direction)
        state.users.sort((a, b) => compare(b, a))
      }
    }
  },
  UPDATE_SORTING_DIRECTION_USERS (state, options) {
    for (let key in state.sortingDirectionsUsers) {
      state.sortingDirectionsUsers[key] = options.hasOwnProperty(key) ? options[key] : 0
    }
  },
  GET_USERS (state, options = []) {
    state.users = options
  }
}
