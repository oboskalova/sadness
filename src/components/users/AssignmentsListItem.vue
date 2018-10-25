<template>
  <div
    class="row no-gutters align-items-center list-item"
    @dblclick="openSettings">
    <div class="col col-3">{{ record.name }}</div>
    <div class="col col-5">{{ containers | truncate }}</div>
    <div class="col col-4">
      <span class="mode" :class="{ 'mode--p': record.edit_props }"></span>
      <span class="mode" :class="{ 'mode--d': record.delegate }"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'users-list-item',
  props: ['record'],
  filters: {
    truncate (value) {
      const maxLength = 34
      if (value.length > maxLength) {
        return value.slice(0, maxLength - 3) + ' ...'
      }
      return value
    }
  },
  computed: {
    containers () {
      const c = JSON.parse(this.$props.record.containers)
      return c.map(e => e.name).join(', ')
    }
  },
  methods: {
    openSettings () {
      this.$store.commit('RESET_ASSIGNMENT', this.$props.record)
      this.$store.commit('TOGGLE_CREATE_ASSIGNMENT', true)
    }
  }
}
</script>

<style scoped>
.list-item {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  cursor: pointer;
}
.list-item:hover {
  background: rgba(245,245,245,1)
}
.username {}
.email {
  opacity: 0.6;
  font-size: 12px;
}
.mode {
  display: inline-block;
}
.mode:after {
  padding: 5px 8px 3px 8px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
  border-radius: 2px;
}
.mode--d:after,
.mode--p:after {
  color: #333333;
  background: #e3e5e6; 
  /*color: #ffffff;*/
  /*background: #0275d8;*/
}
.mode--d:after {
  content: 'Делегирование прав';
}
.mode--p:after {
  content: 'Редактирование свойств';
}
</style>
