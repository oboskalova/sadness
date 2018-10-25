import * as api from '../../../api/template-editor'
import TemplateAPI from '../../../api/template'
import ContainerAPI from '../../../api/container'
import WidgetAPI from '../../../api/widget'
import { isArray, capitalize } from '../../../helpers'

const oppositeActionsMap = {
  'updateContainerProps': 'updateContainerProps',
  'updateWidgetProps': 'updateWidgetProps',
  'updateScenesOrder': 'updateScenesOrder',
  'updateMediaOrder': 'updateMediaOrder'
}

const changeContextStrategies = {
  updateContainerProps: ({ commit }, context = {}) => {
    const { id } = context
    commit('CHANGE_CONTAINER', id)
  }
}

export default {
  // Core
  historyClear ({ commit }) {
    commit('HISTORY_CLEAR')
  },
  historySave ({ state, getters, commit }, data = {}) {
    const changes = { container: [], widget: [] }
    for (let i = 0; i < state.coreHistoryState; i++) {
      const s = state.coreHistory[i]
      if (s.context && s.context.type) {
        const type = s.context.type
        console.log(type)
        var single = true
        if (type === 'scene') {
          for (let prop in state.coreGraph[0]) {
            changes['container'].push(state.coreGraph[0][prop])
          }
          single = false
        }
        if (type === 'playlist') {
          for (let prop in state.coreWidgets[s.context.id]) {
            changes['widget'].push(state.coreWidgets[s.context.id][prop])
          }
          single = false
        }
        if (single) {
          changes[type].push(getters[`core${capitalize(type)}ById`](s.context.id))
        }
      }
    }
    var success = true
    var savedTemp = false
    var savedCont = false
    var savedWidg = false
    var canAlert = true

    if (changes.template) {
      TemplateAPI.update(changes.template,
        data => {
          if (data.id) {
            console.log(data)
            savedTemp = true
          } else {
            success = false
          }
          trySave()
        },
        () => {
          success = false
          trySave()
        })
    } else {
      savedTemp = true
    }
    
    if (changes.container.length) {
      ContainerAPI.update(changes.container,
        data => {
          if (data === 'success') {
            console.log('cont')
            savedCont = true
          } else {
            success = false
            trySave()
          }
          trySave()
        },
        () => {
          success = false
          trySave()
        })
    } else {
      savedCont = true
    }
    if (changes.widget.length) {
      WidgetAPI.update(changes.widget,
        data => {
          if (data === 'success') {
            console.log('widg')
            savedWidg = true
          } else {
            success = false
          }
          trySave()
        },
        () => {
          success = false
        })
    } else {
      savedWidg = true
    }
    var trySave = () => {
      console.log('try save')
      if (!success) {
        console.log('not saved')
        if (canAlert) {
          alert("Возникла ошибка при сохранении, попробуйте ещё раз сохранить")
          canAlert = false
        }
        return
      }
      if (savedTemp && savedCont && savedWidg && success) {
        api.publishTemplateObject({ id: data.id, status: false }).then(response => {
          console.log(response)
        }).catch(error => {
          console.log(error)
        })
        commit('UNPUBLISH')
        commit('TOGGLE_TEMPLATE_EDITED_BY')
        console.log('saved')
        commit('HISTORY_CLEAR')
        // data.sockets.sendData('update', { template: data.id })
        return
      }
    }
  },
  historyPush ({ commit }, command = {}) {
    commit('HISTORY_PUSH', command)
  },
  historyExecute ({ dispatch }, command = {}) {
    const { type, params } = command
    dispatch('historyChangeContext', command)
      .then(() => dispatch(type, params))
  },
  historyChangeContext (store, params = {}) {
    const { type, context } = params
    const fn = changeContextStrategies[type]
    if (typeof fn === 'function') fn(store, context)
    console.log('changeContext')
  },
  historyRollback ({ state, commit, dispatch }) {
    const historyState = state.coreHistoryState
    const historyLength = state.coreHistory.length
    if ((historyState > 0) && (historyState < historyLength + 1)) {
      const command = state.coreHistory[historyState - 1]
      const type = oppositeActionsMap[command.type]
      const params = command.oldParams
      if (type)
        dispatch('historyExecute', Object.assign({}, command, { type, params }))
    }
    commit('HISTORY_ROLLBACK')
  },
  historyForward ({ state, commit, dispatch }) {
    const historyState = state.coreHistoryState
    const historyLength = state.coreHistory.length
    if ((historyState > -1) && (historyState < historyLength)) {
      const command = state.coreHistory[historyState]
      const params = command.newParams
      dispatch('historyExecute', Object.assign({}, command, { params }))
    }
    commit('HISTORY_FORWARD')
  },
  None ({commit}, params = {}){
  },
  updateMediaOrder ({ commit }, params) {
    commit('UPDATE_WIDGETS_ORDER', params)
  },
  updatingTypeMove ({ commit }, params = {}) {
    commit('UPDATE_CONTAINER_PROPS', {
      x: params.x + params.dx,
      y: params.y + params.dy
    })
  },
  updatingTypeTop ({ commit }, params = {}) {
    commit('UPDATE_CONTAINER_PROPS', {
      y: params.y + params.dy,
      height: params.height - params.dy
    })
  },
  updatingTypeLeft ({ commit }, params = {}) {
    commit('UPDATE_CONTAINER_PROPS', {
      x: params.x + params.dx,
      width: params.width - params.dx
    })
  },
  updatingTypeRight ({ commit }, params = {}) {
    commit('UPDATE_CONTAINER_PROPS', {
      width: params.width + params.dx
    })
  },
  updatingTypeBottom ({ commit }, params = {}) {
    commit('UPDATE_CONTAINER_PROPS', {
      height: params.height + params.dy
    })
  },
  updatingTypeLeftTop ({ commit }, params = {}) {
    commit('UPDATE_CONTAINER_PROPS', {
      x: params.x + params.dx,
      y: params.y + params.dy,
      width: params.width - params.dx,
      height: params.height - params.dy
    })
  },
  updatingTypeLeftBottom ({ commit }, params = {}) {
    commit('UPDATE_CONTAINER_PROPS', {
      x: params.x + params.dx,
      width: params.width - params.dx,
      height: params.height + params.dy
    })
  },
  updatingTypeRightTop ({ commit }, params = {}) {
    commit('UPDATE_CONTAINER_PROPS', {
      y: params.y + params.dy,
      width: params.width + params.dx,
      height: params.height - params.dy
    })
  },
  updatingTypeRightButton ({ commit }, params = {}) {
    commit('UPDATE_CONTAINER_PROPS', {
      width: params.width + params.dx,
      height: params.height + params.dy
    })
  },
  fetchTemplate ({ commit }, params = {}) {
    return TemplateAPI.fetch(params, t => {
      t.background = JSON.parse(t.background_color)
      commit('UPDATE_TEMPLATE', t)
      commit('UPDATE_RIGHTS', JSON.parse(t.rights))
    })
  },
  createTemplate ({ commit }, params = {}) {
    return TemplateAPI.create(params, t => {
      commit('CREATE_TEMPLATE', t)
    })
  },
  updateScenesOrder ({ commit }, props = {}) {
    commit('CHANGE_ORDER_SCENE', props)
  },
  updateTemplate ({ commit }, params = {}) {
    return TemplateAPI.update(params, t => {
      commit('UPDATE_TEMPLATE_PROPS', t)
      commit('RESIZE_SCENES')
    })
  },
  fetchContainersOf ({ state, commit }, params = {}) {
    return ContainerAPI.fetchAllOf(params, c => {
      commit('CREATE_GRAPH', c)
      let targetSceneId = 0
      let min = Infinity
      const scenes = state.coreGraph[0]
      for (let sId in scenes) {
        const s = scenes[sId]
        if (s.order < min) {
          min = s.order
          targetSceneId = s.id
        }
      }
      commit('CHANGE_CONTAINER', targetSceneId)
      commit('CHANGE_LOADING_STATE', false)
    })
  },
  fetchWidgetsOf ({ commit }, params = {}) {
    return WidgetAPI.fetchAllOf(params, w => {
      commit('DISTRIBUTE_WIDGETS', w)
    })
  },
  createWidget ({ commit }, params = {}) {
    return WidgetAPI.create(params, w => {
      commit('CREATE_WIDGET', w)
      return w
    })
  },
  createContainer ({ state, commit, dispatch }, params = {}) {
    return ContainerAPI.create(params, c => {
      commit('CREATE_CONTAINER', c)
      const command = {
        type: 'updateContainerProps',
        context: { id: c.id, type: 'container'},
        newParams: { show: true },
        oldParams: { show: false }
      }
      dispatch('historyPush', command)
      // commit('UPDATE_BOUNDS')
    })
  },
  deleteContainer ({ state, commit, dispatch }, params = {}) {
    const id = params.id
    const pId = state.coreBackRelation[id]
    const command = {
      type: 'updateContainerProps',
      context: { id, type: 'container'},
      newParams: { show: false },
      oldParams: { show: true }
    }
    let newActive = id
    commit('UPDATE_CONTAINER_PROPS', { show: false })
    dispatch('historyPush', command)
    if (pId) {
      // If container is deleting we need to find the scene id which contains it
      while (state.coreBackRelation[newActive]) {
        newActive = state.coreBackRelation[newActive]
      }
    } else {
      // If scene is deleting we need to find id of the first scene
      const scenes = state.coreGraph[0]
      let min = Infinity
      for (let sId in scenes) {
        const s = scenes[sId]
        if (s.show && s.order < min) {
          min = s.order
          newActive = s.id
        }
      }
    }
    commit('CHANGE_CONTAINER', newActive)
  },
  updateContainerProps ({ state, commit, dispatch }, props = {}) {
    commit('UPDATE_CONTAINER_PROPS', props)
    if (props.show === false) {
      const id = state.coreActiveContainer.id
      const pId = state.coreBackRelation[id]
      let newActive = id
      if (pId) {
        // If container is deleting we need to find the scene id which contains it
        while (state.coreBackRelation[newActive]) {
          newActive = state.coreBackRelation[newActive]
        }
      } else {
        // If scene is deleting we need to find id of the first scene
        const scenes = state.coreGraph[0]
        let min = Infinity
        for (let sId in scenes) {
          const s = scenes[sId]
          if (s.show && s.order < min) {
            min = s.order
            newActive = s.id
          }
        }
      }
      commit('CHANGE_CONTAINER', newActive)
    }
  },
  updateChosedContainerProps ({ state, commit, dispatch }, data = {}) {
    const props = data.props
    const id = data.id
    console.log('action data', data)
    commit('UPDATE_CHOSED_CONTAINER_PROPS', { id, props })
    if (props.show === false) {
      const id = state.coreActiveContainer.id
      const pId = state.coreBackRelation[id]
      let newActive = id
      if (pId) {
        // If container is deleting we need to find the scene id which contains it
        while (state.coreBackRelation[newActive]) {
          newActive = state.coreBackRelation[newActive]
        }
      } else {
        // If scene is deleting we need to find id of the first scene
        const scenes = state.coreGraph[0]
        let min = Infinity
        for (let sId in scenes) {
          const s = scenes[sId]
          if (s.show && s.order < min) {
            min = s.order
            newActive = s.id
          }
        }
      }
      commit('CHANGE_CONTAINER', newActive)
    }
  },
  updateWidgetProps ({ commit }, props = {}) {
    commit('UPDATE_WIDGET_PROPS', props)
  },
  updateActionType ({ commit }, type) {
    commit('CHANGE_ACTION_TYPE', type)
    // commit('UPDATE_BOUNDS')
  },
  selectContainer ({ commit }, id) {
    commit('CHANGE_CONTAINER', id)
    // commit('UPDATE_BOUNDS')
  },
  // End of Core
  fetchTemplates ({ commit }) {
    commit('UPLOAD_TEMPLATES', [])
    return api.getTemplateObjects().then(response => {
      commit('UPLOAD_TEMPLATES', response.data)
    })
  },
  updateContainersTree ({ commit }, id) {
    return api.getContainerTree(id).then(response => {
      const data = response.data.map(e => {
        return !isArray(e.playlist) ? Object.assign({}, e, { playlist: [] }) : e
      })
      commit('UPDATE_CONTAINER_TREE', data)
    })
  },
  saveChanges ({ commit }, data = {}) {
    api.saveContainerChanges(data.containers).then(response => {
      console.log(response)
    })
    api.updateWidget(data.media).then(response => {
      console.log(response)
      commit('SAVE') })
  },
  uploadTemplates ({ commit }, options = []) {
    commit('UPLOAD_TEMPLATES', options)
    commit('SORT_TEMPLATES_INITIAL')
  },
  uploadTemplate ({ commit }, options = {}) {
    const rights = JSON.parse(options.rights)
    commit('UPLOAD_TEMPLATE', options)
    commit('UPDATE_TEMPLATE_RIGHTS', rights)
  },
  updateTemplates ({ commit }, obj = {}) {
    commit('UPDATE_TEMPLATES', obj)
  },
  sortTemplates ({ commit }, options = {}) {
    commit('SORT_TEMPLATES', options)
  },
  updateSortingDirectionTemplates ({ commit }, options = {}) {
    commit('UPDATE_SORTING_DIRECTION_TEMPLATES', options)
  },
  changeCurrentContainer ({ commit }, obj) {
    commit('CHANGE_CURRENT_CONTAINER', obj)
  },
  changeMediaOrder ({ commit }, playlist = []) {
    commit('CHANGE_MEDIA_ORDER', playlist)
  },
  changeSceneOrder ({ commit }, playlist = []) {
    commit('CHANGE_SCENE_ORDER', playlist)
  },
  // Start of Widget Actions block
  getMediaElements ({ commit }, options = {}) {
    return api.getWidgets(options).then(response => {
      const widgets = response.data
      commit('UPDATE_LIST_OF_WIDGETS', widgets)
    })
  },
  createMediaElement ({ commit }, widget = {}) {
    return api.createWidget(widget)
      .then(response => {
        const mediaElement = response.data
        commit('ADD_WIDGET', mediaElement)
        var oldData = {}
        var newData = {}
        for (let key in mediaElement) { oldData[key] = mediaElement[key] }
        for (let key in mediaElement) { newData[key] = mediaElement[key] }
        oldData.show = false
        commit('CHANGE_CONTAINER_STATE', { type: 'widget', old: oldData, new: newData })
      })
      .catch(error => {
        const messageType = 'notCreatedWidget'
        const responseCode = error.response.status
        commit('DISPLAY_ALERT', { messageType, responseCode })
      })
  },
  removeMediaElement ({ commit }, id) {
    if (id == null) return
    commit('REMOVE_WIDGET', id)
  },
  sendPresentation ({ commit }, formData) {
    console.log('отправляем ppt/pptx в бэк')
    return new Promise((resolve, reject) => {
      const result = {}

      setTimeout(() => {
        if (result.error) {
          resolve('fail')
        } else {
          resolve('success')
        }
      }, 1500)
    })
  },
  getPdf ({ commit }) {
    return new Promise((resolve, reject) => {
      const result = {
        content: {
          url: '/static/test2.pdf',
          intervalTime: 3,
          effectType: 'fade'
        }
      }

      commit('SET_PRESENTATION_CONTENT', result)
    })
  },
  setFontsInfo ({ commit }, fontsInfo) {
    commit('SET_FONTS_INFO', fontsInfo)
  },
  // End of Widget Actions block
}
