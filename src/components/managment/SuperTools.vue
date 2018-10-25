<template>
    <div class="col col-auto">
      <button
        class="header-btn"
        title="Изменить администратора"
        :disabled="!targetOrg"
        @click="openAdmin">
        <i class="mi mi-account-circle"></i>
      </button>
      <button
        class="header-btn"
        v-if="!lock"
        title="Заблокировать организацию"
        :disabled="!targetOrg"
        v-b-modal.block-org>
        <i class="mi mi-lock"></i>
      </button>
      <button
        class="header-btn"
        v-if="lock"
        title="Разблокировать организацию"
        :disabled="!targetOrg"
        v-b-modal.block-org>
        <i class="mi mi-lock-open"></i>
      </button>
      <button
        class="header-btn"
        v-show="!basket"
        title="Отправить организацию в корзину"
        :disabled="!targetOrg"
        @click="text('to basket')"
        v-b-modal.orgDelete>
        <i class="mi mi-delete"></i>
      </button>
      <button
        class="header-btn"
        v-show="basket"
        title="Восстановить организацию"
        @click="text('from basket')"
        :disabled="!targetOrg"
        v-b-modal.restore-org>
        <i class="mi mi-eject"></i>
      </button>
      <button
        class="header-btn"
        title="Изменить организацию"
        :disabled="!targetOrg"
        @click="openEdit(true)">
        <i class="mi mi-edit"></i>
      </button>
      <button
        class="header-btn"
        title="Создать организацию"
        @click="openEdit(false)">
        <i class="mi mi-add"></i>
      </button>
    </div>
</template>

<script>
  export default {
    name: 'the-header-orgs-right-tools',
    computed: {
      targetOrg () {
        return this.$store.getters.targetOrg
      },
      basket () {
        return this.$store.getters.orgBasket
      },
      lock () {
        if (this.targetOrg) {
          return this.$store.getters.targetOrg.lock
        } else return false
      }
    },
    methods: {
      text (v) {
        console.log(v)
      },
      openAdmin () {
        this.$store.commit('TOGGLE_ADMIN_ORG', true)
      },
      openEdit (v) {
        this.$store.commit('TOGGLE_EDIT_ORG', true)
        this.$store.commit('TOGGLE_EDIT_MODE_ORG', v)
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