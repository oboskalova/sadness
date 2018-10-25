import axios from 'axios'
import { baseUrl } from './config'

export function getScheduleObjects (options = {}) {
  return axios.get(baseUrl + `/schedules`)
}

export function getScheduleObject (options) {
  return axios.get(baseUrl + `/schedules/`+ options)
}

export function editScheduleObject (params) {
  return axios.put(baseUrl + '/schedules/'+ params.id, params)
}

export function searchScheduleObjects (options = {}) {
  options.query = options.query || '' 
  return axios.get(baseUrl + `/schedules?q=${options.query}`)
}

export function searchSchedules (options = {}) {
  var data = {}
  data.tags = options.tags
  let formData = new FormData()
  formData.append('tags', data.tags)

  return axios.post(baseUrl + '/schedules/search', formData)
}

export function removeScheduleObject (id) {
  return axios.delete(baseUrl + '/schedules/' + id)
}

export function createScheduleObject (params) {
  let formData = new FormData()
  formData.append('name', params.name)
  formData.append('playlist', JSON.stringify(params.templates))
  formData.append('timeline', JSON.stringify(params.timeline))
  formData.append('displays', JSON.stringify(params.displays))
  return axios.post(baseUrl + '/schedules', formData)
}