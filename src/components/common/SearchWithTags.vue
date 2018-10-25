<template>
  <div class="search-media">
    <div class="search-media-wrap">
      <i class="mi mi-search search-media-icon"></i>
      <input
        :value="query"
        @input="inputHandler"
        class="search-media-input"
        v-on:keyup.enter="addTags()">
      <button
        v-if="!isQueryEmpty"
        @click="clearQuery"
        class="search-media-clear">
        очистить
      </button>
    </div>
    <div class="search-media-tag">
      <ul class="tag">
        <li class="tag-item" v-for="(item, index) in tags">
            {{ item }}
            <i class="mi mi-close" @click="remove(index)"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getTemplateObjects, searhWithTags } from '../../../api/template-editor'
import { getDisplayObjects, searchDisplays } from '../../../api/display-manager'
import { getScheduleObjects, searchSchedules } from '../../../api/schedule-manager'
import { getDriveObject, searchFiles } from '../../../api/file-manager'

export default {
  name: 'search-templates',
  props: ['mode'],
  computed: {
    searching: {
      get () {
        return this.$store.getters.searchWithTags
      },
      set (value) {
        this.$store.commit('TOOGLE_SEARCHING_MODE', value)
      }
    },
    searchResults () {
      return this.$store.getters.searchTagResults
    },
    isQueryEmpty () {
      var ifer = this.query.length === 0 && this.tags.length === 0
      if (ifer) {
        this.$store.commit('TOOGLE_SEARCHING_MODE', false)
      }
      return ifer
    },
    parentCatalogueId () {
      return this.$store.getters.parentCatalogueId
    }
  },
  methods: {
    remove (elem) {
      this.tags.splice(elem, 1)
      if (this.tags.length > 0) {
        this.search()
      } else {
        this.clearQuery()
      }
    },
    addTags () {
      var newTags = this.query.split(' ')
      newTags.forEach((el) => {
        if (el.length) {
          var pos = this.tags.find(item => item === el)
          console.log(pos)
          if (pos === undefined) {
            this.tags.push(el)
          }
        }
      })
      this.query = ''
      if (this.tags.length > 0) {
        this.search()
      }
    },
    search () {
      this.loading = true
      this.searching = true
      var tags = this.tags
      if (this.$props.mode === 'templates') {
        this.$store.commit('TOOGLE_TEMPLATE_LOADING', true)
        this.$store.commit('TOGGLE_TEMPLATE_OBJECT', {})
        searhWithTags({ query: this.query, tags: tags })
          .then(response => {
            this.loading = false
            var newData = []
            response.data.forEach((el) => {
              var flag = true
              this.tags.forEach((el2) => {
                if (el.mega_tags.toLowerCase().indexOf(el2.toLowerCase()) === -1) {
                  flag = false
                }
              })
              if (flag) newData.push(el)
            })
            this.setSearchResults(newData)
            console.log('new', newData)
            this.$store.commit('TOOGLE_TEMPLATE_LOADING', false)
          }).catch(error => {
            const messageType = 'notFound'
            const responseCode = error.response.status
            this.$store.commit('DISPLAY_ALERT', { messageType, responseCode })
            this.$store.commit('TOOGLE_TEMPLATE_LOADING', false)
            this.$router.push('/templates')
          })
      }
      if (this.$props.mode === 'players') {
        this.$store.commit('TOOGLE_PLAYER_LOADING', true)
        this.$store.commit('REMOVE_DISPLAY_SELECTION')
        searchDisplays({ query: this.query, tags: tags })
          .then(response => {
            this.loading = false
            var newData = []
            response.data.forEach((el) => {
              var flag = true
              this.tags.forEach((el2) => {
                if (el.mega_tags.toLowerCase().indexOf(el2.toLowerCase()) === -1) {
                  flag = false
                }
              })
              if (flag) newData.push(el)
            })
            this.setSearchResults(newData)
            this.$root.sockets.sendData('checkStatus')
            this.$store.commit('TOOGLE_PLAYER_LOADING', false)
          }).catch(error => {
            const messageType = 'notFound'
            const responseCode = error.response.status
            this.$store.commit('DISPLAY_ALERT', { messageType, responseCode })
            this.$store.commit('TOOGLE_PLAYER_LOADING', false)
            this.$router.push('/players')
          })
      }
      if (this.$props.mode === 'schedules') {
        this.$store.commit('TOOGLE_SCHEDULE_LOADING', true)
        this.$store.commit('REMOVE_SCHEDULE_SELECTION')
        searchSchedules({ query: this.query, tags: tags })
          .then(response => {
            this.loading = false
            var newData = []
            response.data.forEach((el) => {
              var flag = true
              this.tags.forEach((el2) => {
                if (el.mega_tags.toLowerCase().indexOf(el2.toLowerCase()) === -1) {
                  flag = false
                }
              })
              if (flag) newData.push(el)
            })
            this.setSearchResults(newData)
            this.$store.commit('TOOGLE_SCHEDULE_LOADING', false)
          }).catch(error => {
            const messageType = 'notFound'
            const responseCode = error.response.status
            this.$store.commit('DISPLAY_ALERT', { messageType, responseCode })
            this.$store.commit('TOOGLE_SCHEDULE_LOADING', false)
            this.$router.push('/schedules')
          })
      }
      if (this.$props.mode === 'files') {
        this.setParent()
        this.$store.commit('TOOGLE_TEMPLATE_LOADING', true)
        // this.$store.dispatch('uploadCatalogue', [])
        searchFiles({ query: this.query, tags: tags, folder: this.parentId })
          .then(response => {
            this.loading = false
            var newData = []
            response.data.forEach((el) => {
              var flag = true
              this.tags.forEach((el2) => {
                if (el.mega_tags.toLowerCase().indexOf(el2.toLowerCase()) === -1) {
                  flag = false
                }
              })
              if (flag) newData.push(el)
            })
            console.log('new', newData)
            this.setSearchResults({parent_id: this.parentId, children: newData})
            this.$store.commit('TOOGLE_TEMPLATE_LOADING', false)
          }).catch(error => {
            console.log('err', error)
            const messageType = 'notFound'
            const responseCode = error.response.status
            this.$store.commit('DISPLAY_ALERT', { messageType, responseCode })
            this.$store.commit('TOOGLE_TEMPLATE_LOADING', false)
          })
      }
    },
    clearQuery () {
      this.query = ''
      this.tags = []
      this.$store.commit('TOOGLE_SEARCHING_MODE', false)
      if (this.$props.mode === 'templates') {
        this.$store.commit('TOOGLE_TEMPLATE_LOADING', true)
        this.$store.commit('TOGGLE_TEMPLATE_OBJECT', {})
        return getTemplateObjects().then(response => {
          const data = response.data
          if (!data) return
          this.$store.dispatch('uploadTemplates', data)
          this.$store.commit('TOOGLE_TEMPLATE_LOADING', false)
        }).catch(error => {
          const messageType = 'notFound'
          const responseCode = error.response.status
          this.$store.commit('DISPLAY_ALERT', { messageType, responseCode })
          this.$store.commit('TOOGLE_TEMPLATE_LOADING', false)
          this.$router.push('/templates')
        })
      }
      if (this.$props.mode === 'players') {
        this.$store.commit('TOOGLE_PLAYER_LOADING', true)
        this.$store.commit('REMOVE_DISPLAY_SELECTION')
        return getDisplayObjects().then(response => {
          const data = response.data
          if (!data) return
          this.$store.dispatch('uploadDisplays', data)
          this.$store.commit('TOOGLE_PLAYER_LOADING', false)
          this.$root.sockets.sendData('checkStatus')
        }).catch(error => {
          const messageType = 'notFound'
          const responseCode = error.response.status
          this.$store.commit('DISPLAY_ALERT', { messageType, responseCode })
          this.$store.commit('TOOGLE_PLAYER_LOADING', false)
          this.$router.push('/templates')
        })
      }
      if (this.$props.mode === 'schedules') {
        this.$store.commit('TOOGLE_SCHEDULE_LOADING', true)
        this.$store.commit('REMOVE_SCHEDULE_SELECTION')
        return getScheduleObjects().then(response => {
          const data = response.data
          if (!data) return
          this.$store.dispatch('uploadSchedules', data)
          this.$store.commit('TOOGLE_SCHEDULE_LOADING', false)
        }).catch(error => {
          const messageType = 'notFound'
          const responseCode = error.response.status
          this.$store.commit('DISPLAY_ALERT', { messageType, responseCode })
          this.$store.commit('TOOGLE_SCHEDULE_LOADING', false)
          this.$router.push('/schedules')
        })
      }
      if (this.$props.mode === 'files') {
        this.$store.commit('TOOGLE_SCHEDULE_LOADING', true)
        this.$store.commit('REMOVE_SCHEDULE_SELECTION')
        this.setParent()
        return getDriveObject(this.parentId).then(response => {
          const data = response.data
          if (!data) return
          this.$store.dispatch('uploadCatalogue', data)
          this.$store.commit('TOOGLE_SCHEDULE_LOADING', false)
        }).catch(error => {
          const messageType = 'notFound'
          const responseCode = error.response.status
          this.$store.commit('DISPLAY_ALERT', { messageType, responseCode })
          this.$store.commit('TOOGLE_SCHEDULE_LOADING', false)
        })
      }
    },
    setSearchResults (data = []) {
      if (this.$props.mode === 'templates') {
        this.$store.dispatch('uploadTemplates', data)
      }
      if (this.$props.mode === 'players') {
        this.$store.dispatch('uploadDisplays', data)
      }
      if (this.$props.mode === 'schedules') {
        this.$store.dispatch('uploadSchedules', data)
      }
      if (this.$props.mode === 'files') {
        this.$store.dispatch('uploadCatalogue', data)
      }
    },
    inputHandler (event) {
      const value = event.target.value
      this.query = value
      // if (this.isQueryEmpty && this.tags.length === 0) this.$store.commit('TOOGLE_SEARCHING_MODE', false)
      // else this.search()
    },
    setParent () {
      if (this.$route.params.id) {
        this.parentId = this.$route.params.id
      } else {
        this.parentId = this.$store.getters.passport.files
      }
    }
  },
  created () {
    console.log(this.$props.mode)
    this.$store.commit('TOOGLE_SEARCHING_MODE', false)
  },
  mounted () {
    this.$root.$on('resetQQuery', this.clearQuery)
    this.setParent()
  },
  data () {
    return {
      tags: [],
      parentId: null,
      isLoading: false,
      query: '',
      loading: false,
      searchingMode: false
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
  .search-media-tag {
    margin-top: 1rem;
  }
  .tag-item {
  padding: 0.2rem 0.7rem;
  border: none;
  border-radius: 15px;
  background: rgb(0, 178, 183);
  color: #fff;
  outline: none;
  cursor: pointer;
  transition: all 100ms ease;
  display: inline-block;
  margin-right: 3px;
}
.tag-item .mi {
  top: 2px;
}
.tag {
  margin: 0;
  padding: 0;
  display: block;
  list-style-type: none;
}
  .tag-button:not(.tag-button--active):hover {
    background: #e6e6e6;
  }
  .tag-button--active {
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