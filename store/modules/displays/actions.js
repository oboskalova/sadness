import * as api from '../../../api/display-manager'

export default {
  fetchDisplays ({ commit }) {
    commit('UPLOAD_DISPLAYS', [])
    return api.getDisplayObjects().then(response => {
      commit('UPLOAD_DISPLAYS', response.data)
    })
  },
  uploadDisplays ({ commit }, options = {}) {
    if (options.isSearching) {
      commit('UPDATE_DISPLAY_SEARCH_RESULTS', options.data)
    } else {
      commit('UPLOAD_DISPLAYS', options)
      commit('SORT_DISPLAY_CATALOGUE_INITIAL')
    }
  },
  stopSearching ({ commit }) {
    commit('UPDATE_SEARCH_QUERY', '')
    commit('CHANGE_SEARCHING_MODE', false)
  },
  sortDisplays ({ commit }, options = {}) {
    commit('SORT_DISPLAYS', options)
  },
  updateSortingDirectionDisplays ({ commit }, options = {}) {
    commit('UPDATE_SORTING_DIRECTION_DISPLAYS', options)
  },
}
