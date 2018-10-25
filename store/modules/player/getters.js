export default {
  zoomValue (state) {
    return state.zoom
  },
  loaded (state) {
    return state.loadingElements === 0
  },
  menuStatus (state) {
    return state.menuStatus
  },
  props (state) {
    return state.props
  },
  attached (state) {
    return state.attached
  }
}
