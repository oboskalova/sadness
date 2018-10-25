import { defaultTimeline } from '../../../../helpers/defaults'
import WidgetAPI from '../../../../api/widget.js'

const ModalWidgetHelper = class ModalWidgetHelper {
  constructor (store, createWidgetItem) {
    this._store = store
    this._createWidgetItem = createWidgetItem
  }

  get _container () {
    return this._store.getters.coreActiveContainer
  }

  get _templateId () {
    return this._store.getters.coreTemplate.id
  }

  get _allMedias () {
    const cId = this._container.id
    return this._store.getters.coreWidgets[cId] || []
  }

  createPlaylistItem ({wName, fId = undefined}, callback) {
    const cId = this._container.id
    if (cId) {
      let order = 0
      if (this._allMedias.length > 0) {
        const maxOrderMedia = this._allMedias.reduce((prev, cur) => (prev.order > cur.order) ? prev : cur)
        order = maxOrderMedia.order + 1
      }
      const widget = {
        name: wName,
        content: this._createWidgetItem(),
        container_id: cId,
        template_id: this._templateId,
        timeline: JSON.stringify(defaultTimeline),
        order
      }
      if (fId) {
        widget.file_id = fId
      }
      console.log('WIDGET: ', widget)
      this._store.dispatch('createWidget', widget)
        .then(w => {
          console.log('NEW WIDGET:', w)
          const params = { id: w.id, container_id: w.container_id, show: w.show }
          this._store.dispatch('historyPush', {
            type: 'updateWidgetProps',
            context: { id: w.id, type: 'widget' },
            oldParams: { ...params, show: false },
            newParams: params
          })
        })
    }
    if (typeof (callback) === 'function') callback()
  }

  _widgetHistoryPush (oldParams, newParams) {
    this._store.dispatch('historyPush', {
      type: 'updateWidgetProps',
      context: { id: oldParams.id, type: 'widget' },
      oldParams: oldParams,
      newParams: newParams
    })
  }

  changePlaylistItem ({wName, wId, fId = undefined}, callback) {
    if (Number.isInteger(wId)) {
      let widget = this._store.getters.coreWidgetById(wId)
      let oldWidget = {}
      let newWidget = {}
      for (let key in widget) {
        oldWidget[key] = widget[key]
        newWidget[key] = widget[key]
      }
      const cId = this._container.id
      if (cId) {
        newWidget.name = wName
        newWidget.content = this._createWidgetItem()
        newWidget.container_id = cId
      }
      if (fId) {
        newWidget.file_id = fId
        WidgetAPI.create(newWidget, w => {
          const res = { ...w, id: newWidget.id }

          this._store.dispatch('updateWidgetProps', res)
        })
      } else {
        this._store.dispatch('updateWidgetProps', newWidget)
        this._widgetHistoryPush(oldWidget, newWidget)
      }
    }
    if (typeof (callback) === 'function') callback()
  }

  static numberOfWidgets (widgets, widgetType) {
    let count = 1
    for (let w of widgets) {
      if (w.content) {
        let content = JSON.parse(w.content)
        count += content.type === widgetType ? 1 : 0
      }
    }
    return count
  }
}

export default ModalWidgetHelper
