<template>
  <div class="home container">
    <div class="row no-gutters">
      <div class="col">
        <Board
          icon="dashboard"
          title="Шаблоны"
          button="Все шаблоны"
          url="editor"
          :array="templates" />
      </div>
      <div class="col">
        <Board
          icon="schedule"
          title="Расписания"
          button="Все расписания"
          url="schedules"
          :array="schedules" />
      </div>
      <div class="col">
        <Board
          icon="desktop-windows"
          title="Плееры"
          button="Все плееры"
          url="players"
          :array="players" />
      </div>
      <div class="col">
        <Board v-if='isSuper'
          icon="account-circle"
          title="Организации"
          button="Все организации"
          url="managment"
          :array="orgs" />
        <Board v-else
          icon="account-circle"
          title="Пользователи"
          button="Все пользователи"
          url="managment"
          :array="users" />
      </div>
    </div>
  </div>
</template>

<script>
import Board from './common/Board'

export default {
  name: 'home',
  components: { Board },
  computed: {
    isSuper () {
      return this.$store.getters.passport.super_user
    },
    templates () {
      return this.$store.getters.editorCatalogue.map(e => {
        return {
          id: e.id,
          text: e.name
        }
      })
    },
    schedules () {
      return this.$store.getters.schedules.map(e => {
        return {
          id: e.id,
          text: e.name
        }
      })
    },
    players () {
      return this.$store.getters.displays.map(e => {
        return {
          id: e.id,
          text: e.name
        }
      })
    },
    users () {
      return this.$store.getters.users.map(e => {
        return {
          id: e.id,
          text: e.name
        }
      })
    },
    orgs () {
      return this.$store.getters.orgs.map(e => {
        return {
          id: e.id,
          text: e.name
        }
      })
    }
  },
  created () {
    this.$store.dispatch('fetchPassport')
    this.$store.dispatch('fetchTemplates')
    this.$store.dispatch('fetchSchedules')
    this.$store.dispatch('fetchDisplays')
    this.$store.dispatch('fetchOrgs')
    if (this.users.length === 0) {
      this.$store.dispatch('fetchUsers')
    }
  }
}
</script>

<style scoped>
.home {
  padding: 44px 0 !important;
}
</style>
