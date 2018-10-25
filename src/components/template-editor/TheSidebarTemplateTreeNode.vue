<template>
  <li class="tree-node" :class="{ 'tree-node--opened': isOpened, 'tree-node--active': isCurrentContainer }">
    <a class="tree-link link" @click="refreshCatalogue">
      <i v-if="!isEmpty"
        class="link-icon mi mi-expand-more" @click="openCatalogue"></i>
      <span class="link-inner" @dblclick="openCatalogue">{{ name | formatName }}</span>
    </a>
    <ul class="tree">
      <sidebar-template-tree-node
        v-for="node in nodesChildren"
        :key="node.id"
        :id="node.id"
        :name="node.name"
        :nodes="nodes"
        :current="current"
        v-show="node.show" />
    </ul>
  </li>
</template>

<script>
  import { isArray } from '../../../helpers'

  export default {
    name: 'sidebar-template-tree-node',
    props: ['id', 'name', 'nodes', 'current'],
    filters: {
      formatName (value) {
        if (value.length > 16) return value.slice(0, 16) + '...'
        return value
      }
    },
    computed: {
      isCurrentContainer () {
        var current = this.current
        return this.id === current
      },
      nodesChildren () {
        const id = this.id
        return this.nodes.filter(
        function (node) {
          return node.parent_id === id
        })
      },
      isEmpty () {
        return !(isArray(this.nodesChildren) && this.nodesChildren.length)
      }
    },
    methods: {
      openCatalogue: function () {
        this.isOpened = !this.isOpened
      },
      refreshCatalogue: function () {
        if (this.current !== this.id) {
          this.$store.dispatch('changeCurrentContainer', this.id)
          this.$store.commit('GET_CONTAINER_PROPERTIES', this.id)
        }
      }
    },
    data () {
      return {
        isOpened: false,
        nextNodes: []
      }
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
  .tree--root > .tree-node > .tree-link {
    padding-left: 3.1rem;
    background: #282828;
    color: #00b0b7;
  }
  .tree--root > .tree-node > .tree-link:hover {
    color: #00b0b7;
  }
  .tree--root > .tree-node > .tree-link > .link-icon {
    left: -1px !important;
  }
  .tree--root > .tree-node > .tree-link:before {
    left: 1.75rem;
    background-image: url(/static/img/icons/file-root.svg);
  }
  .tree--root > .tree-node > .tree {
    padding-left: 1.85rem;
  }
  .tree-link {
    padding: 0.9rem;
    padding-left: 2.4rem;
    position: relative;
    display: block;
  }
  .tree-node--opened > .tree {
    display: block;
  }
  .tree-node--active > .tree-link {
    color: #00b0b7 !important;
  }
  .link-icon {
    top: 50% !important;
    left: 20px !important;
    margin-top: -11px !important;
    font-size: 20px !important;
    position: absolute !important;
    transform: rotate(-90deg) !important;
    transition: transform 150ms ease-in-out !important;
  }
  .link-inner {
    padding-left: 2px;
    display: inline-block;
    vertical-align: middle;
  }
  .tree-node--opened > .tree-link > .link-icon {
    transform: none !important;
  }
</style>