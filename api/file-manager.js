import axios from 'axios'
import { baseUrl, driveRoot } from './config'

export function searchDriveObjects (options = {}) {
  options.type = options.type || 0 
  options.query = options.query || '' 
  return axios.get(baseUrl + `/files?q=${options.query}&type=${options.type}`)
}

export function createDriveObject (params = {}) {
  let formData = new FormData()
  let config = { headers: { 'Content-Type': 'multipart/form-data' } }
  formData.append('parent_id', params.parentId || 1)
  formData.append('type', params.type || 0)
  formData.append('name', params.name || 'New folder')
  formData.append('tags', params.tags || '[]')
  formData.append('mega_tags', params.mega_tags || '[]')
  if (params.file) {
    formData.append('file', params.file)
    config.cancelToken = params.source.token
    config.onUploadProgress = params.onUploadProgress
  }
  return axios.post(baseUrl + '/files', formData, config)
}

export function removeDriveObjects (ids = []) {
  const reqBody = { files: ids }
  return axios.delete(baseUrl + '/files', { data: reqBody })
}
export function downloadObject (id) {
  return location.href = baseUrl + '/files/' + id + '/download'
}


export function moveDriveObjects (ids = [], destination) {
  return axios.put(baseUrl + '/files/move', {
    files: ids,
    target_id: destination
  })
}

export function updateDriveObject (id, obj = {}) {
  return axios.put(baseUrl + '/files/' + id, obj)
}

export function getDriveObject (id) {
  id = id || driveRoot
  return axios.get(baseUrl + '/files/' + id)
}

export function getDriveTree () {
  return axios.get(baseUrl + '/files/tree')
}

export function getAvailableSpace () {
  return axios.get(baseUrl + '/space')
}

export function searchFiles (options = {}) {
  var data = {}
  data.tags = options.tags
  data.folder = options.folder
  let formData = new FormData()
  formData.append('tags', data.tags)
  formData.append('folder', data.folder)

  return axios.post(baseUrl + '/files/search', formData)
}
