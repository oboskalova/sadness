<template>
  <div class="search-media">
    <div class="search-media-wrap">
      <i class="mi mi-search search-media-icon"></i>
      <input
        :value="query"
        @input="inputHandler"
        class="search-media-input">
      <button
        v-if="!isQueryEmpty"
        @click="clearQuery"
        class="search-media-clear">
        очистить
      </button>
    </div>
    <div class="search-media-filter">
      <ul class="filter">
        <li class="filter-item filter-item--legend">
          Фильтровать по типу:
        </li>
        <li class="filter-item">
          <button
            class="filter-button"
            :class="{ 'filter-button--active': mask & 1 }"
            @click="toggleFilter(0)">
            картинки
          </button>
        </li>
        <li class="filter-item">
          <button
            class="filter-button"
            :class="{ 'filter-button--active': mask & 2 }"
            @click="toggleFilter(1)">
            видео
          </button>
        </li>
        <li class="filter-item">
          <button
            class="filter-button"
            :class="{ 'filter-button--active': mask & 4 }"
            @click="toggleFilter(2)">
            аудио
          </button>
        </li>
      </ul>
    </div>
    <breadcrumbs v-if="!searching"
      :list="breadcrumbs"
      :action="fetchCatalogue"
      class="search-media-breadcrumbs" />
    <div v-else
      class="search-media-query">
      Результаты поиска по запросу "{{ query }}"
    </div>
    <div class="row sorting-row no-gutters">
      <div class="col"></div>
      <div v-for="item in toolbarItems" class="col" :class="'col-' + item.width" :key="item.key">
        <button @click="sort(item.key)" class="sort-button">
          {{ item.text }}
          <i class="mi mi-arrow-drop-down" v-if="sortAscending(item.key)"></i>
          <i class="mi mi-arrow-drop-up" v-if="sortDescending(item.key)"></i>
        </button>
      </div>
    </div>
    <div class="search-media-files">
      <div v-if="loading">
        <img src="/static/img/spinner.gif" class="loader">
      </div>
      <div v-else-if="nothingFound">
        <span class="search-media-message">Ничего не найдено</span>
      </div>
      <div v-else>
        <FilesListItem v-for="(o, index) in searchResults"
          :key="o.id"
          :activeId="mediaElement.id"
          :mediaElements="mediaElements"
          :driveObject="o"
          @click.native="selectElement($event, index, o)"
          @dblclick.native="dblclickHandler(o)" />
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '../common/Breadcrumbs'
import FilesListItem from '../common/FilesListItem'
import { getDriveObject, searchDriveObjects } from '../../../api/file-manager'
import lodash from 'lodash'

export default {
  name: 'search-media',
  props: ['mediaElement', 'mediaElements'],
  components: {
    Breadcrumbs, FilesListItem
  },
  computed: {
    searching: {
      get () {
        if (this.isQueryEmpty) return false
        return this.searchingMode
      },
      set (value) {
        this.searchingMode = value
      }
    },
    searchResults () {
      return this.$store.getters.searchRes
    },
    sortingDirections () {
      return this.$store.getters.sortingSearchDirections
    },
    breadcrumbs () {
      return this.$store.getters.breadcrumbList
    },
    nothingFound () {
      return this.searchResults.length === 0
    },
    isQueryEmpty () {
      return this.query.length === 0
    },
    noFilters () {
      return this.mask === 0
    }
  },
  methods: {
    sort: function (key) {
      var direction = this.sortingDirections[key]
      if (this.sortingDirections[key] === 0) {
        direction = -1
      }
      let newDirection = (direction === 0) ? -1 : -direction
      this.$store.commit('SORT_SEARCH_TEMPLATES', { key, direction })
      this.$store.commit('UPDATE_SEARCH_SORTING_DIRECTION_TEMPLATES', { [key]: newDirection })
    },
    sortAscending: function (key) {
      return (this.sortingDirections[key] === 1)
    },
    sortDescending: function (key) {
      return (this.sortingDirections[key] === -1)
    },
    toggleFilter (type) {
      const bit = (1 << type)
      this.mask = (this.mask ^ bit)
      if (this.isQueryEmpty && this.noFilters) {
        this.fetchCatalogue()
      } else {
        this.search()
      }
    },
    search () {
      this.loading = true
      this.searching = true
      var mask = this.mask
      if (mask === 0) {
        mask = 7
      }
      this.resetMediaElement()
      searchDriveObjects({ query: this.query, type: mask })
        .then(response => {
          this.loading = false
          this.setSearchResults(response.data)
        })
    },
    clearQuery () {
      this.query = ''
      this.fetchCatalogue()
      this.resetMediaElement()
    },
    fetchCatalogue (id = 1) {
      this.loading = true
      this.searching = false
      this.resetMediaElement()
      this.$store.commit('UPDATE_BREADCRUMD_LIST', id)
      if (id === 1) {
        id = this.$store.getters.passport.files
      }
      getDriveObject(id).then(response => {
        const data = response.data
        const catalogueContent = data.children || []
        this.setSearchResults(catalogueContent)
        this.loading = false
      })
    },
    setSearchResults (data = []) {
      this.$store.commit('UPDATE_SEARCH_RES', data)
    },
    selectElement (e, index, driveObject) {
      console.log('select element', e)
      if (driveObject.type !== 0) {
        this.medias = this.mediaElements
        if (this.medias.length === 0) this.indexes = []
        if (this.$route.path === '/statistics') {
          if (this.medias.length > 0) {
            this.medias = []
          } else {
            this.medias.push(driveObject)
          }
        } else this.smartSelection(e, index, driveObject)
        // if (e.ctrlKey || e.shiftKey) {
        //   var pos = null
        //   elements.forEach((element, i) => {
        //     if (element.id === driveObject.id) {
        //       pos = i
        //     }
        //   })
        //   if (pos === null) {
        //     elements.push(driveObject)
        //   } else {
        //     elements.splice(pos, 1)
        //   }
        // } else {
        //   elements = []
        //   elements.push(driveObject)
        // }
        // this.$emit('update:mediaElement', driveObject)
        // console.log('medias', this.medias)
        // console.log('indexes', this.indexes)
        this.$emit('update:mediaElements', this.medias)
      }
    },
    smartSelectionToggle (mediaInd, searchIndex, elem) {
      if (mediaInd !== -1) {
        let ii = this.indexes.findIndex(obj => obj.i === searchIndex)
        this.indexes.splice(ii, 1)
        this.medias.splice(mediaInd, 1)
      } else {
        this.indexes.push({ e: elem, i: searchIndex })
        this.medias.push(elem)
      }
    },
    smartSelection (event, index, elem) {
      let isCtrl = event.ctrlKey
      let isShift = event.shiftKey
      let mediaInd = this.medias.findIndex(e => e.id === elem.id)
      if (!isCtrl && !isShift) {
        this.medias = []
        this.indexes = []
        this.smartSelectionToggle(mediaInd, index, elem)
      }
      if (isCtrl && !isShift) {
        this.smartSelectionToggle(mediaInd, index, elem)
      }
      if (isShift && !isCtrl) {
        let ind = index
        this.indexes.sort((e1, e2) => e1.i > e2.i)
        console.log('sort', this.indexes)
        let upObj = lodash.first(this.indexes)
        let downObj = lodash.last(this.indexes)
        let upInd = upObj ? upObj.i : -1
        let downInd = downObj ? downObj.i : -1
        if (ind > downInd) downInd = -1
        if (ind < upInd) upInd = -1
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
        console.log(`startInd = ${startInd} endInd = ${endInd}`)
        if (endInd - startInd > 0) {
          this.medias = []
          this.indexes = []
          for (let i = startInd; i <= endInd; i++) {
            let searchElem = this.searchResults[i]
            this.medias.push(searchElem)
            this.indexes.push({ e: searchElem, i: i })
          }
        } else this.smartSelectionToggle(mediaInd, index, elem)
      }
    },
    dblclickHandler (driveObject) {
      console.log('dblclickHandler')
      if (driveObject.type === 0) {
        this.fetchCatalogue(driveObject.id)
        this.$emit('update:mediaElements', [])
      } else {
        this.$parent.$parent.choose()
      }
    },
    inputHandler (event) {
      const value = event.target.value
      this.query = value
      if (this.isQueryEmpty) this.fetchCatalogue()
      else this.search()
    },
    resetMediaElement () {
      this.$emit('update:mediaElement', {})
    }
  },
  created () {
    this.$store.dispatch('updateDriveTree').then(() => {
      this.fetchCatalogue()
    })
  },
  data () {
    return {
      medias: [],
      indexes: [],
      mask: 0,
      query: '',
      loading: false,
      searchingMode: false,
      toolbarItems: [{
        key: 'name',
        text: 'Имя',
        width: 5
      }, {
        key: 'type',
        text: 'Тип',
        width: 2
      }, {
        key: 'size',
        text: 'Размер',
        width: 2
      }, {
        key: 'updated_at',
        text: 'Изменен',
        width: 2
      }]
    }
  }
}
</script>

<style scoped>
  .search-media {}
  .search-media-wrap {
    margin-top: 10px;
    color: rgba(11, 195, 203, 1);
    position: relative;
  }
  .search-media-icon {
    top: 50%;
    left: 11px;
    position: absolute;
    font-size: 18px;
    transform: translateY(-50%);
  }
  .search-media-input {
    width: 100%;
    height: 32px;
    padding: 0 80px 0 38px;
    border: 1px solid rgba(11, 195, 203, 1);
    border-radius: 20px;
    outline: none;
  }
  .search-media-clear {
    top: 50%;
    right: 12px;
    cursor: pointer;
    border: none;
    color: inherit;
    background: none;
    position: absolute;
    transform: translateY(-50%);
  }
  .search-media-files {
    height: 356px;
    margin-top: 16px;
    overflow-y: auto;
  }
  .search-media-breadcrumbs {
    margin-top: 16px;
  }
  .search-media-breadcrumbs .breadcrumbs {
    background: #fff !important;
  }
  .search-media-query {
    margin: 16px 0;
    padding: 0.75rem 1.25rem;
    background: rgba(245,245,245,1);
  }
  .search-media-message {
    padding: 0 1.25rem;
    display: inline-block;
  }
  .search-media-filter {
    margin-top: 1rem;
  }
  .filter {
    margin: 0;
    padding: 0;
    display: block;
    list-style-type: none;
  }
  .filter-item {
    display: inline-block;
  }
  .filter-item--legend {
    padding-right: 1rem;
  }
  .filter-button {
    padding: 0.2rem 0.7rem;
    border: none;
    border-radius: 2px;
    background: rgba(245,245,245,1);
    outline: none;
    cursor: pointer;
    transition: all 100ms ease;
  }
  .filter-button:not(.filter-button--active):hover {
    background: #e6e6e6;
  }
  .filter-button--active {
    color: #ffffff;
    background: #00b0b7;
  }
  .sorting-row {
    padding: 0 1.25rem;
    margin-right: 15px;
  }
  .back-button,
  .sort-button {
    border: none;
    cursor: pointer;
    outline: none;
    text-decoration: none;
    transition: all .2s ease-in-out;
  }
  .back-button {
    width: 46px;
    height: 100%;
    padding: 0;
    font-size: 1.5rem;
    color: #00b0b7;
    background: url(/static/img/icons/back.svg) no-repeat;
    background-size: 24px;
    background-position: left 3px;
  }
  .sort-button {
    width: 100%;
    margin-bottom: 0.25rem;
    padding: 0.5rem;
    padding-left: 0;
    text-align: left;
    font-size: 14px;
    color: #00b0b7;
    font-weight: bold;
    background: none;
  }
  .back-button:hover,
  .sort-button:hover {
    color: #ff4080;
  }
</style>