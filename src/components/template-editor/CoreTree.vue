<template>
  <div
    class="core-tree"
    v-if="tree.show">
    <p :class="{ active }">
      <i
        class="mi core-tree-icon"
        :class="iconClass"
        @click.self="toggle"></i>
      <span
        class="core-tree-name"
        @click.self="select">
        {{ tree.name }}
      </span>
      <span v-if="tree.parent_id" :class="{ 'right-icons':true, 'non-editable': !tree.editable } ">
        <i v-if="!tree.hide" class="mi mi-visibility" @click="toogleVisible(true)"></i>
        <i v-if="tree.hide" class="mi mi-visibility-off" @click="toogleVisible(false)"></i>
        <i v-if="!tree.lock" class="mi mi-lock-open" @click="toogleLock(true)"></i>
        <i v-if="tree.lock" class="mi mi-lock" @click="toogleLock(false)"></i>
      </span>
      <span style="display: none">
        {{ opening }}
      </span>
    </p>
    <ul
      class="core-tree-list"
      v-if="open">
      <li
        class="core-tree-item"
        v-for="( value, key ) in children"
        :key="key">
        <core-tree :tree="value" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'core-tree',
  props: ['tree'],
  computed: {
    tId () {
      return this.$props.tree.id
    },
    capacity () {
      return this.$store.getters.coreCapacity[this.tId]
    },
    active () {
      const cId = this.$store.getters.coreActiveScene
      const sId = this.$store.getters.coreActiveContainer.id
      return (this.tId === cId) || (this.tId === sId)
    },
    opening () {
      if (this.$store.getters.openParent === this.tree.id && !this.open) {
        this.toggle()
        this.$store.commit('OPEN_PARENT', this.activeContainerId)
      }
      return this.$store.getters.openParent
    },
    children () {
      return this.$store.getters.coreGraph[this.tId]
    },
    iconClass () {
      if (this.children) {
        var show = false
        for (var key in this.children) {
          if (this.children[key].show) {
            show = true
          }
        }
        if (show) {
          return 'mi-keyboard-arrow-' + (this.open ? 'down' : 'right')
        }
      }
      return 'empty'
    }
  },
  methods: {
    toogleVisible (value) {
      if (!this.tree.editable) return
      const id = this.tree.id
      const rand = this.tree.hide
      const command = {
        type: 'updateContainerProps',
        context: { id, type: 'container' },
        newParams: { hide: !!value },
        oldParams: { hide: rand }
      }
      this.$store.dispatch('updateChosedContainerProps', {
        id: this.tree.id,
        props: { hide: !!value }
      })
      this.$store.dispatch('historyPush', command)
    },
    toogleLock (value) {
      if (!this.tree.editable) return
      value ? this.changeActionType('None') : this.changeActionType('updatingTypeMove')
      const id = this.tree.id
      const rand = this.tree.lock
      const command = {
        type: 'updateContainerProps',
        context: { id, type: 'container' },
        newParams: { lock: !!value },
        oldParams: { lock: rand }
      }
      this.$store.dispatch('updateChosedContainerProps', {
        id: this.tree.id,
        props: { lock: !!value }
      })
      this.$store.dispatch('historyPush', command)
    },
    toggle () {
      this.open = !this.open
    },
    select () {
      const id = this.$props.tree.id
      this.$store.dispatch('selectContainer', id)
      if (!this.tree.lock && this.tree.editable) {
        this.changeActionType('updatingTypeMove')
      } else {
        this.changeActionType('None')
      }
    },
    changeActionType (type) {
      this.$store.dispatch('updateActionType', type)
    }
  },
  data () {
    return {
      open: false
    }
  }
}
</script>

<style scoped>
.spacer {
  width: 35px;
  height: 12px;
  display: inline-block;
}
.right-icons {
  color: #000;
  margin-left: 5px;
  margin-right: 5px;
}
.right-icons i {
  top: 3px;
}
.right-icons i:before{
  width: 20px;
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 200ms ease;
}
.right-icons i:hover:before {
  opacity: 1;
}
.core-tree {
  color: #000;
  white-space: nowrap;
  position: relative;
  
}
.core-tree .mi-visibility, .core-tree .mi-visibility-off {
  top: 4px;
}
.core-tree p {
  margin-bottom: 5px
}
.core-tree-name {
  cursor: pointer;
  vertical-align: middle;
}
.core-tree-list {
  padding-left: 1rem;
  list-style-type: none;
}
.core-tree-icon {
  top: 0;
  cursor: pointer;
  opacity: 0.5;
  font-size: 18px;
  vertical-align: middle;
  transition: opacity 150ms ease-in-out;
}
.right-icons.non-editable {
  cursor: default!important;
}
.right-icons.non-editable i:hover:before {
  opacity: 0.5!important;
}
.core-tree-icon:hover {
  opacity: 1;
}
.active {
  color: #00b0b7;
}
.empty {
  width: 18px;
  height: 18px;
}
</style>
