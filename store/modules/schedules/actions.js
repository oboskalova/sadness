import * as api from '../../../api/schedule-manager'

export default {
  fetchSchedules ({ commit }) {
    commit('UPLOAD_SCHEDULES', [])
    return api.getScheduleObjects().then(response => {
      commit('UPLOAD_SCHEDULES', response.data)
    })
  },
  uploadSchedules ({ commit }, options = {}) {
    if (options.isSearching) {
      commit('UPDATE_SCHEDULE_SEARCH_RESULTS', options.data)
    } else {
      commit('UPLOAD_SCHEDULES', options)
      commit('SORT_SCHEDULE_CATALOGUE_INITIAL')
    }
  },
  stopSearching ({ commit }) {
    commit('UPDATE_SCHEDULE_SEARCH_QUERY', '')
    commit('CHANGE_SCHEDULE_SEARCHING_MODE', false)
  },
  sortSchedules ({ commit }, options = {}) {
    commit('SORT_SCHEDULES', options)
  },
  updateSortingDirectionSchedules ({ commit }, options = {}) {
    commit('UPDATE_SORTING_DIRECTION_SCHEDULES', options)
  },
}
