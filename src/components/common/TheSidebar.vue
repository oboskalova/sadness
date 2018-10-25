<template>
  <aside class="aside">
    <slot></slot>
  </aside>
</template>

<script>
export default {
  name: 'the-sidebar'
}
</script>

<style scoped>
.aside {
  min-width: 20%;
  max-width: 20%;
  height: 100%;
  color: #ffffff;
  background: #333333;
  position: relative;
  flex: 1;
}
</style>
