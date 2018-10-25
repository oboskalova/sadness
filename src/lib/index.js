export default class Lib {
  static pxStrToNumber (strPx) {
    return strPx.substring(0, strPx.length - 2)
  }

  static cloneObj = function (obj, except = new Set()) {
    var clone = {}
    for (var key in obj) {
      if (!except.has(key)) {
        if (obj[key] instanceof Array) clone[key] = obj[key].slice()
        else if (obj[key] instanceof Object) clone[key] = Lib.cloneObj(obj[key])
        else clone[key] = obj[key]
      }
    }
    return clone
  }

  static convertImgToBase64URL (url, callback, outputFormat) {
    var img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = function () {
      let canvas = document.createElement('CANVAS')
      let ctx = canvas.getContext('2d')
      let dataURL = null
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      dataURL = canvas.toDataURL(outputFormat)
      callback(dataURL)
      canvas = null
    }
    img.src = url
  }

  static get keysConst () {
    let keysConst = require('./keysConst')
    return keysConst
  }
}
