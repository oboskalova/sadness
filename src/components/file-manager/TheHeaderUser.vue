<template>
  <div class="user">
    <img class="user-photo" :src="photoSrc" alt=""/>
    <p class="user-name">{{ name }}</p>
  </div>
</template>

<script>
  export default {
    name: 'the-header-user',
    data () {
      return {
        name: 'CSM Admin',
        photoSrc: ''
      }
    }
  }
</script>

<style scoped>
  .user {
    min-width: 200px;
    padding: 1em;
  }
  .user-photo {
    width: 36px;
    height: 36px;
    vertical-align: middle;
    display: inline-block;
    border-radius: 50%;
    background: #05a;
  }
  .user-name {
    margin: 0;
    margin-left: 8px;
    vertical-align: middle;
    display: inline-block;
  }
</style>