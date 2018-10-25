let ScrollerHelper = class ScrollerHelper {
  constructor (contentDiv, options) {
    this.type = options.type
    this.mode = options.mode
    this.visibleHeight = contentDiv.offsetHeight
    this.visibleWidth = contentDiv.offsetWidth
    this.transition = options.transition
    this.speed = options.speed
  }

  _cloneNode (node) {
    let cloneNode = node.cloneNode()
    if (node.innerHTML) cloneNode.innerHTML = node.innerHTML
    return cloneNode
  }

  initCreateDiv (nodes, className) {
    let blockDiv = document.createElement('div')
    blockDiv.style.position = 'relative'

    if (this.type === 'horizontal') {
      blockDiv.style.display = 'inline-block'
      blockDiv.style.width = 'auto'
    }

    for (let node of nodes) {
      let cloneNode = this._cloneNode(node)
      blockDiv.appendChild(cloneNode)
    }
    if (className) blockDiv.classList.add(className)

    if (this.type === 'vertical' && this.mode === 'loop' &&
      blockDiv.lastChild && blockDiv.firstChild) {
      blockDiv.style.height = '100%'
      blockDiv.lastChild.style.marginBottom = '0px'
      blockDiv.firstChild.style.marginTop = '0px'
    }
    return blockDiv
  }

  createStartDiv (className) {
    let emptyDiv = this.initCreateDiv([], className)
    if (this.type === 'vertical') {
      emptyDiv.style.height = this.visibleHeight + 'px'
    }
    if (this.type === 'horizontal') {
      emptyDiv.style.minWidth = this.visibleWidth + 'px'
    }
    return emptyDiv
  }

  createTransitionDiv (className) {
    let tranDiv = this.initCreateDiv([], className)
    if (this.type === 'vertical') {
      tranDiv.style.height = (this.transition * 1000 / this.speed) + 'px'
    }
    if (this.type === 'horizontal') {
      tranDiv.style.minWidth = (this.transition * 1000 / this.speed) + 'px'
    }
    return tranDiv
  }
}

export default ScrollerHelper
