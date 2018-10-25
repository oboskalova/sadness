<template>
  <div v-if="this.template.editable" class="col col-auto">
    <button
      class="header-btn"
      title="Отменить"
      :disabled="!mayRollback"
      @click="rollback">
      <i class="mi mi-undo"></i>
    </button>
    <button
      class="header-btn"
      title="Вперед"
      :disabled="!mayForward"
      @click="forward">
      <i class="mi mi-redo"></i>
    </button>
    <button
      class="header-btn"
      title="Удалить"
      :disabled="!deletable"
      @click="openModal">
      <i class="mi mi-delete"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'the-header-template-right-tools',
  computed: {
    template () {
      return this.$store.getters.coreTemplate
    },
    container () {
      return this.$store.getters.coreActiveContainer
    },
    mayRollback () {
      return this.$store.getters.historyMayRollback
    },
    mayForward () {
      return this.$store.getters.historyMayForward
    },
    deletable () {
      let count = 0
      if (this.container.parent_id !== 0) return true
      let obj = this.$store.getters.coreGraph[0]
      for (let key in this.$store.getters.coreGraph[0]) {
        if (obj[key].show) count++
      }
      return count > 1
    }
  },
  created () {
    document.addEventListener('keydown', this.hotkeysHandler)
  },
  destroyed () {
    document.removeEventListener('keydown', this.hotkeysHandler)
  },
  methods: {
    openModal () {
      this.$store.commit('TOGGLE_DELETE_CONTAINER', true)
    },
    rollback () {
      this.$store.dispatch('historyRollback')
    },
    forward () {
      this.$store.dispatch('historyForward')
    },
    hotkeysHandler (event) {
      const key = this.key
      const code = event.keyCode
      const ctrl = event.ctrlKey
      if (code === key.delete) {
        if (this.deletable) this.openModal()
      } else if (ctrl) {
        switch (code) {
          case key.Y:
            this.$store.dispatch('historyForward')
            event.preventDefault()
            break
          case key.Z:
            this.$store.dispatch('historyRollback')
            event.preventDefault()
            break
          case key.S:
            this.$store.dispatch('historySave')
            event.preventDefault()
            break
          default: break
        }
        return false
      }
    }
  },
  data () {
    return {
      key: {
        delete: 46,
        S: 83,
        Y: 89,
        Z: 90
      }
    }
  }
}
</script>

<style scoped>
  .header-btn {
    width: 40px;
    height: 40px;
    margin: 0;
    margin-left: 15px;
    border: none;
    background: none;
    cursor: pointer;
    transition: all .15s ease-in-out;
    border-radius: 50%;
    text-align: center;
    display: inline-block;
    vertical-align: middle;
  }
  .header-btn:not([disabled]):hover:active {
    background-color: #ff4080;
  }
  .header-btn:not([disabled]):hover {
    background-color: #00c5cc;
  }
  .header-btn > .mi {
    top: 0;
    margin-left: -1px;
    line-height: 40px;
    font-size: 30px;
    transition: color 150ms ease-in-out;
    color: white;
  }
  .header-btn[disabled] > .mi {
    color: #008f94;
  }
  .header-btn[disabled] {
    cursor: default;
  }
  .col-auto {
    padding-left: 5px;
  }
</style>
