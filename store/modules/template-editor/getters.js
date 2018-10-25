export default {
  coreTemplate (state) {
    return state.coreTemplate
  },
  coreActiveScene (state) {
    return state.coreActiveSceneId
  },
  coreActiveContainer (state) {
    return state.coreActiveContainer || {}
  },
  coreContainerById: (state) => (id) => {
    const parentId = state.coreBackRelation[id]
    if (parentId) {
      return state.coreGraph[parentId][id]
    } else {
      return state.coreGraph[0][id]
    }
  },
  coreWidgetById: (state) => (id) => {    
    for (let cId in state.coreWidgets) {
      const w = (state.coreWidgets[cId] || []).find(e => e.id === id)
      if (w) return w
    }
    return {}
  },
  loading (state) {
    return state.loading
  },
  coreActionType (state) {
    return state.coreActionType
  },
  coreGraph (state) {
    return state.coreGraph
  },
  coreBackRelation (state) {
    return state.coreBackRelation
  },
  coreCapacity (state) {
    return state.coreCapacity
  },
  coreScene (state) {
    return state.coreGraph[0] || {}
  },
  coreWidgets (state) {
    return state.coreWidgets || {}
  },
  rightsTo: (state) => (containerId) => {
    const rights = state.rights[containerId] || {}
    return Object.assign({ edit_props: false, edit_playlist: false }, rights)
  },
  scale (state) {
    return state.scale
  },
  historyMayRollback (state) {
    return (state.coreHistoryState > 0)
  },
  historyMayForward (state) {
    return (state.coreHistoryState < state.coreHistory.length)
  },
  historyMaySave (state) {
    return (state.coreHistoryState > 0)
  },
  containerTree (state) {
    return state.containerTree
  },
  currentScene (state) {
    return state.currentScene
  },
  currentContainer (state) {
    return state.currentContainer
  },
  currentTemplate (state) {
    return state.template
  },
  containerProperties (state) {
    return state.container
  },
  numberOfChoosedTemplates (state) {
    if (state.templates) {
      return state.templates.reduce((n, e) => e.isChoosed ? n + 1 : n, 0)
    }
    return 0
  },
  targetTemplate (state) {
    return state.targetTemplate
  },
  targetTemplateId (state) {
    if (state.targetTemplate.id) {
      return state.targetTemplate.id
    }
  },
  editorCatalogue (state) {
    return state.templates
  },
  sortingDirectionsTemplates (state) {
    return state.sortingDirectionsTemplates
  },
  editorHistory (state) {
    return state.editorHistory
  },
  mediaElements (state) {
    const containerId = state.currentContainer
    return state.widgets.filter(e => {
      return e.container_id === containerId
    }).sort((a, b) => {
      return a.order - b.order
    })
  },
  allMediaElements (state) {
    return state.widgets
  },
  changingWidgetId (state) {
    return state.changingWidgetId
  },
  timelineModalType (state) {
    return state.timelineModalType
  },
  openParent (state) {
    return state.openParent
  },
  sortingSearchDirections (state) {
    return state.sortingSearchDirections
  },
  searchRes (state) {
    return state.searchRes
  },
  searchWithTags (state) {
    return state.searchWithTags
  },
  searchTemplatesResults (state) {
    return state.searchTemplatesResults
  },
  searchTagResults (state) {
    return state.searchTagResults
  },
  templateLoading (state) {
    return state.templateLoading
  },
  pdfFile (state) {
    return state.presentation
  },
  allMaps (state) {
    return state.maps
  },
  mapById: (state) => (id) => {
    return state.maps.indexOf(id)
  },
  fontsInfo (state) {
    return state.fontsInfo
  }
}
