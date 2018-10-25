export default {
  SELECT_STAT_FILE (state, options = {}) {
    state.selectedStatFile = options
  },
  UPDATE_STAT_SELECTED_PLAYERS (state, options) {
    state.selectedStatDisplays = options
  },
  UPDATE_STAT_SELECTED_SCHEDULES (state, options) {
    state.selectedStatSchedules = options
  },
  UPDATE_STAT_SELECTED_TEMPLATES (state, options) {
    state.selectedStatTemplates = options
  },
  SELECT_TEMPLATE_DATA (state, data) {
    state.selectedTemplateData = data
  },
  SELECT_TEMPLATE (state, options = {}) {
    state.selectedTemplate = options
  },
  SET_RESIZE_SCENES_CALLBACK (state, resizeFunction) {
    state.resizeFunction = resizeFunction
  }
}
