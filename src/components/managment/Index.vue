<template>
  <div>
    <main class="main" @click.self="unselect">
      <organization v-if="isSuper" />
      <AdminSection v-if="!isSuper" />
      <div v-if="!isSuper && !isOrgAdmin">
        Возникла ошибка, попробуйте снова
      </div>
    </main>
  </div>
</template>

<script>
  import Organization from './Organization'
  import AdminSection from './AdminSection'

  export default {
    name: 'management',
    components: {
      Organization,
      AdminSection
    },
    created () {
      if (!this.$store.getters.passport.id) {
        this.$store.dispatch('fetchPassport')
      }
      this.$store.dispatch('fetchUserGroup')
    },
    data () {
      return {
        page: 'Organization'
      }
    },
    computed: {
      isSuper () {
        return this.$store.getters.passport.super_user
      },
      isOrgAdmin () {
        return this.$store.getters.passport.org_admin
      }
    },
    methods: {
      changePage (data) {
        this.page = data
      },
      unselect () {
        this.$store.commit('TOGGLE_ORG_OBJECT', null)
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
</style>