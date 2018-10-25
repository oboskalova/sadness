<template>
  <div class="board">
    <div class="board-title">
      <i class="mi mi-24" :class="'mi-' + icon"></i>
      <span>{{ title }}</span>
    </div>
    <ul class="board-list">
      <li
        class="board-row"
        v-for="e in array"
        :key="e.id">
        <router-link v-if="url === 'managment'"
          :to="`${url}?id=${e.id}`">
          {{ e.text }}
        </router-link>
        <router-link v-else
          :to="`${url}/${e.id}`">
          {{ e.text }}
        </router-link>
      </li>
    </ul>
    <router-link
      class="board-button btn btn-primary"
      :to="url">
      {{ button }}
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'board',
  props: ['title', 'icon', 'array', 'button', 'url']
}
</script>

<style scoped>
.board {
  padding: .325rem;
}
.board-title {
  padding: 0.84rem .74rem;
  text-transform: uppercase;
  background: #00b0b7;
  color: #ffffff;
}
.board-title > i,
.board-title > span {
  display: inline-block;
  vertical-align: middle;
}
.board-title > i {
  margin-right: 0.25rem;
  padding-bottom: 2px;
}
.board-title > span {
  padding-top: 2px;
}
.board-list {
  width: 100%;
  height: calc(100vh - 260px);
  margin: 0;
  margin-bottom: 1rem;
  padding: 0;
  border: 1px solid #dddddd;
  list-style-type: none;
  overflow-y: auto;
}
.board-row {
  padding: 0.84rem 1.14rem;
  border-bottom: 1px solid #dddddd;
}
.board-button {
  width: 100% !important;
  margin: 0 !important;
}
</style>
