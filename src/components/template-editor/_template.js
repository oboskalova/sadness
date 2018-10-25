import Container from './_container.js'

function Templet (props = {}, data = []) {
  transformData.call(this, props)
  createGraph.call(this, data)
  this.render()
}

function transformData (props = {}, data = []) {
  try {
    props.background = JSON.parse(props.background_color).rgba
  } catch (e) {
    props.background = { r: 255, g: 255, b: 255, a: 1 }
  }
  try {
    this.rights = JSON.parse(props.rights)
  } catch (e) {
    this.rights = []
  }
  let r = {}
  for (let i = this.rights.length; i;) {
    r[this.rights[--i].id] = i
  }
  this.mapRights = r
  this.props = props
}

function createGraph (data = []) {
  const g = {}
  const c = {}
  for (let i = data.length; i;) {
    const e = data[--i]
    if (!g[e.parent_id]) g[e.parent_id] = []
    g[e.parent_id].push(e.id)
    c[e.id] = new Container(e)
  }
  this.graph = g
  this.containers = c
}

Templet.prototype.createScene = function (props = {}) {}

Templet.prototype.removeScene = function () {}

Templet.prototype.createContainer = function (props = {}) {}

Templet.prototype.removeContainer = function (id) {}

Templet.prototype.translateContainer = function (props = {}, bounds = {}) {
  let { id, x, y } = props
  const c = this.containers[id]
  if (x < bounds.left) {
    x = bounds.left
  } else if (x > bounds.right) {
    x = bounds.right
  }
  if (y < bounds.top) {
    y = bounds.top
  } else if (y > bounds.bottom) {
    y = bounds.bottom
  }
  c.update({ x, y })
}

Templet.prototype.resizeContainer = function (props = {}, bounds = {}) {
  let { id, width, height } = props
  const c = this.containers[id]
  if (width < 0) {
    width = 0
  } else if (width > bounds.width) {
    width = bounds.width
  }
  if (height < 0) {
    height = 0
  } else if (height > bounds.height) {
    height = bounds.height
  }
  c.update({ width, height })
}

Templet.prototype.render = function () {
  this.el = document.createElement('div')
  this.updateStyles()
}

Templet.prototype.updateProps = function (props = {}) {
  for (let p in props) {
    if (props.hasOwnProperty(p)) {
      this.props[p] = props[p]
    }
  }
}

Templet.prototype.updateStyles = function () {
  const s = this.el.style
  const rgba = this.props.background
  s.width = `${this.props.width}px`
  s.height = `${this.props.height}px`
  s.backgroundColor = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`
}

Templet.prototype.clear = function () {
  console.log('clear')
}

export default Templet
