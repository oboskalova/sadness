<template>
  <div>
    <div class="content row no-gutters">
      <aside class="aside col stats">
        <div class="aside-stat-tree">
          <ul class="stat-tree">
            <li class="stat-tree-node" v-if="isAdmin || canUser ">
              <a :class="{ 'stat-tree-link link': true, 'active': page === 'Users' }" @click="changePage('Users')">
              <span class="link-inner">Пользователи</span></a>
            </li>
            <li class="stat-tree-node" v-if="isAdmin || canGroups">
              <a :class="{ 'stat-tree-link link': true, 'active': page === 'Groups' }" @click="changePage('Groups')">
              <span class="link-inner">Группы</span></a>
            </li>
            <!-- <li class="stat-tree-node" v-if="isAdmin || canChangeInfo"> -->
              <!-- <a :class="{ 'stat-tree-link link': true, 'active': page === 'OrgInfo' }" @click="changePage('OrgInfo')"> -->
              <!-- <span class="link-inner">Информация об организации</span></a> -->
            <!-- </li> -->
          </ul>
        </div>
      </aside>
      <main class="main col" @click.self="reselect">
        <component v-if="page" :is="page" @cancel="resetPage"/>
      </main>
    </div>
  </div>
</template>
<script>
  import Groups from './Groups'
  import Users from './Users'
  import OrgInfo from './OrgInfo'
  import { getGroups } from '../../../api/managment'

  export default {
    name: 'organization',
    components: {
      Users,
      Groups,
      OrgInfo
    },
    data () {
      return {
        id: null,
        page: null
      }
    },
    beforeDestroy () {
      this.$store.commit('CHANGE_ACTIVE_TAB', null)
    },
    created () {
      let id = parseInt(this.$route.query.id)
      if (id) this.changePage('Users')
      getGroups().then((resp) => {
        console.log('resp', resp.data)
        this.$store.commit('GET_GROUPS', resp.data)
        this.$store.commit('SORT_GROUPS_INITIAL')
      })
    },
    computed: {
      isAdmin () {
        return this.$store.getters.passport.org_admin
      },
      userGroup () {
        return this.$store.getters.userGroup
      },
      customGroup () {
        return this.$store.getters.passport.custom
      },
      canUser () {
        var can = false
        this.userGroup.forEach(el => {
          if (el.admin) can = true
          if (el.users) can = true
        })
        if (this.userGroup) {
          const custom = JSON.parse(this.customGroup)
          if (custom.users) can = true
        }
        console.log('user', can)
        return can
      },
      canGroups () {
        var can = false
        this.userGroup.forEach(el => {
          if (el.admin) can = true
          if (el.groups) can = true
        })
        if (this.userGroup) {
          const custom = JSON.parse(this.customGroup)
          if (custom.groups) can = true
        }
        console.log('groups', can)
        return can
      },
      canChangeInfo () {
        var can = false
        this.userGroup.forEach(el => {
          if (el.admin) can = true
          if (el.change_info) can = true
        })
        console.log('change info', can)
        return can
      }
    },
    methods: {
      resetPage () {
        this.page = null
      },
      reselect () {
        this.$store.commit('TOGGLE_GROUPS_OBJECT', null)
        this.$store.commit('TOGGLE_USER_OBJECT', null)
      },
      changePage (data) {
        this.$store.commit('CHANGE_ACTIVE_TAB', data)
        this.page = data
      }
    }
  }
</script>
<style scoped>
  .aside-stat-tree {
    margin-top: 1em;
  }
  .stats {
    min-width: 20%;
    max-width: 20%;
    height: 100%;
    color: #ffffff;
    background: #333333;
    position: relative;
    flex: 1;
  }
  .stat-tree {
    margin: 0;
    padding: 0;
    display: block;
    list-style-type: none;
  }
  .stat-tree-link {
    padding: .9rem;
    padding-left: 2.4rem;
    display: block;
    color: #fff;
  }
  .stat-tree-link.active {
    background: #282828;
  }
  main {
    padding-top: 5px;
  }
</style>