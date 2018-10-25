/* eslint-disable */
import TreeViewItemValue from './TreeViewItemValue.vue'
import TreeViewItem from './TreeViewItem.vue'
import TreeView from './TreeView.vue'
import _ from 'lodash'

const createHyphenator = require('hyphen')
const hyphenationPatternsRu = require('../../../../../node_modules/hyphen/patterns/ru')

export default class JsonTree {

  static install(Vue) {
    Vue.component("tree-view-item-value", TreeViewItemValue)
    Vue.component("tree-view-item", TreeViewItem)
    Vue.component("tree-view", TreeView)
  }

  static isSyncWithTokenText(tokenText, tree) {
    return new Promise((resolve, reject) => {
      let tokens = []
      setTokensByTree(tree.root, tokens)
      tokens.forEach(token => {
        if (tokenText.indexOf(token) === -1) {
          reject()
        } 
      })
      resolve()
    })
  }

  static isTokensText(text) {
    let matchOpen = text.match(/\[/g)
    let matchClose = text.match(/\]/g)
    if (matchOpen instanceof Array &&
      matchClose instanceof Array &&
      matchOpen.length === matchClose.length) {
      return true
    } else return false
  }

  static toToken(tree, styles) {
    return toTokenRec(tree.root, 0, tree, styles)
  }

  static toText(tree) {
    return toTextRec(tree.root, tree, tree.tokenText)
  }

  static checkInfo(tree) {
    let checks = new Map()
    checksInfoRec(tree, checks)
    return checks
  }

  static stylesInfo(tokenText) {
    let res = tokenText.match(/<p.*?(<\/p>)/g)
    return res ? res : []
  }

  static parsedData (data, checks) {
    let rootObjectKey = 'Данные'
    if (isValue(data)) {
      return transformValue('0', checks, data, '')
    }
    return transformObject('0', checks, data, rootObjectKey, '', true)
  }
}

function toTextRec (tree, params, tokenText, parent) {
  let res = tokenText
  if (tree) {
    // console.log('is Tree', tree.children)
    if (tree.value && tree.isCheck) {
      // console.log('value')
      let value = tree.value
      if (params.isWordshy) {
        let hyphenate = createHyphenator(hyphenationPatternsRu, {hyphenChar: '&shy;'})
        value = hyphenate(value)
      }
      let val = params.isKey && parent && parent.type === 'object' ? tree.key + ': ' + value : String(value)
      if (params.charCount && typeof val === 'string') val = val.substring(0, params.charCount)
      res = res.replace(nodeToken(tree), val)
    }
    if (tree.children instanceof Array) {
      // console.log('isArray')
      tree.children.forEach(child => {
        res = toTextRec(child, params, res, tree)
      })
    }
  }
  return res
}

function stylesAdd(token, styles = []) {
  for (let i = 0; i < styles.length; i++) {
    let cur = styles[i]
    if (cur.indexOf(token) !== -1) {
      return cur
    }
  }
  return null
}

function toTokenRec (tree, deep, params, styles) {
  let res = ''
  if (tree.value && tree.isCheck) {
    // params.isKey && parent.type === 'object' ? tree.key + ': ' + tree.value : tree.value
    let add = stylesAdd(nodeToken(tree), styles)
    if (add) res += add + '\n'
    else res+=`<p style="padding-left: ${params.isIndent ? (30 * (deep > 0 ? deep - 1 : 0)) : 0}px;">${nodeToken(tree)}</p>\n`
  }
  if (tree.children instanceof Array) {
    tree.children.forEach(child => {
      res += toTokenRec(child, deep + 1, params, styles)
    })
  }
  return res
}

function checksInfoRec(tree, checks) {
  checks.set(tree.id, tree.isCheck)
  if (tree.children instanceof Array) {
    tree.children.forEach(child => {
      checksInfoRec(child, checks)
    })
  }
}

function setTokensByTree(tree, resArr = []) {
  if (tree.value && tree.isCheck) {
    resArr.push(nodeToken(tree))
  } 
  if (tree.children instanceof Array) {
    tree.children.forEach(child => {
      setTokensByTree(child, resArr)
    })
  }
}

function nodeToken(tree) {
  return '[' + tree.key + '-' + tree.id + ']'
}

function isObject (value) {
  return _.isPlainObject(value);
}

function isArray (value) {
  return _.isArray(value);
}

function isValue (value) {
  return !isObject(value) && !isArray(value);
}

function generateChildrenFromCollection (idHead, checks, collection) {
  let id = 0
  return _.map(collection, (value, keyOrIndex)=>{
    id += 1
    let newIdHead = idHead + "-" + String(id)
    if (isObject(value)) {
      return transformObject(newIdHead, checks, value, keyOrIndex)
    }
    if (isArray(value)) {
      return transformArray(newIdHead, checks, value, keyOrIndex)
    }
    if (isValue(value)) {
      return transformValue(newIdHead, checks, value, keyOrIndex)
    }
  }) 
}

function transformValue (idParam, checks, valueToTransform, keyForValue) {
  return {
    id: idParam,
    key: keyForValue,
    type: "value",
    value: valueToTransform,
    isCheck: checks instanceof Map ? checks.get(idParam) : false
  }
}

function transformArray (idParam, checks, arrayToTransform, keyForArray) {
  return {
    id: idParam,
    key: keyForArray,
    type: "array",
    children: generateChildrenFromCollection(idParam, checks, arrayToTransform),
    isCheck: checks instanceof Map ? checks.get(idParam) : false
  }
}

function transformObject (idParam, checks, objectToTransform, keyForObject, isRootObject = false) {
  let obj = {
    id: idParam,
    key: keyForObject,
    type: "object",
    isRoot: isRootObject,
    children: generateChildrenFromCollection(idParam, checks, objectToTransform),
    isCheck: checks instanceof Map ? checks.get(idParam) : false
  }
  return obj
}

