import axios from 'axios'
import { baseUrl } from './config'

function log (params) { console.log(params) }

const ContainerAPI = {
  fetchAllOf (params = {}, success, error) {
    const { templateId } = params
    if (typeof success !== 'function') success = log
    if (typeof error !== 'function') error = log
    return axios.get(baseUrl + '/containers?id=' + templateId)
      .then(e => success(e.data))
      .catch(e => error(e))
  },
  create (params = {}, success, error) {
    if (typeof success !== 'function') success = log
    if (typeof error !== 'function') error = log
    return axios.post(baseUrl + '/containers', params)
      .then(e => success(e.data))
      .catch(e => error(e))
  },
  delete (params = {}, success, error) {
    const { id } = params
    if (typeof success !== 'function') success = log
    if (typeof error !== 'function') error = log
    return axios.delete(baseUrl + '/containers', {
      data: {
        containers: [ id ]
      }
    })
      .then(e => success(e.data))
      .catch(e => error(e))
  },
  update (data = [], success, error) {
    if (typeof success !== 'function') success = log
    if (typeof error !== 'function') error = log
    return axios.put(baseUrl + '/containers', { data })
      .then(e => success(e.data))
      .catch(e => error(e))
  }
}

export default ContainerAPI