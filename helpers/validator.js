const Validator = {
  exist (type) {
    return this.hasOwnProperty(type)
  },
  isMonth (value) {
    value = +value
    const status = ((0 <= value) && (value < 12))
    const message = status ?
      `Значение находится в пределах 0..11` :
      `Значение должно находиться в пределах 0..11`
    return {
      status, message
    }
  },
  withinMonth (date = 1, month = 0) {
    const maxDate = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
    if (maxDate) {
      const status = ((0 < date) && (date <= maxDate))
      const message = status ?
        `Число в пределах 1..${maxDate}` :
        `Число должно находится в пределах 1..${maxDate}`
      return {
        status, message
      }
    }
  },
  positiveNumber (value) {
    value = +value
    const status = (!Number.isNaN(value) && value > 0)
    const message = status ?
      `Значение является положительным` :
      `Значение должно быть положительным`
    return {
      status, message
    }
  },
  isBefore (firstDate, secondDate) {
    const a = +new Date(JSON.parse(firstDate))
    const b = +new Date(JSON.parse(secondDate))
    if (!Number.isNaN(a) && !Number.isNaN(b)) {
      return (a < b)
    }
  },
  notEmail (value) {
    value = ''.trim.call(value)
    return !/\w+@\w+\.\w+/.test(value)
  },
  equal () {
    let args = [].slice.call(arguments, 0)
    if (args.length !== 0) {
      let value = args.shift()
      return args.reduce((prev, curr) => {
        return prev && (curr === value)
      }, true)
    }
  },
  notEqual () {
    return !this.equal(...arguments)
  },
  empty (value) {
    return value.length === 0
  }
}

export default Validator
