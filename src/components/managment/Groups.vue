<template>
  <div class="container">
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
    <div v-if="!isLoading && catalogueIsEmpty" class="row row--divided no-gutters">
      <div class="col">Группы не найдены...</div>
    </div>
    <div v-if="!isLoading && !catalogueIsEmpty">
      <GroupListItem v-for="org in groupList"
        :key="org.id"
        :obj="org" />
    </div>
    <ModalEditGroup @update="load"/>
    <b-modal centered
      id="deleteGroup"
      ref="deleteGroup"
      title="Подтверждение удаления"
      cancel-title="Отмена"
      :hide-footer="isLoading"
      @ok="deleteGroup()">
      Вы действительно хотите удалить группу?
      <img
        v-if="isLoading"
        src="/static/img/spinner.gif"
        class="loader">
    </b-modal>
  </div>
</template>

<script>
  import GroupListItem from './GroupListItem'
  import ModalEditGroup from '../modals/ModalEditGroup'
  import { getGroups, editGroups, deleteGroup } from '../../../api/managment'

  export default {
    name: 'group-list',
    components: {
      GroupListItem,
      ModalEditGroup
    },
    data () {
      return {
        isLoading: false,
        toolbarItems: [{
          key: 'name',
          text: 'Название',
          width: 10
        }, {
          key: 'updated_at',
          text: 'Изменено',
          width: 2
        }]
      }
    },
    mounted () {
      this.load()
    },
    computed: {
      catalogueIsEmpty () {
        return this.groupList.length === 0
      },
      groupList () {
        return this.$store.getters.groups
      },
      sortingDirections () {
        return this.$store.getters.sortingDirectionsGroups
      },
      targetGroup () {
        return this.$store.getters.targetGroup
      }
    },
    methods: {
      deleteGroup (v) {
        return deleteGroup(this.targetGroup.id).then(resp => {
          const data = resp.data
          if (!data) return
          console.log(data)
          this.load()
          this.isLoading = false
        }).catch(error => {
          console.log(error)
          this.isLoading = false
        })
      },
      edit (obj) {
        this.isLoading = true
        return editGroups(obj).then(response => {
          const data = response.data
          if (!data) return
          console.log(data)
          this.load()
          this.isLoading = false
        }).catch(error => {
          console.log(error)
          this.isLoading = false
        })
      },
      load () {
        this.$store.commit('TOGGLE_GROUPS_OBJECT', null)
        this.isLoading = true
        getGroups().then((resp) => {
          console.log('resp', resp.data)
          this.$store.commit('GET_GROUPS', resp.data)
          this.$store.commit('SORT_GROUPS_INITIAL')
          this.isLoading = false
        })
      },
      sort: function (key) {
        var direction = this.sortingDirections[key]
        if (this.sortingDirections[key] === 0) {
          direction = -1
        }
        let newDirection = (direction === 0) ? -1 : -direction
        this.$store.dispatch('sortGroups', { key, direction })
        this.$store.dispatch('updateSortingDirectionGroups', { [key]: newDirection })
      },
      sortAscending: function (key) {
        return (this.sortingDirections[key] === 1)
      },
      sortDescending: function (key) {
        return (this.sortingDirections[key] === -1)
      }
    }
  }
</script>