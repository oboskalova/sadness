import { defaultTimeline } from '../../../helpers/defaults'
import { cloneDeep } from 'lodash'

export default {
  schedules:[],
  sortingDirectionsSchedules: {
    name: 0,
    typer: 0,
    active: 0,
    updated_at: 1
  },
  currentSchedule: {
    displays: [],
    playlist: [],
    timeline: cloneDeep(defaultTimeline)
  },
  targetScheduleId: 0,
  searchingSchedules: false,
  searchScheduleQuery: null,
  currentTemplateId: 0,
  searchTemplatesQuery: '',
  searchScheduleResults: [],
  scheduleLoading: false
}