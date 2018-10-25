class ValidationError {
  constructor () {
    this.messages = {}
  }
  has (field) {
    return this.messages.hasOwnProperty(field)
  }
  push (field = '', message = '') {
    this.messages[field] = message
  }
  pop (field = '') {
    if (this.has(field)) {
      delete this.messages[field]
    }
  }
  clear () {
    this.messages = {}
  }
  message (field = '') {
    return this.messages[field]
  }
  empty () {
    let i = 0
    for (let field in this.messages) {
      if (this.messages.hasOwnProperty(field)) ++i
    }
    return i === 0
  }
}

export default ValidationError