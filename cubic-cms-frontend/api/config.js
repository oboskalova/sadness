import axios from 'axios'

export const baseUrl = 'http://api-staging.devcubic.ru/api/v0.1'
// export const baseUrl = 'http://localhost/api/v0.1'
export const driveRoot = 0

export function setAuthToken(token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;  
}