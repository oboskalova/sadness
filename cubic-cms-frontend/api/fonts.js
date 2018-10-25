import axios from 'axios'
import { baseUrl } from './config'

export const getFonts = () => {
  return axios.get(baseUrl + '/fonts')
    .then(r => r.data)
    .catch(console.error)
}

export const sendFont = ({ file, name, family }) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('name', name)
  formData.append('family', family)

  const config = { headers: { 'Content-Type': 'multipart/form-data' } }

  return axios.post(baseUrl + '/fonts', formData, config)
    .then(r => r.data)
    .catch(console.error)
}

export const saveFont = ({ name, file, family, id }) => {
  const formData = new FormData()
  formData.append('id', id)
  formData.append('file', file)
  formData.append('name', name)
  formData.append('family', family)

  const config = { headers: { 'Content-Type': 'multipart/form-data' } }

  return axios.post(baseUrl + '/fonts', formData, config)
    .then(r => r.data)
    .catch(console.error)
}

export const deleteFont = (id) => {
  return axios.delete(baseUrl + '/fonts', {
    data: { id }
  }).then(r => r.data)
    .catch(console.error)
}
