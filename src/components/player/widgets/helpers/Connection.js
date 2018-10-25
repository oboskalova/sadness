const Connection = class Connection {
  constructor (onlineFun, offlineFun, firstExecute = true) {
    this.onlineFun = onlineFun
    this.offlineFun = offlineFun
    this.firstExecute = firstExecute
    this._isOnline = navigator ? navigator.onLine : true
    window.addEventListener('online', this._changeState)
    window.addEventListener('offline', this._changeState)
  }

  get isOnline () {
    return this._isOnline
  }

  _changeState () {
    if (navigator && navigator.onLine) this._isOnline = true
    else if (navigator) this._isOnline = false
  }

  startListen () {
    window.addEventListener('online', this.onlineFun)
    window.addEventListener('offline', this.offlineFun)
    if (this.firstExecute) {
      if (navigator && navigator.onLine) this.onlineFun()
      else if (navigator) this.offlineFun()
    }
  }

  stopListen () {
    window.removeEventListener('online', this._changeState)
    window.removeEventListener('offline', this._changeState)
    window.removeEventListener('online', this.onlineFun)
    window.removeEventListener('offline', this.offlineFun)
  }
}

export default Connection
