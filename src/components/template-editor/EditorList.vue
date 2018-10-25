<template>
  <div class="container-counted-height" @click.self="removeSelection">
    <SearchWithTags mode="templates"/>
    <div class="row sorting-row no-gutters">
      <div v-for="item in toolbarItems" :key="item.key" class="col" :class="'col-' + item.width">
        <button @click="sort(item.key)" class="sort-button">
          {{ item.text }}
          <i class="mi mi-arrow-drop-down" v-if="sortAscending(item.key)"></i>
          <i class="mi mi-arrow-drop-up" v-if="sortDescending(item.key)"></i>
        </button>
      </div>
    </div>
    <img v-if="isLoading" src="/static/img/spinner.gif" class="loader">
    <div v-if="!isLoading && catalogueIsEmpty()" class="row row--divided no-gutters">
      <div class="col">Шаблоны не найдены...</div>
    </div>
    <div v-if="!isLoading && !catalogueIsEmpty()">
      <editorListItem v-for="template in templates"
        :key="template.id"
        :obj="template" />
    </div>
  </div>
</template>

<script>
  import EditorListItem from './EditorListItem.vue'
  import SearchWithTags from '../common/SearchWithTags.vue'

  export default {
    name: 'editor-list',
    props: ['templates', 'isLoading'],
    computed: {
      sortingDirections () {
        return this.$store.getters.sortingDirectionsTemplates
      }
    },
    components: {
      EditorListItem,
      SearchWithTags
    },
    methods: {
      removeSelection: function () {
        this.$store.commit('REMOVE_TEMPLATE_SELECTION')
      },
      catalogueIsEmpty: function () {
        if (this.templates) {
          return (this.templates.length === 0)
        }
        return true
      },
      sort: function (key) {
        var direction = this.sortingDirections[key]
        if (this.sortingDirections[key] === 0) {
          direction = -1
        }
        console.log(key, direction)
        let newDirection = (direction === 0) ? -1 : -direction
        this.$store.dispatch('sortTemplates', { key, direction })
        this.$store.dispatch('updateSortingDirectionTemplates', { [key]: newDirection })
      },
      sortAscending: function (key) {
        return (this.sortingDirections[key] === 1)
      },
      sortDescending: function (key) {
        return (this.sortingDirections[key] === -1)
      }
    },
    data () {
      return {
        toolbarItems: [{
          key: 'name',
          text: 'Название',
          width: 5
        }, {
          key: 'published',
          text: 'Статус',
          width: 5
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
  /* .container-counted-height {
    height: calc(100vh - 84px);
    overflow-y: auto;
  } */
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