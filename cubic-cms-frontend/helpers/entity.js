import { assign, clone } from 'lodash'

const container = {
  fix: function () {},
  update: function () {
    const timeline = JSON.stringify(assign({}, this.timelineSettings))
    const oldData = clone(this.container)
    this.$store.commit('CHANGE_CONTAINER_PROPERTIES', { timeline })
    const newData = clone(this.container)
    this.$store.commit('CHANGE_CONTAINER_STATE', {
      type: 'container',
      old: oldData,
      new: newData
    })
  }
}

const widget = {
  fix: function () {
    const timeline = JSON.stringify(assign({}, this.timelineSettings))
    this.oldMedia = {}
    this.oldMedia.timeline = timeline
    this.oldMedia.id = this.changingMediaElementId
  },
  update: function () {
    const timeline = JSON.stringify(assign({}, this.timelineSettings))
    this.newMedia = {}
    this.newMedia.id = this.changingMediaElementId
    this.newMedia.timeline = timeline
    this.$store.commit('CHANGE_CONTAINER_STATE', {
      type: 'widget',
      old: this.oldMedia,
      new: this.newMedia
    })
    this.$store.commit('UPDATE_WIDGET', {
      id: this.changingMediaElementId,
      timeline: timeline
    })
  }
}

const entity = {
  context: {
    container, widget
  },
  installTo: function (obj) {
    for (let contextName in this.context) {
      if (this.context.hasOwnProperty(contextName)) {
        const context = this.context[contextName]
        this[contextName] = {}
        for (let strategyName in context) {
          const strategy = context[strategyName]
          if (context.hasOwnProperty(strategyName) && typeof strategy === 'function') {
            this[contextName][strategyName] = strategy.bind(obj)
          }
        }
      }
    }
  }
}

export default entity