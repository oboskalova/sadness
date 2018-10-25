<template>
  <b-modal centered
    @hide="closeModal"
    v-model="active"
    ok-title="Принять"
    cancel-title="Отмена"
    @ok="acceptClick">
    <div style="font-size: 16px">Настоящее Соглашение считается заключенным после нажатия клавиши &ldquo;Принять&rdquo;</div>
  </b-modal>
</template>

<script>

export default {
  name: 'modal-delete-container',
  props: ['isActive'],
  data () {
    return {
      active: false
    }
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    acceptClick () {
      this.$emit('accept')
    }
  },
  watch: {
    isActive (val) {
      this.active = val
    }
  }
}
</script>