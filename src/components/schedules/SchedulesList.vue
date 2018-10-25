<template>
  <div class="container-counted-height" @click.self="removeSelection">
    <SearchWithTags mode="schedules"/>
    <div class="row sorting-row no-gutters">
      <div v-for="item in toolbarItems" class="col" :class="'col-' + item.width">
        <button @click="sort(item.key)" class="sort-button">
          {{ item.text }}
          <i class="mi mi-arrow-drop-down" v-if="sortAscending(item.key)"></i>
          <i class="mi mi-arrow-drop-up" v-if="sortDescending(item.key)"></i>
        </button>
      </div>
    </div>
    <img v-if="isLoading" src="/static/img/spinner.gif" class="loader">
    <div v-if="!isLoading && catalogueIsEmpty()" class="row row--divided no-gutters">
      <div class="col">Расписания не найдены...</div>
    </div>
    <div v-if="!isLoading && !catalogueIsEmpty()">
      <SchedulesListItem v-for="Schedule in catalogue"
        :key="Schedule.id"
        :obj="Schedule" />
    </div>
  </div>
</template>

<script>
  import SchedulesListItem from './SchedulesListItem.vue'
  import SearchWithTags from '../common/SearchWithTags.vue'

  export default {
    name: 'Schedule-list',
    props: ['catalogue', 'isLoading'],
    computed: {
      sortingDirections () {
        return this.$store.getters.sortingDirectionsSchedules
      }
    },
    components: {
      SchedulesListItem,
      SearchWithTags
    },
    methods: {
      removeSelection () {
        this.$store.commit('REMOVE_SCHEDULE_SELECTION')
      },
      catalogueIsEmpty: function () {
        if (this.catalogue) {
          return (this.catalogue.length === 0)
        }
        return true
      },
      sort: function (key) {
        var direction = this.sortingDirections[key]
        if (this.sortingDirections[key] === 0) {
          direction = -1
        }
        let newDirection = (direction === 0) ? -1 : -direction
        this.$store.dispatch('sortSchedules', { key, direction })
        this.$store.dispatch('updateSortingDirectionSchedules', { [key]: newDirection })
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
          width: 9
        }, {
          key: 'updated_at',
          text: 'Последнее обновление',
          width: 3
        }]
      }
    }
  }
</script>

<style scoped>
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