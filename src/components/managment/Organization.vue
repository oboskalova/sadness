<template>
  <div class="container top-paddding">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link" :class="{ 'active': !basket }" @click="toogleBasket(false)">Организации</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ 'active': basket }" @click="toogleBasket(true)">Корзина</a>
      </li>
    </ul>
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
      <div class="col">Организации не найдены...</div>
    </div>
    <div v-if="!isLoading && !catalogueIsEmpty">
      <OrgListItem v-for="org in orgList"
        :key="org.id"
        :obj="org" />
    </div>
    <ModalEditOrg @update="load"/>
    <ModalEditAdmin @update="load"/>
    <b-modal centered
      id="block-org"
      ref="block-org"
      title="Подтверждение блокировки" 
      cancel-title="Отмена"
      :hide-footer="isLoading"
      @ok="block">
      <span v-if="targetOrg">
        <span v-if="targetOrg.lock">
          Вы действительно хотите разблокировать организацию?
        </span>
        <span v-if="!targetOrg.lock">
          Вы действительно хотите заблокировать организацию?
          Все логины пользователей будут так же заблокированы
        </span>
      </span>
      <img
        v-if="isLoading"
        src="/static/img/spinner.gif"
        class="loader">
    </b-modal>
    <b-modal centered
      id="orgDelete"
      ref="orgDelete"
      title="Подтверждение удаления" 
      cancel-title="Отмена"
      :hide-footer="isLoading"
      @ok="deleteOrg(true)">
      Вы действительно хотите отправить организацию в корзину?
      Организация с пользователями и контентом будет полностью удалена через 60 дней
      <img
        v-if="isLoading"
        src="/static/img/spinner.gif"
        class="loader">
    </b-modal>
    <b-modal centered
      id="restore-org"
      ref="restore-org"
      title="Подтверждение восстановления" 
      cancel-title="Отмена"
      :hide-footer="isLoading"
      @ok="deleteOrg(false)">
      Вы действительно хотите восстановить организацию?
      <img
        v-if="isLoading"
        src="/static/img/spinner.gif"
        class="loader">
    </b-modal>
  </div>
</template>
<script>
  import OrgListItem from './OrgListItem'
  import ModalEditOrg from '../modals/ModalEditOrg'
  import ModalEditAdmin from '../modals/ModalAdminOrg'
  import { getOrgs, editOrgs } from '../../../api/managment'

  export default {
    name: 'organization',
    components: {
      OrgListItem,
      ModalEditOrg,
      ModalEditAdmin
    },
    data () {
      return {
        isLoading: false,
        id: null,
        wasOpened: false,
        toolbarItems: [{
          key: 'name',
          text: 'Название',
          width: 3
        }, {
          key: 'space',
          text: 'Диск(Исп/Всего,Гб)',
          width: 2
        }, {
          key: 'admin',
          text: 'Администратор',
          width: 3
        }, {
          key: 'lock',
          text: 'Блокировка',
          width: 2
        }, {
          key: 'updated_at',
          text: 'Изменено',
          width: 2
        }]
      }
    },
    created () {
      this.id = parseInt(this.$route.query.id)
    },
    mounted () {
      this.load()
    },
    computed: {
      catalogueIsEmpty () {
        return this.orgList.length === 0
      },
      basket () {
        return this.$store.getters.orgBasket
      },
      orgList () {
        return this.$store.getters.orgs.filter(el => el.basket === this.basket)
      },
      sortingDirections () {
        return this.$store.getters.sortingDirectionsOrgs
      },
      targetOrg () {
        return this.$store.getters.targetOrg
      }
    },
    methods: {
      toogleBasket (v) {
        this.$store.commit('TOGGLE_ORG_BASKET', v)
      },
      block () {
        let obj = {}
        obj.id = this.targetOrg.id
        if (this.targetOrg.lock) {
          obj.lock = false
        } else {
          obj.lock = true
        }
        this.edit(obj)
      },
      deleteOrg (v) {
        let obj = {}
        obj.id = this.targetOrg.id
        obj.basket = v
        this.edit(obj)
      },
      edit (obj) {
        this.isLoading = true
        return editOrgs(obj).then(response => {
          const data = response.data
          if (!data) return
          if (obj.lock) this.$root.sockets.sendData('massLogoutUsers', { org: obj.id })
          if (obj.basket) {
            this.$root.sockets.sendData('massLogoutUsers', { org: obj.id })
            this.$root.sockets.sendData('massLogoutPlayers', { org: obj.id })
          }
          console.log(data)
          this.load()
          this.isLoading = false
        }).catch(error => {
          console.log(error)
          this.isLoading = false
        })
      },
      load () {
        this.$store.commit('TOGGLE_ORG_OBJECT', null)
        this.isLoading = true
        getOrgs().then((resp) => {
          console.log('resp', resp.data)
          this.$store.commit('GET_ORGS', resp.data)
          this.$store.commit('SORT_ORGS_INITIAL')
          this.isLoading = false
          this.$nextTick(() => {
            if (this.id && !this.wasOpened) {
              this.orgList.forEach(e => {
                if (e.id === this.id) {
                  this.$store.commit('TOGGLE_ORG_OBJECT', e)
                  this.$store.commit('TOGGLE_EDIT_ORG', true)
                  this.$store.commit('TOGGLE_EDIT_MODE_ORG', true)
                  this.wasOpened = true
                }
              })
            }
          })
        })
      },
      sort: function (key) {
        var direction = this.sortingDirections[key]
        if (this.sortingDirections[key] === 0) {
          direction = -1
        }
        let newDirection = (direction === 0) ? -1 : -direction
        this.$store.dispatch('sortOrgs', { key, direction })
        this.$store.dispatch('updateSortingDirectionOrgs', { [key]: newDirection })
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