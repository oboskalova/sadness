<template>
    <div class="col col-auto">
      <button
        class="header-btn"
        title="Удалить группу"
        :disabled="!targetGroup || !editable"
        @click="text('to basket')"
        v-b-modal.deleteGroup>
        <i class="mi mi-delete"></i>
      </button>
      <button
        class="header-btn"
        title="Изменить группу"
        :disabled="!targetGroup"
        @click="openEdit(true)">
        <i class="mi mi-edit"></i>
      </button>
      <button
        class="header-btn"
        title="Создать группу"
        @click="openEdit(false)">
        <i class="mi mi-add"></i>
      </button>
    </div>
</template>

<script>
  export default {
    name: 'the-header-orgs-right-tools',
    computed: {
      targetGroup () {
        return this.$store.getters.targetGroup
      },
      editable () {
        if (this.targetGroup != null) {
          return this.targetGroup.org
        } else return true
      }
    },
    methods: {
      text (v) {
        console.log(v)
      },
      openEdit (v) {
        this.$store.commit('TOGGLE_EDIT_GROUP', true)
        this.$store.commit('TOGGLE_EDIT_MODE_GROUP', v)
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