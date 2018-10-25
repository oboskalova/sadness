import axios from 'axios'
import { baseUrl, setAuthToken } from './config'

function log (params) { console.log(params) }

const UserAPI = {
  signIn (params = {}, success, error) {
    if (typeof success !== 'function') {
      success = function () { console.log('successfully authorized') }
    }
    if (typeof error !== 'function') {
      error = function () { console.log('authorization failed') }
    }
    return axios.post(baseUrl + '/login', params)
      .then(response => {
        const token = response.data
        if (token === 'User not found' || token === 'Org locked') {
          error(token)
        } else {
          setAuthToken(token)
          success(token)
        }
      })
      .catch(error)
  },
  signUp (params = {}, success, error) {
    if (typeof success !== 'function') {
      success = function () { console.log('successfully registered') }
    }
    if (typeof error !== 'function') {
      error = function () { console.log('registration failed') }
    }
    return axios.post(baseUrl + '/register', params)
      .then(response => { success(response.data) })
      .catch(response => { error(response.response) })
  },
  forget (params = {}, success, error) {
    if (typeof success !== 'function') {
      success = function () { console.log('check your email') }
    }
    if (typeof error !== 'function') {
      error = function () { console.log('restoring failed') }
    }
    return axios.post(baseUrl + '/forget', params)
      .then(response => { success(response.data) })
      .catch(response => { error(response.response) })
  },
  resetPassword (params = {}, success, error) {
    if (typeof success !== 'function') {
      success = function () { console.log('password was changed') }
    }
    if (typeof error !== 'function') {
      error = function () { console.log('password wasn\'t changed') }
    }
    return axios.post(baseUrl + '/new-password', params)
      .then(response => { success(response.data) })
      .catch(response => { error(response.response) })
  },
  invite (params = {}, success, error) {
    if (typeof success !== 'function') {
      success = function () { console.log(`user ${params.email} was invited`) }
    }
    if (typeof error !== 'function') {
      error = function () { console.log(`user ${params.email} was not invited`) }
    }
    return axios.post(baseUrl + '/invite', params)
      .then(response => { success(response.data) })
      .catch(response => { error(response.response) })
  },
  assign (params = {}, success, error) {
    if (typeof success !== 'function') {
      success = function () { console.log(`user #${params.user_id} was assigned`) }
    }
    if (typeof error !== 'function') {
      error = function () { console.log(`user #${params.user_id} was not assigned`) }
    }    
    return axios.post(baseUrl + '/users/assign', params)
      .then(response => { success(response.data) })
      .catch(response => { error(response.response) })
  },
  unassign (params = {}, success, error) {
    if (typeof success !== 'function') {
      success = function () { console.log(`assignment #${params.id} was deleted`) }
    }
    if (typeof error !== 'function') {
      error = function () { console.log(`assignment #${params.id} was not deleted`) }
    }    
    return axios.post(baseUrl + '/users/unassign', params)
      .then(response => { success(response.data) })
      .catch(response => { error(response.response) })
  },
  getPassport (success, error) {
    if (typeof success !== 'function') success = log
    if (typeof error !== 'function') error = log
    return axios.get(baseUrl + '/user')
      .then(response => { success(response.data) })
      .catch(response => { error(response.response) })
  },
  getInvitedUsers (success, error) {
    if (typeof success !== 'function') success = log
    if (typeof error !== 'function') error = log
    return axios.get(baseUrl + '/invited')
      .then(response => { success(response.data) })
      .catch(response => { error(response.response) })
  },
  getAssignments (success, error) {
    if (typeof success !== 'function') success = log
    if (typeof error !== 'function') error = log
    return axios.get(baseUrl + '/assigned')
      .then(response => { success(response.data) })
      .catch(response => { error(response.response) })
  },
  update (params = {}, success, error) {
    const id = params.id
    if (typeof success !== 'function') success = log
    if (typeof error !== 'function') error = log
    return axios.put(baseUrl + '/users/' + id, params)
      .then(response => { success(response.data) })
      .catch(response => { error(response.response) })
  },
  userIsValid (success, error) {
    if (typeof success !== 'function') success = log
    if (typeof error !== 'function') error = log
    return axios.get(baseUrl + '/isValid')
      .then(response => { success(response.data) })
      .catch(response => { error(response.response) })
  },
  getUserGroup (success, error) {
    if (typeof success !== 'function') success = log
    if (typeof error !== 'function') error = log
    return axios.get(baseUrl + '/manage/usergroup')
      .then(response => { success(response.data) })
      .catch(response => { error(response.response) })
  },
  fetchRulesById (params, success, error) {
    if (typeof success !== 'function') success = log
    if (typeof error !== 'function') error = log
    return axios.get(baseUrl + '/users/' + params + '/assigned')
      .then(response => { success(response.data) })
      .catch(response => { error(response.response) })
  }
}

export default UserAPI