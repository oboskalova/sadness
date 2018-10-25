<template>
  <b-modal centered
    @show="openModal"
    @hide="closeModal"
    v-model="active"
    title="Подтверждение удаления"
    ok-title="Удалить"
    cancel-title="Отмена"
    @ok="deleteContainer">
    <div v-if="this.activeContainer.parent_id">
      Вы действительно хотите удалить контейнер?
    </div>
    <div v-else>
      Вы действительно хотите удалить сцену?
    </div>
  </b-modal>
</template>

<script>

export default {
  name: 'modal-delete-container',
  computed: {
    active: {
      get () {
        return this.$store.getters.deleteContainer
      },
      set (value) {
        this.$store.commit('TOGGLE_DELETE_CONTAINER', value)
      }
    },
    activeContainer () {
      return this.$store.getters.coreActiveContainer
    }
  },
  methods: {
    deleteContainer () {
      if (this.activeContainer.show) {
        const id = this.activeContainer.id
        this.$store.dispatch('deleteContainer', { id })
      }
    },
    openModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', true)
    },
    closeModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', false)
    }
  }
}
</script>