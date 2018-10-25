import { getComporator, removeInArray } from '../../../helpers'
import { alertDefaults } from '../../../helpers/defaults'
import messages from '../../../helpers/messages'
import lodash from 'lodash'

export default {
  UPDATE_SEARCH_QUERY (state, query = '') {
    state.searchQuery = query.trim()
  },
  CHANGE_SEARCHING_MODE (state, options) {
    state.searchingMode = options.mode
  },
  CLEAR_UPLOAD_FILE_LIST (state) {
    state.uploadFiles = []
  },
  UPDATE_UPLOAD_PROGRESS (state, options = {}) {
    let file = state.uploadFiles.find(e => e.id === options.id)
    const done = (options.loaded === options.total)
    const percent = (options.loaded / options.total * 100)
    if (file) {
      file.percent = percent
      file.loaded = options.loaded
      file.total = options.total
      file.done = done
    } else {
      const item = Object.assign({}, options, { done, percent })
      state.uploadFiles.push(item)
    }
  },
  UPDATE_DRIVE_TREE (state, data = []) {
    state.driveTree = data
  },
  DISPLAY_ALERT (state, options = {}) {
    options = Object.assign({}, alertDefaults, options)
    state.alertType = options.type
    state.alertMessage = messages[options.messageType]
    state.dismissCountDown = state.dismissSecs
  },
  SET_COUNT_DOWN (state, value) {
    state.dismissCountDown = value
  },
  ASSIGN_DRAGGING_OBJECTS (state) {
    state.catalogue.forEach((e) => {
      if (e.isChoosed) e.isDragging = true
    })
  },
  REMOVE_SELECTION (state) {
    state.catalogue.forEach((e) => {
      if (e.isChoosed) e.isChoosed = false
    })
  },
  DENY_DRAGGING_OBJECTS (state) {
    state.catalogue.forEach((e) => {
      if (e.isDragging) e.isDragging = false
    })
  },
  DELETE_CATALOGUE_OBJECTS (state) {
    for (let i = state.catalogue.length - 1; i !== -1; --i) {
      if (state.catalogue[i].isChoosed) {
        state.catalogue.splice(i, 1)
      }
    } 
  },
  TOGGLE_CATALOGUE_OBJECT (state, {id, isManySelection}) {
    console.log(isManySelection)
    if (!isManySelection) {
      state.catalogue.forEach(el => el.isChoosed = false)
    }
    const driveObject = state.catalogue.find(e => id === e.id)
    driveObject.isChoosed = !driveObject.isChoosed
  },
  SMART_TOGGLE_CATALOGUE_OBJECT (state, {id, isCtrl, isShift}) {
    if (!isCtrl && !isShift) {
      state.catalogue.forEach(el => el.isChoosed = false)
      let el = state.catalogue.find(e => id === e.id)
      el.isChoosed = !el.isChoosed
    } 
    if (isCtrl && !isShift) {
      let el = state.catalogue.find(e => id === e.id)
      el.isChoosed = !el.isChoosed
    }
    if (isShift && !isCtrl) {
      let ind = state.catalogue.findIndex(e => id === e.id)
      let upInd = lodash.findIndex(state.catalogue, { isChoosed: true })
      let downInd = lodash.findLastIndex(state.catalogue, { isChoosed: true })
      console.log(`ind = ${ind} upInd = ${upInd} downInd = ${downInd}`)
      let startInd = 0
      let endInd = 0
      if (upInd === -1 && downInd !== -1) {
        startInd = ind < downInd ? ind : downInd
        endInd = ind > downInd ? ind : downInd
      }
      if (upInd !== -1 && downInd === -1) {
        startInd = ind < upInd ? ind : upInd
        endInd = ind > upInd ? ind : upInd
      }
      if (upInd !== -1 && downInd !== -1) {
        let upDist = ind - upInd
        let downDist = downInd - ind
        if (downDist > upDist) {
          startInd = ind < downInd ? ind : downInd
          endInd = ind > downInd ? ind : downInd
        } else {
          startInd = ind < upInd ? ind : upInd
          endInd = ind > upInd ? ind : upInd
        }
      }
      if (endInd - startInd !== 0) state.catalogue.forEach(el => el.isChoosed = false)
      console.log(`startInd = ${startInd} endInd = ${endInd}`)
      for (let i = startInd; i <= endInd; i++) {
        let el = state.catalogue[i]
        el.isChoosed = true
      }
    }

    // state.catalogue.forEach(el => el.isChoosed = false)
    // state.catalogue.forEach(el => {
    //   if (lodash.some(idList, el.id)) el.isChoosed = true
    // })
  },
  START_MOVING (state) {
    state.movingMode = true
    state.movingObjects = []
    state.catalogue.forEach(e => {
      if (e.isChoosed) {
        e.isDragging = true
        state.movingObjects.push(e.id)
      }
    })
  },
  FINISH_MOVING (state) {
    state.movingMode = false
    state.movingObjects = []
    state.catalogue.forEach(e => {
      if (e.isDragging) e.isDragging = false
    })
  },
  UPDATE_DEST_CATALOGUE (state, id) {
    state.destCatalogueId = id
  },
  RENAME_CATALOGUE_OBJECT (state, options) {
    const obj = state.catalogue.find(e => e.id === options.id)
    if (!obj) obj.name = options.name
  },
  UPDATE_CATALOGUE (state, obj = {}) {
    let i = 0
    const type = obj.type
    for (i = 0; i < state.catalogue.length; i++) {
      if (type <= state.catalogue[i].type) break
    }
    state.catalogue.splice(i, 0, obj)
  },
  UPLOAD_CATALOGUE (state, options) {
    state.parentCatalogueId = options.parent_id
    state.catalogue = options.children
  },
  SET_PARENT_ID (state, options) {
    state.parentCatalogueId = options
  },
  UPDATE_SEARCH_RESULTS (state, data) {
    state.searchResults = data
  },
  SORT_CATALOGUE (state, options) {
    const compare = getComporator(options.key, options.direction)
    state.catalogue.sort((a, b) => {
      const aType = a.type
      const bType = b.type
      if (aType === bType) {
        return compare(a, b)
      } else {
        if (aType === 0 || bType === 0) {
          if (options.direction === -1 && options.key === 'type') {
            return (bType - aType)
          } else {
            return (aType - bType)
          }
        }
        return compare(a, b)
      }
    })
  },
  SORT_CATALOGUE_INITIAL (state) {
    state.catalogue.sort((a, b) => {
      const aType = a.type
      const bType = b.type
      if (aType === bType) {
        const aDate = +new Date(a.updated_at)
        const bDate = +new Date(b.updated_at)
        if (bDate === aDate) {
          if (a.name === b.name) return 0
          return a.name < b.name ? -1 : 1
        }
        return (bDate - aDate)
      }
      return (aType - bType)
    })
  },
  UPDATE_SORTING_DIRECTION (state, options) {
    for (let key in state.sortingDirections) {
      state.sortingDirections[key] = options.hasOwnProperty(key) ? options[key] : 0
    }
  },
  UPDATE_BREADCRUMD_LIST (state, targetId = 1) {
    let used = {}
    let path = [{ parent: +targetId }]
    // Deep First Search algorithm
    function dfs (v) {
      used[v.id] = true
      if (!v.children) return
      v.children.forEach(u => {
        if (!used[u.id]) dfs(u)
        if (u.id === path[0].parent) {
          path.unshift({
            text: u.name,
            href: u.id,
            parent: +u.parent_id
          })
        }
      })
    }
    // Create fictitious root and start DFS
    dfs({ id: -1, children: state.driveTree })
    // Remove target node
    path.pop()
    state.breadcrumbList = path
  },
  CHANGE_REQUEST_TYPE (state, type) {
    state.requestedCatalogue = !!type
  }
}
