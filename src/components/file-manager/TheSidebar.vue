<template>
  <aside class="aside">
    <TheSidebarCatalogueTree class="aside-catalogue-tree"/>
  </aside>
</template>

<script>
  import TheSidebarCatalogueTree from './TheSidebarCatalogueTree'

  export default {
    name: 'sidebar',
    components: {
      TheSidebarCatalogueTree
    }
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
  .aside-logo {
    display: block;
    background: none !important;
    padding: 1.725em 0.65em;
  }
  .aside-nav {
    top: 50%;
    width: 100%;
    position: absolute;
    transform: translateY(-50%);
  }
  .aside-catalogue-tree {
    margin-top: 1em;
  }
</style>