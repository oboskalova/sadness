<template>
  <li class="tree-node" :class="{ 'tree-node--opened': isOpened, 'tree-node--active': isCurrentFolder }">
    <a class="tree-link link" @click="refreshCatalogue">
      <i v-if="!isEmpty"
        @click.self.stop="isOpened = !isOpened"
        class="link-icon mi mi-expand-more"></i>
      <span class="link-inner">{{ name | formatName }}</span>
    </a>
    <ul class="tree">
      <sidebar-catalogue-tree-node
        v-for="node in children"
        :key="node.id"
        :id="node.id"
        :name="node.name"
        :children="node.children" />
    </ul>
  </li>
</template>

<script>
  import { isArray } from '../../../helpers'

  export default {
    name: 'sidebar-catalogue-tree-node',
    props: [ 'id', 'name', 'children' ],
    filters: {
      formatName (value) {
        if (value.length > 16) return value.slice(0, 16) + '...'
        return value
      }
    },
    computed: {
      isCurrentFolder () {
        return this.id === +this.$route.params.id
      },
      isEmpty () {
        return !(isArray(this.children) && this.children.length)
      }
    },
    methods: {
      refreshCatalogue: function () {
        this.$router.push('/files/' + this.id)
      }
    },
    data () {
      return {
        isOpened: false
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
  .tree--root > .tree-node > .tree-link {
    padding-left: 3.1rem;
    background: #282828;
  }
  .tree--root > .tree-node > .tree-link > .link-icon {
    left: -1px !important;
  }
  .tree--root > .tree-node > .tree-link:before {
    left: 1.75rem;
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
  .tree-link:before {
    content: '';
    left: 1rem;
    width: 19px;
    height: 16px;
    background: url(/static/img/icons/file-closed.svg) no-repeat;
    background-position: center;
    position: absolute;
    display: block;
  }
  .tree-node--opened > .tree {
    display: block;
  }
  .tree-node--opened > .tree-link:before {
    background-image: url(/static/img/icons/file-opened.svg);
    background-size: contain;
  }
  .tree-node--active > .tree-link {
    color: #00b0b7 !important;
  }
  .tree-node--active > .tree-link:before {
    background-image: url(/static/img/icons/file-closed-green.svg);
  }
  .tree-node--opened.tree-node--active > .tree-link:before {
    background-image: url(/static/img/icons/file-opened-green.svg);
    background-size: contain;
  }
  .link-icon {
    top: 50% !important;
    left: -15px !important;
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