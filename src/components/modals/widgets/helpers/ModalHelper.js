import { defaultTimeline } from '../../../../../helpers/defaults'
import Lib from '../../../../lib'

export default class ModalHelper {
  static getMixin () {
    return {
      data () {
        return {
          mixin: {
            widgetHelper: new WidgetHelper(this.$store, this.createWidget)
          }
        }
      },
      computed: {
        modalWidgetContent: {
          get () {
            return this.$store.getters.modalWidgetContent
          },
          set (val) {
            this.$store.commit('SET_MODAL_WIDGET_CONTENT', val)
          }
        },
        modalWidgetType: {
          get () {
            return this.$store.getters.modalWidgetType
          },
          set (val) {
            this.$store.commit('SET_MODAL_WIDGET_TYPE', val)
          }
        },
        active: {
          get () {
            return this.modalWidgetType === this.widgetType
          },
          set (val) {
            if (val) this.modalWidgetType = this.widgetType
            else this.modalWidgetType = null
          }
        },
        isModify: {
          get () {
            const modalWidgetContent = this.modalWidgetContent
            console.log('isModify')
            console.log(modalWidgetContent)
            return modalWidgetContent && modalWidgetContent.type === this.widgetType
          }
        },
        container () {
          return this.$store.getters.coreActiveContainer
        },
        allMedias () {
          const cId = this.container.id
          return this.$store.getters.coreWidgets[cId] || []
        },
        scale () {
          return this.$store.getters.scale
        },
        numberOfWidgets () {
          let widgets = this.allMedias
          let widgetType = this.widgetType
          let count = 1
          for (let w of widgets) {
            if (w.content) {
              let content = JSON.parse(w.content)
              count += content.type === widgetType ? 1 : 0
            }
          }
          return count
        }
      },
      methods: {
        createPlaylistItem () {
          this.mixin.widgetHelper.createPlaylistItem({wName: this.name}, () => { this.active = false })
        },
        changePlaylistItem () {
          this.mixin.widgetHelper.changePlaylistItem({wName: this.name, wId: this.id}, () => { this.active = false })
        },
        createWidget () {
          let siteItem = Lib.cloneObj(this.widget)
          siteItem.type = this.widgetType
          console.log(siteItem)
          return JSON.stringify(siteItem)
        },
        setDataByDefault () {
          this.id = null
          this.name = this.nameDefault() + this.numberOfWidgets
          this.widget = this.widgetDefault()
          this.local = this.localDefault()
        },
        setDataByContent () {
          if (this.isModify) {
            const content = this.modalWidgetContent
            this.id = content.id
            this.name = content.name
            this.widget = Lib.cloneObj(content, new Set(['id', 'name']))
            this.local = this.localDefault()
          } else this.setDataByDefault()
        }
      }
    }
  }
}

const WidgetHelper = class WidgetHelper {
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

  createPlaylistItem ({wName}, callback) {
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
      console.log(widget)
      this._store.dispatch('createWidget', widget)
        .then(w => {
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

  changePlaylistItem ({wName, wId}, callback) {
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
      this._store.dispatch('updateWidgetProps', newWidget)
      this._widgetHistoryPush(oldWidget, newWidget)
    }
    if (typeof (callback) === 'function') callback()
  }
}
