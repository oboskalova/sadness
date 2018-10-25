<template>
  <b-modal
    @show="openModal"
    @hide="closeModal"
    v-model="active"
    @ok="ok"
    :title="title"
    cancelTitle="Отмена"
    centered>
    <p>{{ warning }}</p>
  </b-modal>
</template>

<script>
export default {
  name: 'modal-confirm-leaving',
  props: ['ok', 'title', 'warning'],
  computed: {
    active: {
      get () {
        return this.$store.getters.confirmLeaving
      },
      set (value) {
        this.$store.commit('TOGGLE_CONFIRM_LEAVING', value)
      }
    }
  },
  methods: {
    openModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', true)
    },
    closeModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', false)
    }
  }
}
</script>
