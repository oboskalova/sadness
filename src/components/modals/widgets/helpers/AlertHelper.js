export default class AlertHelper {
  constructor () {
    this.isError = undefined
    this.text = ''
  }

  get isVal () {
    return this.isError !== undefined
  }

  get isErr () {
    return this.isError === true
  }

  get isSucc () {
    return this.isError === false
  }

  setSucc (text) {
    this.isError = false
    this.text = text
  }

  setErr (text) {
    this.isError = true
    this.text = text
  }

  reset () {
    this.isError = undefined
    this.text = ''
  }

  clear () {
    this.text = ''
  }
}
