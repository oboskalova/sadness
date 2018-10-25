import axios from 'axios'
import { baseUrl } from './config'

export function getShows (params = {}) {
  let formData = new FormData()
  formData.append('file', params.file || 0)
  formData.append('templates', JSON.stringify(params.templates) || 0)
  formData.append('players', JSON.stringify(params.players) || 0)
  formData.append('container', params.container || 0)
  formData.append('schedules', JSON.stringify(params.schedules) || 0)
  formData.append('scene', params.scene || 0)
  formData.append('start', params.start)
  formData.append('end', params.end)
  console.log(params)
  return axios.post(baseUrl + `/statistics/shows`, formData)
}

export function getFilters (options) {
  return axios.get(baseUrl + `/statistics/filters/` + options)
}

export function getTaps (params = {}) {
  let formData = new FormData()
  formData.append('template', params.template || 0)
  formData.append('players', JSON.stringify(params.players) || 0)
  formData.append('schedules', JSON.stringify(params.schedules) || 0)
  formData.append('start', params.start)
  formData.append('end', params.end)
  console.log(params)
  return axios.post(baseUrl + `/heatmaps/taps`, formData)
}

export function getHeatFilters (options) {
  return axios.get(baseUrl + `/heatmaps/filters/` + options)
}

export function getPublishedTemplateInfo (id) {
  return axios.get(`${baseUrl}/templates/${id}/published`)
}