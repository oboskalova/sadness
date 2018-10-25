import { getOrgs, getUsers } from '../../../api/managment'

export default {
  fetchOrgs ({ commit }) {
    commit('GET_ORGS', [])
    return getOrgs().then((resp) => {
      commit('GET_ORGS', resp.data)
      commit('SORT_ORGS_INITIAL')
    })
  },
  fetchUsers ({ commit }) {
    commit('GET_USERS', [])
    return getUsers().then((resp) => {
      commit('GET_USERS', resp.data)
      commit('SORT_USERS_INITIAL')
    })
  },
  sortOrgs ({ commit }, options = {}) {
    commit('SORT_ORGS', options)
  },
  updateSortingDirectionOrgs ({ commit }, options = {}) {
    commit('UPDATE_SORTING_DIRECTION_ORGS', options)
  },
  sortGroups ({ commit }, options = {}) {
    commit('SORT_GROUPS', options)
  },
  updateSortingDirectionGroups ({ commit }, options = {}) {
    commit('UPDATE_SORTING_DIRECTION_GROUPS', options)
  },
  sortUsers ({ commit }, options = {}) {
    commit('SORT_USERS', options)
  },
  updateSortingDirectionUsers ({ commit }, options = {}) {
    commit('UPDATE_SORTING_DIRECTION_USERS', options)
  },
}
