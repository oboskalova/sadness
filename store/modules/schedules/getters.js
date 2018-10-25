import { stat } from "fs";

export default {
  schedules (state) {
    return state.schedules
  },
  sortingDirectionsSchedules (state) {
    return state.sortingDirectionsSchedules
  },
  targetScheduleId (state) {
    return state.targetScheduleId
  },
  searchingSchedules (state) {
    return state.searchingSchedules
  },
  searchScheduleQuery (state) {
    return state.searchScheduleQuery
  },
  searchScheduleResults (state) {
    return state.searchScheduleResults
  },
  searchTemplatesQuery (state) {
    return state.searchTemplatesQuery
  },
  currentSchedule (state) {
    return state.currentSchedule
  },
  currentTemplateId (state) {
    return state.currentTemplateId
  },
  scheduleLoading (state) {
    return state.scheduleLoading
  }
}