import { getComporator } from '../../../helpers'
import { defaultTimeline } from '../../../helpers/defaults'
import { cloneDeep } from 'lodash'

export default {
  ADD_PLAYLIST_ITEM (state, obj = {}) {
    state.currentSchedule.playlist.push(obj)
  },
  UPLOAD_SCHEDULES (state, value) {
    state.schedules = value
  },
  TOGGLE_SCHEDULE_OBJECT (state, id) {
    state.targetScheduleId = id 
  },
  REMOVE_SCHEDULE_SELECTION (state) {
    state.targetScheduleId = 0
  },
  SORT_SCHEDULES (state, options) {
    const compare = getComporator(options.key, options.direction)
    state.schedules.sort((a, b) => compare(a, b))
  },
  SORT_SCHEDULE_CATALOGUE_INITIAL (state) {
    for (let key in state.sortingDirectionsSchedules) {
      if (state.sortingDirectionsSchedules.hasOwnProperty(key)) {
        const direction = state.sortingDirectionsSchedules[key]
        if (direction === 0) continue
        let compare = getComporator(key, direction)
        state.schedules.sort((b, a) => compare(a, b))
      }
    }
  },
  UPDATE_SORTING_DIRECTION_SCHEDULES (state, options) {
    for (let key in state.sortingDirectionsSchedules) {
      state.sortingDirectionsSchedules[key] = options.hasOwnProperty(key) ? options[key] : 0
    }
  },
  UPDATE_SCHEDULE_SEARCH_RESULTS (state, data) {
    state.searchScheduleResults = data
  },
  UPDATE_TEMPLATES_SEARCH_QUERY (state, query = '') {
    state.searchTemplatesQuery = query.trim()
  },
  UPDATE_SCHEDULE_SEARCH_QUERY (state, query = '') {
    state.searchScheduleQuery = query.trim()
  },
  CHANGE_SCHEDULE_SEARCHING_MODE (state, options) {
    state.searchingSchedules = options.mode
  },
  PUSH_SCHEDULE (state, obj) {
    state.schedules.push(obj)
  },
  SELECT_TEMPLATE_ITEM (state, id) {
    state.currentTemplateId = id
  },
  REMOVE_PLAYLIST_ITEM (state, id) {
    const i = state.currentSchedule.playlist.findIndex(e => e.id === id)
    if (i !== -1) state.currentSchedule.playlist.splice(i, 1)
  },
  REMOVE_SELECTED_PLAYER (state, id) {
    const i = state.currentSchedule.displays.findIndex(e => e.id === id)
    if (i !== -1) state.currentSchedule.displays.splice(i, 1)
  },
  CHANGE_PLAYLIST_ORDER (state, templates = []) {
    let orders = templates.map(e => e.order).sort()
    templates.forEach((w, i) => {
      let template = state.currentSchedule.playlist.find(e => e.id === w.id)
      if (template) template.order = orders[i]
    })
  },
  UPDATE_DISPLAYS_SELECTION (state, data) {
    state.currentSchedule.displays = data
  },
  LOAD_SCHEDULE (state, data) {
    state.currentSchedule = data
  },
  CLEAR_SCHEDULE (state) {
    state.currentSchedule = {
      displays: [],
      playlist: [],
      timeline: cloneDeep(defaultTimeline)
    }
  },
  RENAME_SCHEDULE_ITEM (state, data = {}) {
    const i = state.schedules.findIndex(e => e.id === data.id)
    if (i !== -1) state.schedules[i].name = data.name
  },
  UPDATE_SCHEDULE_PLAYLIST_ITEM (state, data = {}) {
    let selection = data.obj.order
    let item = state.currentSchedule.playlist.find(e => e.order === selection)
    item.timeline = data.timeline
  },
  UPDATE_SCHEDULE_TIMELINE_ITEM (state, data = {}){
    state.currentSchedule.timeline = data
  },
  TOOGLE_SCHEDULE_LOADING (state, value) {
    state.scheduleLoading = value
  }
}