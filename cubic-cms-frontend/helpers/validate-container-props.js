import { isFinite } from 'lodash'

const any = (value) => {
  return value
}

const finite = (value) => {
  value = +value
  return isFinite(value) ? value : 0
}

const between = (value, boundBottom = 0, boundTop = Infinity) => {
  value = +value
  boundTop = +boundTop
  boundBottom = +boundBottom
  if (!isFinite(value)) return null
  if (value < boundBottom) return boundBottom
  if (boundTop < value) return boundTop
  return value
}

const positive = (value) => {
  return between(value, 0)
}

// Replace 'finite' or 'positive' to 'between' for the 'x', 'y', 'width', 'height'
// properties to forbid go beyond the parent container

const map = {
  name: any,
  x: finite,
  y: finite,
  z: finite,
  width: positive,
  height: positive,
  background_color: any,
  show: any
}

export default function () {
  let args = [].slice.call(arguments, 0)
  const prop = args.shift()
  const fn = map[prop]
  return (typeof fn === 'function') ? fn.apply(null, args) : null
}
