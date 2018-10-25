import Vue from 'vue'
import { merge, isEqual } from 'lodash'
import { defaultTimeline } from '../../../helpers/defaults'
import { getComporator, removeInArray } from '../../../helpers'
import validate from '../../../helpers/validate-container-props'
import { prolongTemplate } from '../../../api/template-editor'
import moment from 'moment'

export default {
  TOOGLE_SEARCHING_MODE (state, value) {
    state.searchWithTags = value
  },
  LOAD_OBTAINED_RESULTS (state, value = []) {
    state.searchTagResults = value
  },
  // Core
  HISTORY_CLEAR (state) {
    state.coreHistory = []
    state.coreHistoryState = 0
  },
  HISTORY_PUSH (state, command = {}) {
    if (!('type' in command)) return
    prolongTemplate(state.coreTemplate.id)
    const last = state.coreHistory[state.coreHistoryState]
    if (!isEqual(last, command)) {
      state.coreHistory.splice(state.coreHistoryState)
      state.coreHistory.push(command)
      state.coreHistoryState = state.coreHistory.length
    }
  },
  HISTORY_ROLLBACK (state) {
    if (0 < state.coreHistoryState)
      state.coreHistoryState--
  },
  HISTORY_FORWARD (state) {
    if (state.coreHistoryState < state.coreHistory.length)
      state.coreHistoryState++
  },
  CREATE_TEMPLATE (state, template = {}) {
    state.templates.unshift(template)
  },
  UPDATE_TEMPLATE (state, template = {}) {
    state.coreTemplate = template
  },
  UPDATE_TEMPLATE_PROPS (state, template = {}) {
    for (let prop in template) {
      if (template.hasOwnProperty(prop)) {
        state.targetTemplate[prop] = state.coreTemplate[prop] = template[prop]
      }
    }
  },
  REMOVE_TEMPLATE_SELECTION (state) {
    state.template = {} 
    state.targetTemplate = {}
  },
  RESIZE_SCENES (state) {
    if (!state.coreTemplate.id) return
    const { width, height } = state.coreTemplate
    const scenes = state.coreGraph[0]
    for (let sId in scenes) {
      if (scenes.hasOwnProperty(sId)) {
        const s = scenes[sId]
        s.width = width
        s.height = height
      }
    }
  },
  UPDATE_RIGHTS (state, rights = {}) {
    state.coreRights = rights
  },
  CHANGE_ACTION_TYPE (state, type) {
    state.coreActionType = type
  },
  CHANGE_CONTAINER (state, containerId = 0) {
    state.coreActiveContainerId = containerId
    const parentId = state.coreBackRelation[containerId]
    const boundsId = state.coreBackRelation[parentId]
    let pId = containerId
    while (state.coreBackRelation[pId]) {
      pId = state.coreBackRelation[pId]
    }
    state.coreActiveSceneId = pId
    state.coreActiveContainer = state.coreGraph[parentId][containerId]
    state.coreParentContainer = parentId || boundsId ? state.coreGraph[boundsId][parentId] : {}
    if (!state.coreActiveContainer.editable) {
      state.coreActionType = 'None'
    }
  },
  UPDATE_CONTAINER_PROPS (state, params = {}) {
    const b = state.coreBounds
    for (let prop in params) {
      const bounds = b[prop] || []
      // const value = validate(prop, params[prop], ...bounds)
      const value = params[prop]
      if (params.hasOwnProperty(prop) && value !== null) {
        state.coreActiveContainer[prop] = value
      }
    }
  },
  UPDATE_CHOSED_CONTAINER_PROPS (state, data = {}) {
    console.log('data', data)
    var params = data.props
    const containerId = data.id
    const parentId = state.coreBackRelation[containerId]
    let pId = containerId
    while (state.coreBackRelation[pId]) {
      pId = state.coreBackRelation[pId]
    }
    var cont = state.coreGraph[parentId][containerId]
    for (let prop in params) {
      const value = params[prop]
      if (params.hasOwnProperty(prop) && value !== null) {
        cont[prop] = value
      }
    }
  },
  UPDATE_BOUNDS (state) {
    const c = state.coreActiveContainer
    const p = state.coreParentContainer
    let maxX = p.width - c.width
    let maxY = p.height - c.height
    let minWidth = 0
    let minHeight = 0
    let maxWidth = p.width - c.x
    let maxHeight = p.height - c.y
    let childs = state.coreGraph[state.coreActiveContainerId]
    for (let id in childs) {
      if (childs.hasOwnProperty(id)) {
        const c = childs[id]
        if (minWidth < c.x + c.width) minWidth = c.x + c.width
        if (minHeight < c.y + c.height) minHeight = c.y + c.height
      }
    }
    if (/Left|Top/.test(state.coreActionType)) {
      if (!/RightTop/.test(state.coreActionType)) {
        maxWidth = c.width + c.x
        maxX = c.x + c.width - minWidth
      }
      if (!/LeftBottom/.test(state.coreActionType)) {
        maxHeight = c.height + c.y
        maxY = c.y + c.height - minHeight
      }
    }
    state.coreBounds = {
      x: [ 0, maxX ],
      y: [ 0, maxY ],
      width: [ minWidth, maxWidth ],
      height: [ minHeight, maxHeight ]
    }
  },
  CREATE_WIDGET (state, widget = {}) {
    const cId = widget.container_id
    if (cId) {
      if (!state.coreWidgets[cId]) {
        Vue.set(state.coreWidgets, cId, [])
      }
      state.coreWidgets[cId].push(widget)
    }
  },
  CHANGE_ORDER_SCENE (state, params = {}) {
    const scenes = state.coreGraph[0]
    console.log(scenes)
    console.log(params)
    for (let prop in scenes) {
      scenes[prop].order = params[prop].order
    }
  },
  CHANGE_SCENES_ORDERS (state, list = []) {
    const hash = {}
    const old = {}
    const newParams = {}
    const orders = list.map(e => e.order).sort()
    const scenes = state.coreGraph[0]
    for (let prop in scenes) {
      old[prop] = {}
      for (let prop2 in scenes[prop]) {
        old[prop][prop2] = scenes[prop][prop2]
      }
    }
    list.forEach((e, i) => hash[e.id] = orders[i])
    for (let id in hash) {
      if (hash.hasOwnProperty(id) && scenes[id]) {
        scenes[id].order = hash[id]
      }
    }
    for (let prop in scenes) {
      newParams[prop] = {}
      for (let prop2 in scenes[prop]) {
        newParams[prop][prop2] = scenes[prop][prop2]
      }
    }
    const command = {
      type: 'updateScenesOrder',
      context: { type: 'scene' },
      newParams: newParams,
      oldParams: old
    }
    const last = state.coreHistory[state.coreHistoryState]
    if (!isEqual(last, command)) {
      state.coreHistory.splice(state.coreHistoryState)
      state.coreHistory.push(command)
      state.coreHistoryState = state.coreHistory.length
    }
  },
  CREATE_CONTAINER (state, container = {}) {
    const id = container.id
    const pId = container.parent_id
    if (!state.coreGraph[pId]) {
      Vue.set(state.coreGraph, pId, {})
    }
    if (!state.coreCapacity[pId]) {
      Vue.set(state.coreCapacity, pId, 0)
    }
    state.coreCapacity[pId]++
    state.coreBackRelation[id] = pId
    Vue.set(state.coreCapacity, id, 0)
    Vue.set(state.coreGraph[pId], id, container)
    if (pId === 0) {
      state.coreActiveSceneId = id
    } else {
      state.coreParentContainer = state.coreGraph[state.coreBackRelation[pId]][pId]
    }
    state.coreActiveContainerId = id
    state.coreActiveContainer = state.coreGraph[pId][id]
  },
  DELETE_CONTAINER (state, params = {}) {
    const { id } = params
    const pId = state.coreBackRelation[id]
    if (state.coreCapacity[pId] > 0) {
      state.coreCapacity[pId]--
    }
    Vue.delete(state.coreGraph[pId], id)
    if (pId) {
      state.coreActiveContainer = {}
      state.coreActiveContainerId = 0
    } else {
      state.coreActiveSceneId = +Object.keys(state.coreGraph[0])[0]
    }
    delete state.coreBackRelation[id]
  },
  CREATE_GRAPH (state, containers = []) {
    const g = {}
    const p = {}
    const c = {}
    for (let i = containers.length; i;) {
      const e = containers[--i]
      const pId = e.parent_id
      if (!g[pId]) Vue.set(g, pId, {})
      if (!c[pId]) Vue.set(c, pId, 0)
      Vue.set(g[pId], e.id, e)
      p[e.id] = pId
      c[pId]++;
    }
    state.coreGraph = g
    state.coreCapacity = c
    state.coreBackRelation = p
    state.coreActiveSceneId = +Object.keys(g[0])[0]
    state.coreActiveContainerId = state.coreActiveSceneId
  },
  DISTRIBUTE_WIDGETS (state, widgets = []) {
    const w = {}
    for (let i = widgets.length; i;) {
      const e = widgets[--i]
      const cId = e.container_id
      if (!w[cId]) Vue.set(w, cId, [])
      w[cId].push(e)
    }
    for (let cId in w) {
      w[cId].sort((a, b) => a.order - b.order)
    }
    state.coreWidgets = w
  },
  UPDATE_WIDGETS_ORDER (state, widgets = []) {
    if (!widgets.length) return
    const orders = {}
    const cId = widgets[0].container_id
    const o = widgets.map(e => e.order).sort()
    widgets.forEach((e, i) => orders[e.id] = o[i])
    state.coreWidgets[cId].forEach(e => {
      e.order = orders[e.id]
    })
    state.coreWidgets[cId].sort((a, b) => a.order - b.order)
  },
  UPDATE_WIDGET_PROPS (state, params = {}) {
    const cId = params.container_id
    const wId = params.id
    console.log(params)
    const w = (state.coreWidgets[cId] || []).find(e => e.id === wId)
    if (!w) return
    for (let prop in params) {
      if (params.hasOwnProperty(prop)) {
        w[prop] = params[prop]
      }
    }
  },
  RESET_WIDGETS_LIST (state, widgets = []) {
    state.coreWidgets = widgets
  },
  // End of Core
  UPDATE_TEMPLATE_RIGHTS (state, rights = []) {
    const r = {}
    rights.forEach(e => {      
      r[e.id] = {
        edit_props: e.edit_props,
        edit_playlist: e.edit_playlist
      }
    })
    state.rights = r
  },
  // UPDATE_TEMPLATE_PROPS (state, options = {}) {
  //   merge(state.template, options)
  // },
  CHANGE_SCALE (state, options) {
    state.scale = options.newZoom
  },
  UPLOAD_TEMPLATES (state, options) {
    state.templates = options
  },
  UPLOAD_TEMPLATE (state, options) {
    state.template = options
  },
  ADD_CONTAINER (state, container = {}) {
    state.containerTree.push(container)
  },
  CHANGE_CONTAINER_STATE (state, options = {}) {
    if (options.type === 'container') {
      state.editorHistory.history.push({
        type: "ChangeContainer", data: options.old, newData: options.new
      })
      if (state.editorHistory.changedContainers.indexOf(options.old.id) == -1) {
        state.editorHistory.changedContainers.push(options.old.id)
      }
    }
    if (options.type === 'widget') {
      state.editorHistory.history.push({
        type: "ChangeWidget", data: options.old, newData: options.new
      })
      if (state.editorHistory.changedWidgets.indexOf(options.old.id) == -1) {
        state.editorHistory.changedWidgets.push(options.old.id)
      }
    }
    if (options.type === 'order') {
      state.editorHistory.history.push({
        type: "ChangeOrder", data: options.old, newData: options.new
      })
      options.old.forEach((elem)=>{
        if (state.editorHistory.changedWidgets.indexOf(elem.id) == -1) {
          state.editorHistory.changedWidgets.push(elem.id)
        }
      })
    }
    if (options.type === 'scenesOrder') {
      state.editorHistory.history.push({
        type: "ChangeScenesOrder", data: options.old, newData: options.new
      })
      options.old.forEach((elem)=>{
        if (state.editorHistory.changedContainers.indexOf(elem.id) == -1) {
          state.editorHistory.changedContainers.push(elem.id)
        }
      })
    }
    if (state.editorHistory.currentStep === state.editorHistory.lastStep) {
      ++state.editorHistory.lastStep
      ++state.editorHistory.currentStep
    } else {
      for (let i = state.editorHistory.history.length - 1; i !== -1; --i) {
        if (i > state.editorHistory.currentStep) {
          state.editorHistory.history.splice(state.editorHistory.history.indexOf(i), 1)
        }
      }
      ++state.editorHistory.currentStep
      state.editorHistory.lastStep = state.editorHistory.currentStep
    }        
  },
  UNDO (state) {
    state.editorHistory.currentStep = state.editorHistory.currentStep - 1
    if (state.editorHistory.history[state.editorHistory.currentStep].type === "ChangeContainer") {
      for (let i = state.containerTree.length - 1; i !== -1; --i) {
        if (state.containerTree[i].id === state.editorHistory.history[state.editorHistory.currentStep].data.id) {
          state.containerTree[i] = Object.assign(state.containerTree[i],state.editorHistory.history[state.editorHistory.currentStep].data)
          if (!state.containerTree[i].show) {
            for (let i = state.containerTree.length - 1; i !== -1; --i) {
              if (state.containerTree[i].id === state.editorHistory.history[state.editorHistory.currentStep].data.parent_id) {
                state.currentContainer = state.containerTree[i].id
                state.container = state.containerTree[i]
              }
            }
          } else {
            state.currentContainer = state.editorHistory.history[state.editorHistory.currentStep].data.id
            state.container = state.containerTree[i]
          }
        }
      }      
    }
    if (state.editorHistory.history[state.editorHistory.currentStep].type === "ChangeWidget") {
      for (let i = state.widgets.length - 1; i !== -1; --i) {
        if (state.widgets[i].id === state.editorHistory.history[state.editorHistory.currentStep].data.id) {
          state.widgets[i] = Object.assign(state.widgets[i],state.editorHistory.history[state.editorHistory.currentStep].data)
        }
      }      
    }
    if (state.editorHistory.history[state.editorHistory.currentStep].type === "ChangeOrder") {
      state.editorHistory.history[state.editorHistory.currentStep].data.forEach((elem)=>{
        for (let i = state.widgets.length - 1; i !== -1; --i) {
          if (state.widgets[i].id === elem.id) {
            state.widgets[i] = Object.assign(state.widgets[i],elem)
          }
        } 
      })           
    }
  },
  REDO (state) {
    state.editorHistory.currentStep = state.editorHistory.currentStep + 1
    if (state.editorHistory.history[state.editorHistory.currentStep - 1].type === "ChangeContainer") {
      for (let i = state.containerTree.length - 1; i !== -1; --i) {
        if (state.containerTree[i].id === state.editorHistory.history[state.editorHistory.currentStep - 1].data.id) {
          state.containerTree[i] = Object.assign(state.containerTree[i],state.editorHistory.history[state.editorHistory.currentStep - 1].newData)
          if (!state.containerTree[i].show) {
            for (let i = state.containerTree.length - 1; i !== -1; --i) {
              if (state.containerTree[i].id === state.editorHistory.history[state.editorHistory.currentStep - 1].data.parent_id) {
                state.currentContainer = state.containerTree[i].id
                state.container = state.containerTree[i]
              }
            }
          } else {
            state.currentContainer = state.editorHistory.history[state.editorHistory.currentStep - 1].data.id
            state.container = state.containerTree[i]
          }
        }
      }
    }
    if (state.editorHistory.history[state.editorHistory.currentStep - 1].type === "ChangeWidget") {
      for (let i = state.widgets.length - 1; i !== -1; --i) {
        if (state.widgets[i].id === state.editorHistory.history[state.editorHistory.currentStep - 1].data.id) {
          state.widgets[i] = Object.assign(state.widgets[i],state.editorHistory.history[state.editorHistory.currentStep - 1].newData)
        }
      }      
    }
    if (state.editorHistory.history[state.editorHistory.currentStep - 1].type === "ChangeOrder") {
      state.editorHistory.history[state.editorHistory.currentStep - 1].newData.forEach((elem)=>{
        for (let i = state.widgets.length - 1; i !== -1; --i) {
          if (state.widgets[i].id === elem.id) {
            state.widgets[i] = Object.assign(state.widgets[i],elem)
          }
        } 
      })           
    }    
  },
  SAVE (state) {
    state.editorHistory.currentStep = 0
    state.editorHistory.lastStep = 0
    state.editorHistory.history = []
    state.editorHistory.changedContainers = []
    state.editorHistory.changedWidgets = []
  },
  TOGGLE_TEMPLATE_OBJECT (state, obj = {}) {
    state.template = obj 
    state.targetTemplate = obj 
  },
  SORT_TEMPLATES (state, options) {
    const compare = getComporator(options.key, options.direction)
    state.templates.sort((a, b) => compare(a, b))
  },
  SORT_TEMPLATES_INITIAL (state) {
    for (let key in state.sortingDirectionsTemplates) {
      if (state.sortingDirectionsTemplates.hasOwnProperty(key)) {
        const direction = state.sortingDirectionsTemplates[key]
        if (direction === 0) continue
        let compare = getComporator(key, direction)
        state.templates.sort((a, b) => compare(b, a))
      }
    }
  },
  UPDATE_SORTING_DIRECTION_TEMPLATES (state, options) {
    for (let key in state.sortingDirectionsTemplates) {
      state.sortingDirectionsTemplates[key] = options.hasOwnProperty(key) ? options[key] : 0
    }
  },
  DELETE_TEMPLATE_OBJECTS (state) {
    const i = state.templates.indexOf(state.targetTemplate)
    if (i !== -1) {
      state.templates.splice(i, 1)
      state.targetTemplate = {}
    }
  },
  UPDATE_TEMPLATES (state, obj) {
    state.templates.push(obj)
  },
  UPDATE_CONTAINER_TREE (state, data = []) {
    state.containerTree = data
  },
  UPDATE_SEARCH_RES (state, data = []){
    state.searchRes = data
  },
  CHANGE_TIMELINE_MODAL_SETTINGS (state, type) {
    if (type === 'container' || type === 'widget') {
      state.timelineModalType = type
      merge(
        state.timelineSettings,
        defaultTimeline,
        JSON.parse(state.container.timeline || '{}')
      )
    }
  },
  CHANGE_CURRENT_CONTAINER (state, id) {
    state.currentContainer = id
  },
  CHANGE_CURRENT_SCENE (state, id) {
    state.currentScene = id
  },
  DELETE_CONTAINER_OBJECTS (state, id) {
    for (let i = state.containerTree.length - 1; i !== -1; --i) {
      if (state.containerTree[i].id === id) {
        state.containerTree[i].show = false
      }
    } 
  },
  CHANGE_CONTAINER_PROPERTIES (state, obj) {
    state.container = Object.assign(state.container, obj)
  },
  GET_CONTAINER_PROPERTIES (state, id) {
    for (let i = state.containerTree.length - 1; i !== -1; --i) {
      if (state.containerTree[i].id === id) {
        state.container = state.containerTree[i]
      }
    }
    if (!state.container.background_color) {
      state.container.background_color = 'rgba(255,255,255,1)'
    }
  },
  RESET_CONTAINER_PROPERTIES (state) {
    state.container = {}
  },
  SELECT_MEDIA_ELEMENT (state, media = {}) {
    state.timelineModalType = 'widget'
    state.changingWidgetId = media.id
    merge(
      state.timelineSettings,
      defaultTimeline,
      JSON.parse(media.timeline || '{}')
    )
  },
  UPDATE_START_TIME (state, value) {
    if (state.timelineSettings && state.timelineSettings.timeline) {
      state.timelineSettings.timeline.start = value
    }
  },
  UPDATE_END_TIME (state, value) {
    if (state.timelineSettings && state.timelineSettings.timeline) {
      state.timelineSettings.timeline.end = value
    }
  },
  // Start of Widget Mutations block
  UPDATE_LIST_OF_WIDGETS (state, widgets = []) {
    state.widgets = widgets
  },
  ADD_WIDGET (state, widget = {}) {
    const order = state.widgets.length
    state.widgets.push(widget)
  },
  REMOVE_WIDGET (state, id) {
    const i = state.widgets.findIndex(e => e.id === id)
    if (i !== -1) state.widgets[i].show = false
  },
  UPDATE_WIDGET (state, options = {}) {
    const id = options.id
    const widget = state.widgets.find(e => e.id === id)
    merge(widget, options)
  },
  CHANGE_MEDIA_ORDER (state, widgets = []) {
    let orders = widgets.map(e => e.order).sort()
    widgets.forEach((w, i) => {
      let widget = state.widgets.find(e => e.id === w.id)
      if (widget) widget.order = orders[i]
    })
  },
  // End of Widget Mutations block
  CHANGE_SCENE_ORDER (state, scenes = []) {
    let orders = scenes.map(e => e.order).sort()
    scenes.forEach((w, i) => {
      let widget = state.containerTree.find(e => e.id === w.id)
      if (widget) widget.order = orders[i]
    })
  },
  UPDATE_PASSPORT (state, data) {
    state.passport = data
  },
  UPDATE_MEDIA_PLAYLIST_ITEM (state, data) {
    let selection = data.obj.id
    let item = state.coreWidgets[state.coreActiveContainerId].find(e => e.id === selection)
    item.timeline = JSON.stringify(data.timeline)
  },
  OPEN_PARENT (state, data) {
    state.openParent = data
  },
  CHANGE_LOADING_STATE (state, data) {
    console.log(data)
    state.loading = data
  },
  TOOGLE_TEMPLATE_LOADING (state, value) {
    state.templateLoading = value
  },
  UNPUBLISH (state) {
    state.coreTemplate.published = false
  },
  PUBLISH (state) {
    state.coreTemplate.published = true
  },
  TOGGLE_TEMPLATE_EDITED_BY (state) {
    state.coreTemplate.edited_by = state.passport.name
    state.coreTemplate.updated_at = moment.utc()
  },
  SET_PRESENTATION_CONTENT (state, presentation) {
    state.presentation = presentation
  },
  ADD_MAP(state, key) {
    state.maps.push(key)
  },
  REMOVE_MAP(state, key) {
    state.maps = state.maps.filter(item => item !== key)
  },
  SET_FONTS_INFO(state, fontsInfo) {
    state.fontsInfo = fontsInfo
  }
}
