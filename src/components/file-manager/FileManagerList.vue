<template>
  <div class="container-counted-height" @click.self="removeSelection">
    <SearchWithTags mode="files"/>
    <div class="row sorting-row no-gutters">
      <div class="col">
        <button class="back-button" @click="returnBack"></button>
      </div>
      <div v-for="item in toolbarItems" :key="item.key" class="col" :class="'col-' + item.width">
        <button @click="sort(item.key)" class="sort-button">
          {{ item.text }}
          <i class="mi mi-arrow-drop-down" v-if="sortAscending(item.key)"></i>
          <i class="mi mi-arrow-drop-up" v-if="sortDescending(item.key)"></i>
        </button>
      </div>
    </div>
    <img v-if="isLoading" src="/static/img/spinner.gif" class="loader">
    <div v-else-if="catalogueIsEmpty()" class="row row--divided no-gutters">
      <div class="col">{{ message }}</div>
    </div>
    <div v-else>
      <FileManagerListItem v-for="obj in catalogue"
        :key="obj.id"
        :obj="obj" />
    </div>
  </div>
</template>

<script>
  import { contains } from '../../../helpers'
  import FileManagerListItem from './FileManagerListItem'
  import SearchWithTags from '../common/SearchWithTags.vue'

  export default {
    name: 'file-manager-list',
    props: ['catalogue', 'isLoading'],
    computed: {
      sortingDirections () {
        return this.$store.getters.sortingDirections
      },
      movingObjects () {
        return this.$store.getters.movingObjects
      },
      parentCatalogueId () {
        return this.$store.getters.parentCatalogueId
      },
      message () {
        const isSearching = this.$store.getters.searchingMode
        return isSearching ? 'Ничего не найдено' : 'Каталог пуст...'
      }
    },
    components: {
      FileManagerListItem,
      SearchWithTags
    },
    methods: {
      removeSelection: function () {
        this.$store.commit('REMOVE_SELECTION')
      },
      catalogueIsEmpty: function () {
        if (this.catalogue) {
          return (this.catalogue.length === 0)
        }
        return true
      },
      returnBack: function () {
        const id = this.parentCatalogueId
        console.log('parent', this.parentCatalogueId)
        this.$store.commit('CHANGE_REQUEST_TYPE', true)
        if (id) this.$router.push({path: `/files/${id}`})
      },
      sort: function (key) {
        var direction = this.sortingDirections[key]
        if (this.sortingDirections[key] === 0) {
          direction = -1
        }
        let newDirection = (direction === 0) ? -1 : -direction
        this.$store.dispatch('sortCatalogue', { key, direction })
        this.$store.dispatch('updateSortingDirection', { [key]: newDirection })
      },
      sortAscending: function (key) {
        return (this.sortingDirections[key] === 1)
      },
      sortDescending: function (key) {
        return (this.sortingDirections[key] === -1)
      }
    },
    updated () {
      this.$children.forEach(e => {
        if (e.obj) {
          this.$set(e.obj, 'isDragging', contains(this.movingObjects, e.obj.id))
          this.$set(e.obj, 'isOver', false)
          this.$set(e.obj, 'isChoosed', false)
        }
      })
    },
    data () {
      return {
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
  .container-counted-height {
  }
  .sorting-row {
    padding: 0 1.25rem;
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