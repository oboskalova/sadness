<template>
  <div class="row no-gutters">
    <div class="col col-auto">
      <button
        class="header-btn"
        title="Удалить"
        :disabled="noSelectedPlayer || cantDelete"
        v-b-modal.delete-display>
        <i class="mi mi-delete"></i>
      </button>
      <button
        class="header-btn"
        title="Изменить"
        :disabled="noSelectedPlayer || cantEdit"
        @click="toggleRename">
        <i class="mi mi-edit"></i>
      </button>
      <button
        class="header-btn"
        title="Создать плеер"
        :disabled="cantCreate"
        v-b-modal.createDisplay>
        <i class="mi mi-add"></i>
      </button>
    </div>
  </div>
</template>

<script>
  import RulesChecker from '../../../helpers/rulesChecker'

  export default {
    name: 'the-header-displays-right-tools',
    computed: {
      noSelectedPlayer () {
        return this.$store.getters.targetDisplayId === 0
      }
    },
    mounted () {
      this.checkRule()
    },
    data () {
      return {
        cantDelete: true,
        cantEdit: true,
        cantCreate: true
      }
    },
    methods: {
      checkRule () {
        if (this.$store.getters.passport.id && this.$store.getters.userGroup.length > 0) {
          this.cantDelete = !RulesChecker.canUserDo('delete', 'players', this.$store.getters)
          this.cantEdit = !RulesChecker.canUserDo('edit', 'players', this.$store.getters)
          this.cantCreate = !RulesChecker.canUserDo('create', 'players', this.$store.getters)
        } else {
          console.log('make a timer')
          setTimeout(() => { this.checkRule() }, 200)
        }
      },
      toggleRename () {
        this.$store.commit('TOGGLE_RENAME', true)
      }
    }
  }
</script>

<style scoped>
  .separated {
    margin-right: 15px;
    border-right: 1px solid #fff;
  }
  .icon-folder-arrow,
  .icon-insert-here {
    display: block;
    transition: background 150ms ease-in-out;
  }
  .icon-folder-arrow {
    width: 30px;
    height: 20px;
    margin: 0 2px;
    margin-top: 1px;
    background: url(/static/img/icons/folder-arrow-green.svg) no-repeat;
    background-size: contain;
  }
  .icon-insert-here {
    width: 25px;
    height: 25px;
    margin: 0 auto;
    background: url(/static/img/icons/move.svg) no-repeat;
    background-size: contain;
  }
  .header-btn:not([disabled]) > .icon-folder-arrow {
    background: url(/static/img/icons/folder-arrow.svg) no-repeat;
    background-size: contain;
  }
</style>