import axios from 'axios'
import { merge } from 'lodash'
import { baseUrl } from './config'

export function createTemplateObject (params = {}) {
  let formData = new FormData()
  formData.append('name', params.name)
  formData.append('width', params.width)
  formData.append('height', params.height)
  formData.append('background_color', params.background)
  return axios.post(baseUrl + '/templates', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export function publishTemplateObject (params = {}) {
  return axios.put(baseUrl + '/templates/publish/' + params.id, {
    status: params.status
  })
}
export function updateTemplateObject (params = {}) {
  return axios.put(baseUrl + '/templates/' + params.id, {
    name: params.name,
    width: params.width,
    height: params.height,
    status: params.status,
    background_color: params.background
  })
}
export function searhWithTags (options = {}) {
  var data = {}
  data.tags = options.tags
  let formData = new FormData()
  formData.append('tags', data.tags)

  return axios.post(baseUrl + '/templates/search', formData)
}
export function leaveTemplate (id) {
  return axios.delete(baseUrl + '/templates/leave/' + id)
}
export function prolongTemplate (id) {
  return axios.get(baseUrl + '/templates/prolong/' + id)
}
export function removeTemplateObjects (ids = []) {
  const reqBody = { templates: ids }
  return axios.delete(baseUrl + '/templates', { data: reqBody })
}
export function deleteContainer (id) {
  const reqBody = { containers: [id] }
  return axios.delete(baseUrl + '/containers', { data: reqBody })
}
export function getTemplateObject (id) {
  return axios.get(baseUrl + '/templates/' + id)
}
export function getTemplateObjects () {
  return axios.get(baseUrl + '/templates')
}
export function getContainerTree (ids) {
  return axios.get(baseUrl + '/containers', { params: {id: ids}})
}
export function createContainerObject (params = {}) {
  let formData = new FormData()
  formData.append('name', params.name)
  formData.append('width', params.width)
  formData.append('height', params.height)
  formData.append('parent_id', params.parentId)
  formData.append('template_id', params.templateId)
  formData.append('order', params.order)
  formData.append('x', 0)
  formData.append('y', 0)
  formData.append('z', 0)
  formData.append('show', true)
  formData.append('playlist', 0)
  return axios.post(baseUrl + '/containers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function saveContainerChanges (params) {
  return axios.put(baseUrl + '/containers', {
    data: params
  })
}

export function createWidget (widget = {}) {
  return axios.post(baseUrl + '/widgets', widget)
}

export function getWidgets (options = {}) {
  const templateId = options.templateId
  return axios.get(baseUrl + '/widgets?id=' + templateId)
}

export function removeWidgets (widgetIds = []) {
  const reqBody = { widgets: widgetIds }
  return axios.delete(baseUrl + '/widgets', { data: reqBody })
}

export function updateWidget (options) {
  const request = { data: options }
  return axios.put(baseUrl + '/widgets', request)
}

export function changeOrders (widgets = []) {
  const data = widgets.map(e => {
    return {
      id: e.id,
      order: e.order
    }
  })
  return axios.put(baseUrl + '/widgets', { data })
}

export function getHeadersByUrl (url) {
  return axios.get(baseUrl + '/templates/checkUrl?url=' + url)
}
