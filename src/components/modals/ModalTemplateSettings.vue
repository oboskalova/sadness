<template>
  <b-modal centered
    v-model="active"
    :title="title"
    :ok-title="okText"
    :ok-disabled="loading"
    cancel-title="Отмена"
    @ok="save"
    @shown="openModal"
    @hide="closeModal">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link" href="#" :class="{ 'active': activeTab === 0 }" @click="toggleTo(0)">Свойства</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" :class="{ 'active': activeTab === 1 }" @click="toggleTo(1)">Теги</a>
      </li>
    </ul>
    <div v-show="!activeTab">
      <p class="label">Название шаблона</p>
      <input
        class="input"
        type="text"
        v-model="template.name">
      <Dropdown
        type="radio"
        title="Размер шаблона"
        :options="sizes"
        @changed="updateSize" />
      <div v-if="template.orientation === 0" class="row">
        <div class="col-md-6">
          <p class="label">Ширина</p>
          <input
            class="input"
            type="text"
            :value="template.width"
            @input.prevent="e => { positive('width', e) }">
        </div>
        <div class="col-md-6">
          <p class="label">Высота</p>
          <input
            class="input"
            type="text"
            :value="template.height"
            @input.prevent="e => { positive('height', e) }">
        </div>
      </div>
    </div>
    <div v-show="activeTab">
      <p class="label">Введите новые теги через пробел и нажмите Enter</p>
      <input
        class="input"
        type="text"
        v-model="newTags"
        v-on:keyup.enter="addTags()">
      <ul class="tag">
        <li class="tag-item" v-for="(item, index) in template.tagsArray">
            {{ item }}
            <i class="mi mi-close" @click="remove(index)"></i>
        </li>
      </ul>
    </div>
    <img
      v-if="loading"
      src="/static/img/spinner.gif"
      class="loader">
  </b-modal>
</template>

<script>
import Dropdown from '../common/Dropdown'
import { isFinite, cloneDeep } from 'lodash'
import { defaultTemplate as d } from '../../../helpers/defaults'
import { getTemplateObjects } from '../../../api/template-editor'

export default {
  name: 'modal-template-settings',
  props: ['type', 'activeTemplate'],
  components: { Dropdown },
  watch: {
    type (value) {
      this.updateText(value)
    },
    activeTemplate () {
      this.reset()
    }
  },
  computed: {
    active: {
      get () {
        return this.$store.getters.templateSettings
      },
      set (value) {
        this.$store.commit('TOGGLE_TEMPLATE_SETTINGS', value)
      }
    }
  },
  created () {
    this.updateText(this.$props.type)
  },
  methods: {
    remove (elem) {
      this.template.tagsArray.splice(elem, 1)
    },
    addTags () {
      var newTags = this.newTags.split(' ')
      newTags.forEach((el) => {
        if (el.length) {
          var pos = this.template.tagsArray.find(item => item === el)
          console.log(pos)
          if (pos === undefined) {
            this.template.tagsArray.push(el)
          }
        }
      })
      this.newTags = ''
    },
    toggleTo (val) {
      this.activeTab = val
    },
    updateSize (elem) {
      var el = this.sizes.find(e => e.id === elem.id)
      el.active = elem.active
      if (el.id !== 0) {
        this.template.width = el.width
        this.template.height = el.height
      }
      this.template.orientation = el.id
    },
    save () {
      const action = `${this.$props.type}Template`
      this.loading = true
      var older = []
      older = older.concat(this.template.tagsArray)
      this.template.tags = JSON.stringify(this.template.tagsArray)
      this.template.megaTags = this.template.tagsArray
      this.template.megaTags.push(this.template.name)
      this.template.megaTags = JSON.stringify(this.template.megaTags.sort())
      this.template.tagsArray = older
      let oldTemplate = cloneDeep(this.$props.activeTemplate)
      this.$store.dispatch(action, this.template).then(() => {
        this.loading = false
        this.$store.commit('TOGGLE_TEMPLATE_OBJECT', {})
        this.$store.commit('TOOGLE_TEMPLATE_LOADING', true)
        return getTemplateObjects().then(response => {
          const data = response.data
          if (!data) return
          this.$store.dispatch('uploadTemplates', data)
          this.$store.commit('TOOGLE_TEMPLATE_LOADING', false)
          console.log(this.template, oldTemplate)
          if (this.template.width !== oldTemplate.width || this.template.height !== oldTemplate.height) {
            this.$store.commit('UNPUBLISH')
          }
        }).catch(error => {
          const messageType = 'notFound'
          const responseCode = error.response.status
          this.$store.commit('DISPLAY_ALERT', { messageType, responseCode })
          this.$store.commit('TOOGLE_TEMPLATE_LOADING', false)
        })
      })
    },
    reset () {
      const t = this.$props.activeTemplate
      const target = this.$props.type === 'create' ? d : t
      d.tags = '[]'
      d.tagsArray = []
      this.template.tags = '[]'
      this.template.tagsArray = []
      this.template = Object.assign({}, target)
      console.log(d)
      console.log(this.template)
      this.newTags = ''
      if (this.$props.type === 'create') {
        this.sizes.forEach((el) => {
          el.active = el.id === 0
        })
      } else {
        this.sizes.forEach((el) => {
          el.active = el.id === this.template.orientation
        })
      }
    },
    openModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', true)
      this.reset()
    },
    closeModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', false)
    },
    positive (prop, event) {
      let value = +event.target.value
      if (!(prop in this.template)) return
      if (isFinite(value) && value >= 0) {
        this.template[prop] = value | 0
      }
      event.target.value = this.template[prop]
    },
    updateText (value) {
      switch (value) {
        case 'create':
          this.title = 'Создать новый шаблон'
          this.okText = 'Создать'
          break
        case 'update':
          this.title = 'Редактировать шаблон'
          this.okText = 'Сохранить'
          break
        default:
          this.title = 'Настройки шаблона'
          this.okText = 'Сохранить'
      }
    }
  },
  data () {
    return {
      sizes: [
        { id: 1, text: '1280 х 720 Горизонтальный', width: 1280, height: 720, active: false },
        { id: 2, text: '1280 х 768 Горизонтальный', width: 1280, height: 768, active: false },
        { id: 3, text: '1360 х 768 Горизонтальный', width: 1360, height: 768, active: false },
        { id: 4, text: '1366 х 768 Горизонтальный', width: 1366, height: 768, active: false },
        { id: 5, text: '1440 х 900 Горизонтальный', width: 1440, height: 900, active: false },
        { id: 6, text: '1680 х 1050 Горизонтальный', width: 1680, height: 1050, active: false },
        { id: 7, text: '1920 х 1080 Горизонтальный', width: 1920, height: 1080, active: false },
        { id: 8, text: '3840 х 2160 Горизонтальный', width: 3840, height: 2160, active: false },
        { id: 9, text: '720 х 1280 Вертикальный', width: 720, height: 1280, active: false },
        { id: 10, text: '768 х 1280 Вертикальный', width: 768, height: 1280, active: false },
        { id: 11, text: '768 х 1360 Вертикальный', width: 768, height: 1360, active: false },
        { id: 12, text: '768 х 1366 Вертикальный', width: 768, height: 1366, active: false },
        { id: 13, text: '1080 х 1920 Вертикальный', width: 1080, height: 1920, active: false },
        { id: 14, text: '2160 х 3840 Вертикальный', width: 2160, height: 3840, active: false },
        { id: 0, text: 'Пользовательский', active: true }
      ],
      title: '',
      okText: '',
      loading: false,
      template: {},
      activeTab: 0,
      newTags: ''
    }
  }
}
</script>

<style scoped>
.nav-link {
  color: #00b0b7;
}
.label {
  margin-bottom: 0;
}
.input {
  margin-bottom: 1.2rem;
}
ul.nav{
  margin-bottom: 10px;
}
.tag-item {
  padding: 0.2rem 0.7rem;
  border: none;
  border-radius: 15px;
  background: rgb(0, 178, 183);
  color: #fff;
  outline: none;
  cursor: pointer;
  transition: all 100ms ease;
  display: inline-block;
  margin-right: 3px;
}
.tag-item .mi {
  top: 2px;
}
.tag {
  margin: 0;
  padding: 0;
  display: block;
  list-style-type: none;
}
</style>
