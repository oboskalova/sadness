<template>
  <div :class="{ boxer: true, playerH: isPlayer, attached: isAttached }">
  <header class="header">
    <b-navbar class="header-nav row no-gutters justify-content-between" toggleable="md" type="dark">
      <div class="header-left-side row no-gutters" v-if="active">
        <button class="header-toggle" @click="openMenu">
          <i class="mi mi-dehaze mi-30"></i>
        </button>
        <div v-if="isActive" class="header-popup" v-click-outside="closeMenu">
          <button class="header-toggle" @click="closeMenu">
            <i class="mi mi-close mi-30"></i>
          </button>
          <ul class="header-menu" @click="clear">
            <li class="header-menu-item">
              <router-link class="header-menu-link" to="/">
                <img src="/static/img/menu-icons/main.svg"> 
                Главная
              </router-link>
            </li>
            <li class="header-menu-item">
              <router-link class="header-menu-link" to="/editor">
                <img src="/static/img/menu-icons/editor.svg"> 
                Редактор шаблонов
              </router-link>
            </li>
            <li class="header-menu-item">
              <router-link class="header-menu-link" to="/files">
                <img src="/static/img/menu-icons/files.svg"> 
                Файловый менеджер
              </router-link>
            </li>
            <li class="header-menu-item" v-if="isSuper">
              <router-link class="header-menu-link" to="/managment">
                <img src="/static/img/menu-icons/orgs.svg"> 
                Организации
              </router-link>
            </li>
            <li class="header-menu-item">
              <router-link class="header-menu-link" to="/players">
                <img src="/static/img/menu-icons/players.svg"> 
                Плееры
              </router-link>
            </li>
            <li class="header-menu-item">
              <router-link class="header-menu-link" to="/schedules">
                <img src="/static/img/menu-icons/schedules.svg"> 
                Расписания
              </router-link>
            </li>
            <li class="header-menu-item">
              <router-link class="header-menu-link" to="/statistics">
                <img src="/static/img/menu-icons/statistics.svg"> 
                Статистика
              </router-link>
            </li>
            <li class="header-menu-item" v-if="isAdmin || canGroups || canUser">
              <router-link class="header-menu-link" to="/managment">
                <img src="/static/img/menu-icons/users.svg"> 
                Пользователи
              </router-link>
            </li>
            <li class="header-menu-item">
              <router-link class="header-menu-link" to="/manual">
                <img src="/static/img/menu-icons/information.svg"> 
                Руководство
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="pageTitle" class="header-title">
          {{ pageTitle }}
        </div>
        <router-view name="header-left-side-tools"></router-view>
      </div>
      <router-view name="header-right-side-tools"></router-view>
    </b-navbar>
  </header>
  </div>
</template>

<script>
const font = require('../../../src/lib/font')

export default {
  name: 'the-header',
  data () {
    return {
      isActive: false
    }
  },
  async created () {
    console.log('addFontsOnPage')
    await font.addFontsOnPage()
    let fontsInfo = await font.getFontsInfo()
    this.$store.dispatch('setFontsInfo', fontsInfo)
  },
  watch: {
    '$route': 'closeMenu'
  },
  computed: {
    isAdmin () {
      return this.$store.getters.passport.org_admin
    },
    isSuper () {
      return this.$store.getters.passport.super_user
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
    isPlayer () {
      console.log('path', this.$route.path)
      var str = this.$route.path
      return str.indexOf('player/') + 1
    },
    active () {
      return this.$store.getters.menuStatus
    },
    isAttached () {
      return this.$store.getters.attached
    },
    pageTitle () {
      return this.$route.name
    }
  },
  mounted () {
    this.$store.dispatch('fetchUserGroup')
    this.$store.dispatch('fetchPassport')
  },
  methods: {
    openMenu () {
      this.isActive = true
    },
    closeMenu () {
      this.isActive = false
    },
    clear () {
      this.$store.commit('UPDATE_TEMPLATE_RIGHTS', [])
      this.$store.commit('RESET_CONTAINER_PROPERTIES', [])
      this.$store.commit('UPDATE_CONTAINER_TREE', [])
      this.$store.commit('UPDATE_ASSIGNMENTS_LIST', [])
    }
  }
}
</script>

<style scoped>
  .header {
    color: #ffffff;
    background: #00b0b7;
    position: relative;
    z-index: 1;
  }
  .playerH {
    position: fixed;
    width:100%;
    top: -55px;
    transition: 0.5s all;
  }
  .playerH:hover {
    top: 0px;
  }
  .header-left-side {
    width: calc(18% - 10px);
  }
  .header-nav {
    width: 100%;
    height: 52px;
    padding: 0 !important;
    padding-left: 10px !important;
  }
  .mi-30 {
    padding-top: 4px;
    font-size: 30px;
  }
  .header-popup {
    top: 0;
    left: 0;
    width: 10%;
    min-width: 250px;
    /* min-width: 340px; */
    display: block;
    position: absolute;
    background: #01afb8;
    box-shadow: 3px 3px 7px rgba(0,0,0,0.3);
    z-index: 100001;
  }
  .header-popup .header-toggle {
    margin-top: 7px;
    margin-left: 10px;
  }
  .header-toggle {
    border: none;
    background: none;
    cursor: pointer;
    color: #fff;
    display: block;
  }
  .header-menu, .header-menu-item {
    margin: 0;
    padding: 0;
    display: block;
  }
  .header-menu-link {
    height: 53px;
    padding-left: 21px;
    line-height: 53px;
    font-size: 16px;
    display: flex;
    align-items: center;
    color: #fff;
  }
  .header-menu-link img {
    width: 20px;
    margin-right: 10px;
  }
  .router-link-exact-active,
  .header-menu-link:hover {
    background: #0fbfc8;
  }
  .attached {
    top: 0px;
  }
  .boxer {
    z-index: 1;
  }
  .boxer.playerH {
    padding-bottom: 10px;
  }
  .header-title {
    display: flex;
    align-items: center;
    margin-left: 10px;
    font-size: 16px;
    white-space: nowrap;
  }
</style>