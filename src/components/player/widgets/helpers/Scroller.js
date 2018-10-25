import snabbt from 'snabbt.js'
import ScrollerHelper from './ScrollerHelper'

const Scroller = class {
  constructor (contentDiv, options) {
    this.helper = new ScrollerHelper(contentDiv, options)
    this.play = false
    this.contentDiv = contentDiv
    this.speed = options.speed
    this.delay = options.delay
    this.transition = options.transition
    this.type = options.type
    this.mode = options.mode
    this.simpleRepeatAnimation = (options.simpleRepeatAnimation === false ? options.simpleRepeatAnimation : true)
    this.isFirst = false
    this.startDiv = {}
    this.leave = options.leave
    this.loopScrollSize = 0
    this.simpleCallback = options.simpleCallback
    this._timerId = null
    this._disableScroll = false
    this._curOffset = 0
    this._scrollPause = false
    this._parentNode = contentDiv.parentNode
  }

  destructor () {
    this.stopPlay()
    if (this.contentDiv) {
      for (let child of this.contentDiv.childNodes) {
        this.contentDiv.removeChild(child)
      }
    }
  }

  // Перезагрузка анимации
  reloadPlay () {
    this.stopPlay()
    this.startPlay()
  }

  // Запуск
  startPlay () {
    if (!this.play) {
      setTimeout(() => this._start(), 100)
    }
  }

  // Остановка
  stopPlay () {
    snabbt(this.contentDiv.childNodes, 'stop')
    this.play = false
  }

  // Инициализация Контента
  initHtml () {
    if (!this.contentDiv || !this.contentDiv.childNodes) {
      return
    }

    let blockDivList = []

    let children = this.contentDiv.childNodes

    if (this.mode === 'loop') {
      blockDivList.push(this.helper.createStartDiv('start'))
    }

    blockDivList.push(this.helper.initCreateDiv(children, 'block1'))

    if (this.mode === 'loop') {
      blockDivList.push(this.helper.createTransitionDiv('trans1'))
      blockDivList.push(this.helper.initCreateDiv(children, 'block2'))
      blockDivList.push(this.helper.createTransitionDiv('trans2'))
    }

    // очистка старого содержимого
    while (this.contentDiv.lastChild) {
      this.contentDiv.removeChild(this.contentDiv.lastChild)
    }
    // добавление новых блоков
    for (let blockDiv of blockDivList) {
      this.contentDiv.appendChild(blockDiv)
    }

    if (this.type === 'horizontal') {
      this.contentDiv.style.whiteSpace = 'nowrap'
    }

    if (this.mode === 'loop') {
      this.startDiv = this.contentDiv.querySelector('.start')
      let block1 = this.contentDiv.querySelector('.block1')
      let trans1 = this.contentDiv.querySelector('.trans1')
      if (this.type === 'vertical') {
        this.loopScrollSize = block1.clientHeight + trans1.clientHeight
      } else if (this.type === 'horizontal') {
        this.loopScrollSize = block1.clientWidth + trans1.clientWidth
      }
    }

    return this.contentDiv.innerHTML
  }

  _loopUpdate () {
    let transArr = [0, 0, 0]

    if (this.type === 'vertical') {
      transArr = [0, -this.loopScrollSize, 0]
    } else if (this.type === 'horizontal') {
      transArr = [-this.loopScrollSize, 0, 0]
    }

    let animObj = {
      fromPosition: [0, 0, 0],
      position: transArr,
      easing: 'linear',
      duration: this.loopScrollSize * this.speed,
      allDone: () => {
        var matrix = snabbt.createMatrix()
        matrix.translate(0, 0, 0)
        for (let child of this.contentDiv.childNodes) {
          snabbt.setElementTransform(child, matrix)
        }
        if (this.play) this._loopUpdate()
      }
    }

    snabbt.sequence([
      [this.contentDiv.childNodes, animObj]
    ])
  }

  _simpleUpdate () {
    let offset = 0
    let transArr = [0, 0, 0]
    if (!this.contentDiv) {
      return
    }

    if (this.type === 'vertical') {
      offset = this.contentDiv.scrollHeight
      if (!this.leave) offset -= this.contentDiv.offsetHeight
      transArr = [0, -offset, 0]
    }

    if (this.type === 'horizontal') {
      offset = this.contentDiv.scrollWidth
      if (!this.leave) offset -= this.contentDiv.offsetWidth
      transArr = [-offset, 0, 0]
    }

    if (this.type === 'paging') {
      transArr = []
      let obj = this._setTransArrayForPagingMode()
      let seq = this._setPagingAnimation(obj.transArr) || []

      snabbt.sequence(seq)

      return
    }

    let animObj1 = {
      fromPosition: [0, 0, 0],
      delay: this.delay * 1000,
      position: transArr,
      easing: 'linear',
      duration: offset * this.speed * 2
    }

    let animObj2 = {
      fromOpacity: 1,
      opacity: 0,
      easing: 'linear',
      duration: this.leave ? 0 : 1000
    }

    let animObj3 = {
      position: [0, 0, 0],
      easing: 'linear',
      duration: 0
    }

    let animObj4 = {
      fromOpacity: 0,
      opacity: 1,
      delay: this.transition * 1000,
      easing: 'linear',
      duration: 1000,
      allDone: () => {
        if (this.simpleRepeatAnimation) {
          if (this.play) this._simpleUpdate()
        }
      }
    }

    snabbt.sequence([
      [this.contentDiv.childNodes, animObj1],
      [this.contentDiv.childNodes, animObj2],
      [this.contentDiv.childNodes, animObj3],
      [this.contentDiv.childNodes, animObj4]
    ])
  }

  _start () {
    if (!this.contentDiv || !this.contentDiv.childNodes) {
      return
    }

    if (this.mode === 'loop') {
      if (!this.isFirst) {
        this.isFirst = true
        snabbt(this.contentDiv.childNodes, {
          position: [0, -this.startDiv.clientHeight, 0],
          easing: 'linear',
          duration: this.startDiv.clientHeight * this.speed,
          allDone: () => {
            this.contentDiv.removeChild(this.contentDiv.childNodes[0])
            var matrix = snabbt.createMatrix()
            matrix.translate(0, 0, 0)
            for (let child of this.contentDiv.childNodes) {
              snabbt.setElementTransform(child, matrix)
            }
            this._loopUpdate()
          }
        })
      } else this._loopUpdate()
    } else this._simpleUpdate()
    this.play = true
  }

  _setPagingAnimation (transArr, offset) {
    let seq = []

    for (let i = 0; i < transArr.length; i++) {
      seq.push([this.contentDiv.childNodes, {
        fromPosition: transArr[i].from,
        delay: 0,
        position: transArr[i].to,
        easing: 'linear',
        duration: transArr[i].offset * this.speed
      }])

      seq.push([this.contentDiv.childNodes, {
        delay: this.delay * 1000
      }])
    }

    seq.push([this.contentDiv.childNodes, {
      fromOpacity: 1,
      opacity: 0,
      easing: 'linear',
      duration: this.leave ? 0 : 1000
    }])

    seq.push([this.contentDiv.childNodes, {
      position: [0, 0, 0],
      easing: 'linear',
      duration: 0
    }])

    seq.push([this.contentDiv.childNodes, {
      fromOpacity: 0,
      opacity: 1,
      delay: this.transition * 1000,
      easing: 'linear',
      duration: 1000,
      allDone: () => {
        if (this.simpleRepeatAnimation) {
          this._simpleUpdate()
        }
      }
    }])

    return seq
  }

  _setTransArrayForPagingMode () {
    if (!this._parentNode) {
      return
    }

    let transArr = []
    let lastOffset = 0
    let parentScrollHeight = this._parentNode.scrollHeight
    let offset = 0

    for (let i = 0; i < this.contentDiv.childNodes.length; i++) {
      let start = 0
      let scrollDifference = 0
      if (i > 0) {
        scrollDifference = this.contentDiv.childNodes[i - 1].scrollHeight - parentScrollHeight
        start = offset + this.contentDiv.childNodes[i - 1].scrollHeight - parentScrollHeight - scrollDifference
      }

      offset = lastOffset + this.contentDiv.childNodes[i].scrollHeight - parentScrollHeight - scrollDifference
      lastOffset = offset
      lastOffset += this.contentDiv.childNodes[i].scrollHeight

      start = start > 0 ? start : 0
      offset = offset > 0 ? offset : 0

      transArr.push({
        from: [0, -start, 0],
        to: [0, -offset, 0],
        offset: this.contentDiv.childNodes[i].scrollHeight
      })
    }

    return {
      transArr: transArr
    }
  }
}

export default Scroller
