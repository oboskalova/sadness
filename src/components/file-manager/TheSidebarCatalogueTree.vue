<template>
  <div>
    <ul class="tree tree--root">
      <TheSidebarCatalogueTreeNode
        v-for="node in nodes"
        :key="node.id"
        :id="node.id"
        :name="node.name"
        :children="node.children" />
    </ul>
  </div>
</template>

<script scoped>
  import TheSidebarCatalogueTreeNode from './TheSidebarCatalogueTreeNode'

  export default {
    name: 'sidebar-catalogue-tree',
    components: {
      TheSidebarCatalogueTreeNode
    },
    computed: {
      nodes () {
        return this.$store.getters.driveTree
      }
    },
    methods: {
      fetchData: function () {
        return this.$store.dispatch('updateDriveTree')
      }
    },
    created () {
      this.fetchData().then(() => {
        const targetId = this.$route.params.id
        this.$store.commit('UPDATE_BREADCRUMD_LIST', targetId)
      })
    }
  }
</script>

<style scoped>
  .tree {
    margin: 0;
    padding-left: 0.85rem;
    list-style-type: none;
    display: none;
  }
  .tree--root {
    padding-left: 0;
    display: block;
  }
</style>