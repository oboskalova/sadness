import axios from 'axios'
import { baseUrl } from './config'

export function editOrgs (params = {}) {
  return axios.post(baseUrl + `/manage/orgs`, params)
}

export function editOrgsAdmin (params = {}) {
  return axios.post(baseUrl + `/manage/admin`, params)
}

export function getOrgs () {
  return axios.get(baseUrl + `/manage/orgs`)
}

export function loadOrg () {
  return axios.get(baseUrl + `/manage/loadOrg`)
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
  return axios.get(baseUrl + `/heatmaps/filters/`+ options)
}

export function getGroups () {
  return axios.get(baseUrl + `/manage/groups`)
}

export function editGroups (params = {}) {
  return axios.post(baseUrl + `/manage/groups`, params)
}

export function deleteGroup (params) {
  return axios.delete(baseUrl + `/manage/groups/` + params)
}

export function getUsers () {
  return axios.get(baseUrl + `/manage/users`)
}

export function editUser (params = {}) {
  return axios.post(baseUrl + `/manage/users`, params)
}

export function editUserHimself (params = {}) {
  return axios.post(baseUrl + `/manage/user`, params)
}

export function deleteUser (params) {
  return axios.delete(baseUrl + `/manage/users/` + params)
}

export function getUserRules (params) {
  return axios.get(baseUrl + `/users/` + params + `/assigned`)
}

export function saveCustomRules (params) {
  return axios.post(baseUrl + `/manage/userRules`, params)
}