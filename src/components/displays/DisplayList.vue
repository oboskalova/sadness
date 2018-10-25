<template>
  <div class="container-counted-height" @click.self="removeSelection">
    <SearchWithTags mode="players"/>
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
      <div class="col">Плееры не найдены...</div>
    </div>
    <div v-if="!isLoading && !catalogueIsEmpty()">
      <displayListItem v-for="display in catalogue"
        v-on:assign="scheduleAssigment"
        :key="display.id"
        :obj="display" />
    </div>
    <b-modal centered
      id="setSchedule"
      ref="setSchedule"
      title="Назначение расписания плееру" 
      cancel-title="Отмена"
      :hide-footer="true">
      <p>Создать новое расписание или добавить плеер в существующее?</p>
      <button type="button" class="btn btn-secondary btn-md" @click="$router.push('/schedules/new?d=' + currentPlayer)">Создать новое</button>
      <button type="button" class="btn btn-secondary btn-md" @click="openLister()">Добавить в существующее</button>
      <div v-if="openList" class="row no-gutters header">
        <div class="col col-12">Название расписания</div>
      </div>
      <div v-if="openList" class="bounded">
        <div
          class="row no-gutters list-item"
          v-for="c in scheduleList"
          :key="c.id"
          @click="selectSchedule(c.id)">
          <div class="col col-12">{{ c.name }}</div>
        </div>
      </div>
    </b-modal>
    <ModalRename v-on:assign="scheduleAssigment"/>
  </div>
</template>

<script>
  import DisplayListItem from './DisplayListItem.vue'
  import ModalRename from '../modals/ModalRename'
  import SearchWithTags from '../common/SearchWithTags.vue'

  export default {
    name: 'display-list',
    props: ['catalogue', 'isLoading'],
    computed: {
      scheduleList () {
        return this.$store.getters.schedules
      },
      sortingDirections () {
        return this.$store.getters.sortingDirectionsDisplays
      }
    },
    created () {
      if (this.scheduleList.length === 0) {
        this.$store.dispatch('fetchSchedules')
      }
    },
    components: {
      DisplayListItem,
      ModalRename,
      SearchWithTags
    },
    methods: {
      removeSelection () {
        this.$store.commit('REMOVE_DISPLAY_SELECTION')
      },
      selectSchedule (id) {
        this.$router.push('/schedules/' + id + '?d=' + this.currentPlayer)
      },
      openLister () {
        this.openList = true
      },
      scheduleAssigment (id) {
        this.currentPlayer = id
        this.$refs.setSchedule.show()
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
        this.$store.dispatch('sortDisplays', { key, direction })
        this.$store.dispatch('updateSortingDirectionDisplays', { [key]: newDirection })
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
        currentPlayer: 0,
        openList: false,
        toolbarItems: [{
          key: 'name',
          text: 'Название',
          width: 2
        }, {
          key: 'typer',
          text: 'Тип',
          width: 2
        }, {
          key: 'pincode',
          text: 'Пинкод',
          width: 2
        }, {
          key: 'schedule',
          text: 'Расписание',
          width: 2
        }, {
          key: 'active',
          text: 'Статус',
          width: 2
        }, {
          key: 'connected_at',
          text: 'Последнее соединение',
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
    font-size: 13px;
    color: #00b0b7;
    font-weight: bold;
    background: none;
  }
  .back-button:hover,
  .sort-button:hover {
    color: #ff4080;
  }
   .bounded {
  margin: 1rem 0;
  max-height: 160px;
  overflow-y: scroll;
}
.header {
  padding: 4px 0;
  margin-right: 15px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1.5px solid rgba(235,235,235,1);
  align-items: center;
}
.list-item {
  padding: 4px 0;
  cursor: pointer;
  user-select: text;
}
</style>