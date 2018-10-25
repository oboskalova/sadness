<template>
  <div class="row no-gutters">
    <SuperTools v-if="isSuper" />
    <GroupTools v-if="!isSuper && activeTab === 'Groups'" />
    <UsersTools v-if="!isSuper && activeTab === 'Users'" />
  </div>
</template>

<script>
  import SuperTools from './SuperTools'
  import GroupTools from './GroupTools'
  import UsersTools from './UsersTools'

  export default {
    name: 'the-header-orgs-right-tools',
    components: {
      GroupTools,
      SuperTools,
      UsersTools
    },
    computed: {
      isSuper () {
        return this.$store.getters.passport.super_user
      },
      activeTab () {
        return this.$store.getters.activeAdminTab
      }
    }
  }
</script>