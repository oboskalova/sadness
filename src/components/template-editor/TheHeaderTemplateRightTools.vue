<template>
<div class="tools-row">
  <div v-if="this.activeTemplate.editable" class="tools-container-right">
    <div class="row no-gutters justify-content-between">
      <div class="col col-auto">
        <button
          class="header-btn"
          title="Воспроизвести"
          @click="play"
          :disabled="!historyIsEmpty">
          <i class="mi mi-play-circle-outline"></i>
        </button>
        <button
          class="header-btn"
          title="Сохранить"
          @click="save"
          :disabled="historyIsEmpty">
          <i class="mi mi-save"></i>
        </button>
        <button
          class="header-btn"
          :title="tooltip"
          :disabled="publishedTemp || cantPublish"
          @click="changePublicationState">
          <i class="mi mi-launch"></i>
        </button>
      </div>
      <div class="col col-auto">
        <button
          class="header-btn"
          title="Настройки шаблона"
          @disabled="!template.edit_props"
          @click="openTemplateSettings">
          <i class="mi mi-settings"></i>
        </button>
      </div>
    </div>
  </div>
  <div v-if="this.activeTemplate.editable" class="tools-container">
    <div class="row no-gutters justify-content-between">
      <div class="col col-auto">
        <div class="template-name">
          Шаблон: {{ template.name }}
        </div>
      </div>
      <div class="col col-auto">
        <ScaleTool
          :initialScale="scale"
          :onZoomIn="changeScale"
          :onZoomOut="changeScale" />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import ScaleTool from '../common/ScaleTool'
import RulesChecker from '../../../helpers/rulesChecker'
import {
  publishTemplateObject
} from '../../../api/template-editor'

export default {
  name: 'the-header-template-right-tools',
  components: { ScaleTool },
  created () {
    this.checkRule()
  },
  computed: {
    name () {
      return this.$store.getters.passport.name
    },
    scale () {
      return this.$store.getters.scale
    },
    historyIsEmpty () {
      return !this.$store.getters.historyMaySave
    },
    template () {
      return this.$store.getters.coreTemplate
    },
    activeTemplate () {
      if (this.$store.getters.coreTemplate) {
        this.published = this.$store.getters.coreTemplate.published
      }
      return this.$store.getters.coreTemplate
    },
    publishedTemp () {
      return this.$store.getters.coreTemplate.published
    },
    tooltip () {
      return 'Опубликовать'
    }
  },
  data () {
    return {
      published: false,
      cantDelete: true,
      cantCreate: true,
      cantPublish: true
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
    changePublicationState () {
      publishTemplateObject({ id: this.activeTemplate.id, status: true }).then(response => {
        console.log(response)
        this.$store.commit('PUBLISH')
        this.$root.sockets.sendData('update', { template: this.activeTemplate.id })
      }).catch(error => {
        console.log(error)
      })
    },
    openTemplateSettings () {
      this.$store.commit('TOGGLE_TEMPLATE_SETTINGS', true)
    },
    play () {
      const templateId = this.$route.params.id
      const routeData = this.$router.resolve(`/player/${templateId}`)
      window.open(routeData.href, '_blank')
    },
    save () {
      this.$store.dispatch('historySave', { sockets: this.$root.sockets, id: this.$route.params.id })
    },
    changeScale (oldZoom, newZoom) {
      window.localStorage.setItem('Zoom' + this.$route.params.id, newZoom)
      this.$store.commit('CHANGE_SCALE', { oldZoom, newZoom })
    }
  }
}
</script>

<style scoped>
  .header-btn {
    width: 40px;
    height: 40px;
    margin: 0;
    margin-right: 13px;
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
  .tools-row {
    width: 82.5%;
  }
  .tools-container {
    width: 77.5%;
  }
  .tools-container-right{
    width: 22%;
    float: right;
  }
  .scale {
    display: inline-block;
    vertical-align: middle;
    margin-right: 50px!important;
  }
  .template-name {
    padding-top: 9px;
  }
  .margin-right {
    margin-right: 120px;
  }
</style>