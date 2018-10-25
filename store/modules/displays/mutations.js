import { getComporator } from '../../../helpers'

export default {
  UPLOAD_DISPLAYS (state, value) {
    state.displays = value
  },
  TOGGLE_DISPLAY_OBJECT (state, obj = {}) {
    state.targetDisplayId = obj.id 
  },
  SORT_DISPLAYS (state, options) {
    const compare = getComporator(options.key, options.direction)
    state.displays.sort((a, b) => compare(a, b))
  },
  SORT_DISPLAY_CATALOGUE_INITIAL (state) {
    for (let key in state.sortingDirectionsDisplays) {
      if (state.sortingDirectionsDisplays.hasOwnProperty(key)) {
        const direction = state.sortingDirectionsDisplays[key]
        if (direction === 0) continue
        let compare = getComporator(key, direction)
        state.displays.sort((b, a) => compare(a, b))
      }
    }
  },
  UPDATE_SORTING_DIRECTION_DISPLAYS (state, options) {
    for (let key in state.sortingDirectionsDisplays) {
      state.sortingDirectionsDisplays[key] = options.hasOwnProperty(key) ? options[key] : 0
    }
  },
  UPDATE_DISPLAY_SEARCH_RESULTS (state, data) {
    state.searchDisplayResults = data
  },
  UPDATE_DISPLAY_SEARCH_QUERY (state, query = '') {
    state.searchDisplayQuery = query.trim()
  },
  CHANGE_DISPLAY_SEARCHING_MODE (state, options) {
    state.searchingDisplays = options.mode
  },
  PUSH_DISPLAY (state, obj) {
    state.displays.unshift(obj)
  },
  UPDATE_ONLINE (state, data = []) {
    let online = Object.create(null)
    data.forEach(el => {
      online[el.client_id] = true
    })
    state.displays.forEach(el => {
      if (el.active !== 'Не активирован') {
        if (online[el.id]) {
          el.active = 'Online'
        } else {
          el.active = 'Offline'
        }
      }
    })
  },
  UPDATE_SINGLE_ONLINE (state, obj) {
    if (obj) {
      state.currentDisplay.active = 'Online'
    } else {
      state.currentDisplay.active = 'Offline'
    }
  },
  REMOVE_DISPLAY (state, id) {
    console.log(id)
    const i = state.displays.findIndex(e => e.id === id)
    if (i !== -1) state.displays.splice(i, 1)
  },
  REMOVE_DISPLAY_SELECTION (state) {
    state.targetDisplayId = 0
  },
  RENAME_DISPLAY_ITEM (state, data = {}) {
    const i = state.displays.findIndex(e => e.id === data.id)
    if (i !== -1) {
      state.displays[i].name = data.name
      state.displays[i].tagsArray = data.tagsArray
    }
  },
  LOAD_DISPLAY (state, data = {}) {
    state.currentDisplay = data
    state.currentDisplay.log.sort(function(a, b) {
      return b.id - a.id
    })
  },
  CLEAR_DISPLAY (state) {
    state.currentDisplay = {
      name: null,
      pincode: null,
      status: null,
      schedule: null}
  },
  TOOGLE_PLAYER_LOADING (state, value) {
    state.playerLoading = value
  }
}