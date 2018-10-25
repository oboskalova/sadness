let _date = 0
let _token = ''
let _accepted = ''

const storageKey = {
  date: 'cms-auth-date',
  token: 'cms-access-token',
  accepted: 'cms-accepted'
}

const User = {
  getToken () {
    if ('localStorage' in window) {
      _token = window.localStorage.getItem(storageKey.token, _token)
    }
    return _token
  },
  getAccepted () {
    if ('localStorage' in window) {
      _accepted = window.localStorage.getItem(storageKey.accepted, _accepted)
    }
    return _accepted
  },
  setAccepted (accepted) {
    _accepted = accepted
    if ('localStorage' in window) {
      window.localStorage.setItem(storageKey.accepted, _accepted)
    }
  },
  signIn (token) {
    _date = +new Date()
    _token = token
    if ('localStorage' in window) {
      window.localStorage.setItem(storageKey.date, _date)
      window.localStorage.setItem(storageKey.token, _token)
    }
  },
  signOut () {
    _token = ''
    _accepted = ''
    if ('localStorage' in window) {
      window.localStorage.setItem(storageKey.token, _token)
      window.localStorage.setItem(storageKey.accepted, _accepted)
    }
  },
  isAuth () {
    if ('localStorage' in window) {
      _date = +window.localStorage.getItem(storageKey.date)
      _token = window.localStorage.getItem(storageKey.token) || ''
    }
    return _token.length !== 0 
  },
  isAccepted () {
    if ('localStorage' in window) {
      _accepted = window.localStorage.getItem(storageKey.accepted) || ''
    }
    return _accepted.length !== 0 
  },
  canEditTemplateProps () {
    return true
  },
  canEditContainerProps (containerId) {
    console.log('canEditContainerProps' + containerId)
    return true
  },
  canEditContainerPlaylist (containerId) {
    console.log('canEditContainerPlaylist' + containerId)
    return true
  }
}

export default User
