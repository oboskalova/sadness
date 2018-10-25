import { baseUrl } from '../../../api/config'

export default {
  requestedCatalogue (state) {
    return state.requestedCatalogue
  },
  searchQuery (state) {
    return state.searchQuery
  },
  searchResults (state) {
    return state.searchResults
  },
  searchingMode (state) {
    return state.searchingMode
  },
  alertType (state) {
    return state.alertType
  },
  alertMessage (state) {
    return state.alertMessage
  },
  breadcrumbList (state) {
    return state.breadcrumbList
  },
  dismissCountDown (state) {
    return state.dismissCountDown
  },
  uploadFiles (state) {
    return state.uploadFiles
  },
  inProcessFileNumber (state) {
    return state.uploadFiles.filter(f => !f.done).length
  },
  driveTree (state) {
    return state.driveTree
  },
  namesInCurrentCatalogue (state) {
    if (state.catalogue) {
      return state.catalogue.map(e => e.name)
    }
    return []
  },
  firstSelected (state) {
    if (state.catalogue) {
      return state.catalogue.find(e => e.isChoosed) || {}
    }
    return {}
  },
  movingMode (state) {
    return state.movingMode
  },
  movingObjects (state) {
    return state.movingObjects.slice(0)
  },
  numberOfChoosedObjects (state) {
    if (state.catalogue) {
      return state.catalogue.reduce((n, e) => e.isChoosed ? n + 1 : n, 0)
    }
    return 0
  },
  choosedObjects (state) {
    let ids = []
    if (state.catalogue) {
      state.catalogue.forEach(e => {
        if (e.isChoosed) ids.push(e.id)
      })
    }
    return ids
  },
  destCatalogueId (state) {
    return state.destCatalogueId
  },
  parentCatalogueId (state) {
    return state.parentCatalogueId
  },
  fileManagerCatalogue (state) {
    return state.catalogue
  },
  sortingDirections (state) {
    return state.sortingDirections
  },
  storagePath (state) {
    if (baseUrl.indexOf('http://api-staging.devcubic.ru') !== -1) {
      return 'http://api-staging.devcubic.ru/storage/temp/'
    } else {
      return 'https://visionapi.cubicservice.ru/storage/temp/'
    }
  }
}
