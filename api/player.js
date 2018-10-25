import axios from 'axios'
import * as config from './config'
import { media } from '../mock/media'
import { baseUrl, driveRoot } from './config'

export function getTemplate (id) {
  return axios.get(config.baseUrl + '/templates/' + id)
}

export function getContainersOf (id) {
  return axios.get(config.baseUrl + '/containers?id=' + id)
}

export function getWidgetsOf (id) {
  return new Promise((resolve, reject) => {
    resolve({ data: media[id] })
  })
}
export function getReps () {
  return axios.get(baseUrl + '/reps')
}
export function createRep (params = {}) {
  let formData = new FormData()
  let config = { headers: { 'Content-Type': 'multipart/form-data' } }
  formData.append('name', params.name)
  if (params.attachment) {
    formData.append('file', params.attachment)
  }
  return axios.post(baseUrl + '/reps', formData, config)
}
export function deleteReps (id) {
  return axios.delete(baseUrl + '/reps/' + id)
}
