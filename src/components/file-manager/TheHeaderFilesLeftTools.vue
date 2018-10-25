<template>
  <p class="header-input input">
    <!-- <i class="mi mi-search"></i>
    <input
      v-model="query"
      @input="search"
      class="header-input-core"
      name="query"> -->
  </p>
</template>

<script>
import { searchDriveObjects } from '../../../api/file-manager.js'

export default {
  name: 'the-header-files-left-tools',
  computed: {
    query: {
      get () {
        return this.$store.getters.searchQuery
      },
      set (value) {
        const q = value.trim()
        this.$store.commit('UPDATE_SEARCH_QUERY', q)
      }
    },
    isEmpty () {
      return this.query.length === 0
    }
  },
  methods: {
    search () {
      const mode = !this.isEmpty
      const query = this.query
      const type = 7
      this.$store.commit('CHANGE_SEARCHING_MODE', { mode })
      searchDriveObjects({ query, type })
        .then(this.searchSuccess)
        .catch(this.searchError)
    },
    searchSuccess (response) {
      const data = {
        isSearching: true,
        data: response.data
      }
      this.$store.dispatch('uploadCatalogue', data)
    },
    searchError (error) {
      const messageType = 'networkError'
      const responseCode = error.response.status
      this.$store.commit('DISPLAY_ALERT', { messageType, responseCode })
    }
  }
}
</script>

<style scoped>
  .header-input {
    width: calc(100% - 64px);
    margin: 0;
    margin-left: 10px;
    margin-top: 5px;
    position: relative;
  }
  .header-input > .mi {
    top: 50%;
    right: 6px;
    width: 25px;
    height: 28px;
    margin-top: -12px;
    font-size: 18px;
    transform: scale(-1, 1);
    display: block;
    position: absolute;
  }
  .header-input-core {
    width: 100%;
    height: 30px;
    padding-left: 1.5em;
    padding-right: 2em;
    color: #ffffff;
    border: 1px solid #ffffff;
    border-radius: 50px;
    background: none;
    outline: none;
  }
</style>