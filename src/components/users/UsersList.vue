<template>
  <ul class="users-list">
    <li
      class="users-list-item"
      v-for="user in users"
      :key="user.id">
      <router-link
        class="users-list-link"
        :to="'/users/' + user.id">
        <span class="user-name">{{ user.name }}</span>
        <span class="user-email">{{ user.invited }}</span>
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'users-list',
  props: ['users']
}
</script>

<style scoped>
.users-list {
  margin: 0;
  padding: 0;
  display: block;
  list-style-type: none;
}
.users-list-item {}
.users-list-link {
  padding: 0.9rem;
  padding-left: 2.4rem;
  display: block;
  color: #fff;
}
.router-link-active {
  background: #282828;  
}
.user-name,
.user-email {
  display: block;
}
.user-email {
  font-size: 12px;
  opacity: 0.6;
}
</style>