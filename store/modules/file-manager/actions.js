import { createDriveObject, getDriveTree, getDriveObject } from '../../../api/file-manager'

export default {
  uploadFile ({ commit }, options = {}) {
    const id = options.id
    const name = options.name
    const source = options.source
    options.onUploadProgress = event => {
      const loaded = event.loaded
      const total = event.total
      commit('UPDATE_UPLOAD_PROGRESS', { id, name, loaded, total, source })
    }
    return createDriveObject(options)
  },
  updateDriveTree ({ commit }) {
    return getDriveTree().then(response => {
      commit('UPDATE_DRIVE_TREE', response.data)
    })
  },
  reloadCatalogue ({ commit }, catalogueId) {
    getDriveObject(catalogueId).then(response => {
      const data = response.data
      if (response.status === 200 && data.type === 0) {
        commit('UPLOAD_CATALOGUE', data)
      }
    })
  },
  updateDestCatalogue ({ commit }, id) {
    commit('UPDATE_DEST_CATALOGUE', id)
  },
  deleteCatalogueObject ({ commit }) {
    commit('DELETE_CATALOGUE_OBJECTS')
  },
  renameCatalogueObject ({ commit }, options = {}) {
    commit('RENAME_CATALOGUE_OBJECT', options)
  },
  updateCatalogue ({ commit }, obj = {}) {
    commit('UPDATE_CATALOGUE', obj)
  },
  uploadCatalogue ({ commit }, options = {}) {
    if (options.isSearching) {
      commit('UPDATE_SEARCH_RESULTS', options.data)
    } else {
      commit('UPLOAD_CATALOGUE', options)
      commit('SORT_CATALOGUE_INITIAL')
    }
  },
  stopSearching ({ commit }) {
    commit('UPDATE_SEARCH_QUERY', '')
    commit('CHANGE_SEARCHING_MODE', false)
  },
  sortCatalogue ({ commit }, options = {}) {
    commit('SORT_CATALOGUE', options)
  },
  updateSortingDirection ({ commit }, options = {}) {
    commit('UPDATE_SORTING_DIRECTION', options)
  }
}
