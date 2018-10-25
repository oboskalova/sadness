import axios from 'axios'

const SocketAPI = {
  install (params) {
    const headersAuthorization = axios.defaults.headers.common['Authorization']
    this.token = headersAuthorization ? headersAuthorization.split(' ')[1] : null
    this.url = 'ws://ws.devcubic.ru'
    // this.url = 'ws://localhost:8043'
    this.s = new WebSocket(this.url)
    this.store = params
    this.setHandlers()
  },
  reconnect () {
    this.s = new WebSocket(this.url)
    this.setHandlers()
  },
  setHandlers () {
    for (let h in this.handlers) {
      if (this.handlers.hasOwnProperty(h)) {
        this.s[h] = this.handlers[h]
      }
    }
  },
  sendData (command, data = {}){
    var obj = JSON.stringify({
      command: command,
      data: data
    })
    this.s.send(obj)
  }
}

SocketAPI.strategy = {
  onmessage (d) {
    console.log(d)
  },
  checkOnline (d) {
    SocketAPI.store.commit("UPDATE_ONLINE", d)
  },
  checkSingleOnline (d) {
    SocketAPI.store.commit("UPDATE_SINGLE_ONLINE", d)
  },
  logout () {
    SocketAPI.store.dispatch('logout')
  }
}
var inter
SocketAPI.handlers = {
  onclose () {
    clearInterval(inter)
    console.log('Соединение закрыто, пробуем соединиться через 5 секунд')
    setTimeout(function () {SocketAPI.reconnect()}, 5000)
  },
  onmessage (event) {
    const data = JSON.parse(event.data)
    const t = data.command
    const d = data.data
    const fn = SocketAPI.strategy[t]
    if (typeof fn === 'function') fn(d)
  },
  onerror () {},
  onopen () {
    SocketAPI.sendData('auth',{
      type: 'web',
      token: SocketAPI.token
    })
    inter = setInterval(function () {SocketAPI.sendData('alive')}, 30000)
  }
}

export default SocketAPI