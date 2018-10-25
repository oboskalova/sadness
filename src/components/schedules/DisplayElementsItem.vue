<template>
  <div
    class="list-item no-gutters">
    <div class="col col-6">{{ obj.name }}</div>
    <div class="col col-5">{{ obj.type }}</div>
    <div class="col col-1">
      <button
        class="template-button template-button--short float-right"
        title="Удалить"
        @click="remove">
        <i class="mi mi-delete"></i>
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'player-list-item',
  props: ['obj'],
  computed: {},
  methods: {
    remove () {
      this.$store.commit('REMOVE_SELECTED_PLAYER', this.obj.id)
    }
  }
}
</script>

<style scoped>
.list-item {
  padding: 0.75rem 1.25rem;
  border-top: 1.5px solid rgba(235,235,235,1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.template-button {
  height: 20px;
  padding: 0;
  display: block;
  text-align: right;
  font-size: 18px;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
}
.template-button--short {
  width: 20px;
  margin-right: 4px;
  float: left;
  opacity: 0.5;
  transition: opacity 200ms ease;
}
</style>
