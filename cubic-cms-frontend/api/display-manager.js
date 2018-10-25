import axios from 'axios'
import { baseUrl } from './config'

export function getDisplayObjects (options = {}) {
  return axios.get(baseUrl + `/players`)
}

export function getDisplayObject (id) {
  return axios.get(baseUrl + `/players/` + id)
}

export function searchDisplayObjects (options = {}) {
  options.query = options.query || '' 
  return axios.get(baseUrl + `/players?q=${options.query}`)
}

export function searchDisplays (options = {}) {
  var data = {}
  data.tags = options.tags
  let formData = new FormData()
  formData.append('tags', data.tags)

  return axios.post(baseUrl + '/players/search', formData)
}

export function logoutDisplay (token) {
  let formData = new FormData()
  formData.append('token', token)
  return axios.post(baseUrl + '/players/logout', formData)
}

export function createDisplayObject (params) {
  let formData = new FormData()
  formData.append('name', params.name)
  formData.append('tags', params.tags)
  formData.append('megaTags', params.megaTags)
  formData.append('adress', '{}')
  if (params.newAdr) {
    formData.append('newAdr', params.newAdr)
  } else {
    formData.append('adr', params.adr)
  }

  return axios.post(baseUrl + '/players', formData)
}

export function editDisplayObject (params) {
  return axios.put(baseUrl + '/players', params)
}

export function removeDisplayObject (id) {
  return axios.delete(baseUrl + '/players/' + id)
}

export function sendMessage (email, params) {
  let formData = new FormData()
  formData.append('display_id', params)
  formData.append('email', email)
  return axios.post(baseUrl + '/players/sendMessage', formData)
}