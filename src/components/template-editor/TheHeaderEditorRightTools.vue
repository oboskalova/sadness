<template>
  <div class="row no-gutters">
    <div class="col col-auto">
      <button
        class="header-btn"
        title="Удалить"
        :disabled="noSelectedTemplate || cantDelete"
        v-b-modal.confirm-delete>
        <i class="mi mi-delete"></i>
      </button>
      <button
        class="header-btn"
        title="Изменить"
        :disabled="noSelectedTemplate || cantEdit"
        @click="openUpdateTemplateModal">
        <i class="mi mi-edit"></i>
      </button>
      <button
        class="header-btn"
        title="Опубликовать"
        :disabled="publishedTemp || cantPublish"
        v-b-modal.confirm-publish>
        <i class="mi mi-launch"></i>
      </button>
      <button
        class="header-btn"
        title="Создать шаблон"
        :disabled="cantCreate"
        @click="openCreateTemplateModal">
        <i class="mi mi-add"></i>
      </button>
    </div>
  </div>
</template>

<script>
import RulesChecker from '../../../helpers/rulesChecker'

export default {
  name: 'the-header-file-tools',
  data () {
    return {
      cantDelete: true,
      cantCreate: true,
      cantPublish: true
    }
  },
  created () {
    this.checkRule()
  },
  computed: {
    noSelectedTemplate () {
      return !this.$store.getters.targetTemplate.id
    },
    publishedTemp () {
      return this.noSelectedTemplate || this.$store.getters.targetTemplate.published
    },
    cantEdit () {
      return this.noSelectedTemplate || !this.$store.getters.targetTemplate.edit_props
    }
  },
  methods: {
    checkRule () {
      if (this.$store.getters.passport.id && this.$store.getters.userGroup.length > 0) {
        this.cantDelete = !RulesChecker.canUserDo('delete', 'templates', this.$store.getters)
        this.cantCreate = !RulesChecker.canUserDo('create', 'templates', this.$store.getters)
        this.cantPublish = !RulesChecker.canUserDo('publish', 'templates', this.$store.getters)
      } else {
        console.log('make a timer')
        setTimeout(() => { this.checkRule() }, 200)
      }
    },
    openCreateTemplateModal () {
      this.$store.commit('TOGGLE_TEMPLATE_SETTINGS', {
        active: true,
        type: 'create'
      })
    },
    openUpdateTemplateModal () {
      this.$store.commit('TOGGLE_TEMPLATE_SETTINGS', {
        active: true,
        type: 'update'
      })
    }
  }
}
</script>

<style scoped>
  .header-btn {
    width: 50px;
    height: 50px;
    margin: 0;
    margin-right: 15px;
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
    line-height: 50px;
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
</style>