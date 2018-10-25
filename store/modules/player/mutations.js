export default {
  PLAYER_ZOOM (state, options = {}) {
    state.zoom = options.newZoom
  },
  INCREASE_LOADING_ELEMENTS_NUMBER (state) {
  	++state.loadingElements
  },
  DECREASE_LOADING_ELEMENTS_NUMBER (state) {
    --state.loadingElements
  },
  HIDE_MENU (state) {
    state.menuStatus = false
  },
  SHOW_MENU (state) {
    state.menuStatus = true
  },
  UPDATE_PLAYER_PROPS (state, obj = {}) {
    state.props = obj
  },
  SET_ATTACH_PANEL (state, flag) {
    state.attached = flag
  }
}
