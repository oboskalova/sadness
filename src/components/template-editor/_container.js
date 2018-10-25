function Container (props = {}) {
  this.props = props
  this.content = []
  createElement.call(this)
  this.updateStyles()
}

Container.prototype.update = function (props) {
  for (let p in props) {
    if (props.hasOwnProperty(p)) {
      this.props[p] = p
    }
  }
}

Container.prototype.updateStyles = function () {
  const s = this.el.style
  s.top = `${this.props.x}px`
  s.left = `${this.props.y}px`
  s.width = `${this.props.width}px`
  s.height = `${this.props.height}px`
  console.log(s)
}

function createElement () {
  const el = document.createElement('div')
  el.classList.add('container')
  this.el = el
  this.el.dataset.id = this.props.id
}

export default Container
