const floor = Math.floor

function compareNumbers(a, b) {
  return floor(a) - floor(b)
}
function compareStrings(a, b) {
  return a.localeCompare(b)
}
function compareDates(a, b) {
  return new Date(a) - new Date(b)
}

const comparators = {
  name: function (a, b) {
    return compareStrings(a.name, b.name)
  },
  active: function (a, b) {
    return compareStrings(a.active, b.active)
  },
  typer: function (a, b) {
    return compareStrings(a.type, b.type)
  },
  type: function (a, b) {
    return compareNumbers(a.type, b.type)
  },
  size: function (a, b) {
    return compareNumbers(a.size, b.size)
  },
  published: function (a, b) {
    return compareNumbers(+a.published, +b.published)
  },
  updated_at: function (a, b) {
    return compareDates(a.updated_at, b.updated_at)
  },
  connected_at: function (a, b) {
    return compareDates(a.connected_at, b.connected_at)
  }
}

export function getComporator(type, direction) {
  return function (a, b) {
    const compareResult = comparators[type](a, b)
    return (direction * compareResult)
  }
}

export function detectType (mimeType, fileName) {
  if (mimeType === '') {
    const fileType = fileName.substr(fileName.lastIndexOf('.') + 1)
    if (fileType === 'ppt' || fileType === 'pptx') {
      return 5
    }
  }
  mimeType = mimeType + ''
  const type = mimeType.split('/')[0]
  switch (type) {
    case 'image': return 1
    case 'video': return 2
    case 'audio': return 3
    case 'text': return 4
    case 'application': return 5
    default: return 0
  }
}

export function generateId () {
  return Math.floor(8999999 * Math.random()) + 1000000
}

export function contains (a, o) {
  if (isArray(a)) {
    return (a.findIndex(e => e === o) !== -1)
  }
}

export function isArray (o) {
  return Object.prototype.toString.call(o) === '[object Array]'
}

export function removeInArray (a, o) {
  const i = a.findIndex(e => e === o)
  if (i !== -1) a.splice(i, 1)
}

export function capitalize (s) {
  console.log('que')
  var ss = s
  console.log(ss)
  ss = ss + ''
  console.log(ss)
  return ss.length ? ss[0].toUpperCase() + ss.slice(1) : ss
}