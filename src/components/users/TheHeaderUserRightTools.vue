<template>
  <div>
    <button
      class="header-btn"
      title="Пригласить пользователя"
      @click="openInviteModal">
      <i class="mi mi-person-add"></i>
    </button>
    <button
      class="header-btn"
      title="Назначить"
      @click="openAssignModal">
      <i class="mi mi-add"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'the-header-user-right-tools',
  methods: {
    openInviteModal () {
      this.$store.commit('TOGGLE_INVITE_USER', true)
    },
    openAssignModal () {
      this.$store.commit('TOGGLE_CREATE_ASSIGNMENT', true)
    }
  }
}
</script>

<style scoped></style>
