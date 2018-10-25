<template>
  <div class="container">
    <div class="row align-items-center no-gutters header">
      <div class="col col-3">Шаблон</div>
      <div class="col col-5">Контейнеры</div>
      <div class="col col-4">Права на</div>
    </div>
    <AssignmentsListItem
      v-for="record in list"
      :key="record.id"
      :record="record" />
  </div>
</template>

<script>
import AssignmentsListItem from './AssignmentsListItem'

export default {
  name: 'users-list',
  props: ['list'],
  components: { AssignmentsListItem }
}
</script>

<style scoped>
.header {
  font-weight: bold;
  color: #00b0b7;
  border-bottom: 1.5px solid rgba(235,235,235,1);
}
.header > .col {
  margin-bottom: 0.25rem;
  padding: 0.5rem 0;
}
</style>
