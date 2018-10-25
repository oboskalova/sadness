<template>
  <b-modal
    v-model="active"
    @show="openModal"
    @hide="closeModal"
    no-close-on-backdrop
    size="lg"
    :title="modalTitle"
    hide-footer
  >
    <div class="container" ref="container">

      <div class="row row-op">
        <div class="col">
          <label class="label-bold">Название:</label>
          <input type="text" v-model="name" placeholder="Введите название" />
        </div>
      </div>

      <div class="row row-op">
        <div class="col">
          <label class="label-bold">Введите адрес:</label>
          <vue-google-autocomplete
            id="autocomplete"
            ref="autocomplete"
            types="(cities)"
            classname="form-control"
            placeholder="Начните вводить"
            :class="{ 'input-error': isError }"
            @placechanged="getAddressData"
          ></vue-google-autocomplete>
          <div style="color: red" v-show="isError">Введите адрес</div>
        </div>
      </div>

      <div class="row row-op">
        <div class="col">
          <b-form-radio-group @change="changeProvider" v-model="provider">
            <b-form-radio value="yandex" style="margin-right: 10px">
              Yandex
            </b-form-radio>
            <b-form-radio value="google">
              Google
            </b-form-radio>
          </b-form-radio-group>
        </div>
      </div>

      <div class="row row-op">
        <div class="col-6">
          <label class="label-bold">Цветовая тема:</label>
          <select v-model="fontColor" class="form-control">
            <option value="#000">Темная</option>
            <option value="#fff">Светлая</option>
          </select>
        </div>
        <div class="col-6">
          <label class="label-bold">Шрифт:</label>
          <select v-model="font" class="form-control" :style="{ fontFamily: font }">
            <option :value="fontValues[ind]" v-for="(font, ind) in fontNames" :style="{ fontFamily: fontValues[ind] }">{{ font }}</option>
          </select>
        </div>
      </div>

      <div class="row row-op">
        <div class="col-6">
          <label class="label-bold">Частота обновления:</label>
          <select v-model="reloadTime" class="form-control">
            <option :value="5">5 минут</option>
            <option :value="10">10 минут</option>
            <option :value="15">15 минут</option>
            <option :value="30">30 минут</option>
            <option :value="45">45 минут</option>
            <option :value="60">60 минут</option>
          </select>
        </div>
        <div class="col-6">
          <label class="label-bold">Масштаб:</label>
          <select v-model="zoom" class="form-control">
            <option :value="1">1</option>
            <option :value="2">2</option>
            <option :value="3">3</option>
            <option :value="4">4</option>
            <option :value="5">5</option>
            <option :value="6">6</option>
            <option :value="7">7</option>
            <option :value="8">8</option>
            <option :value="9">9</option>
            <option :value="10">10</option>
            <option :value="11">11</option>
            <option :value="12">12</option>
            <option :value="13">13</option>
            <option :value="14">14</option>
            <option :value="15">15</option>
            <option :value="16">16</option>
            <option :value="17">17</option>
            <option :value="18">18</option>
            <option :value="19">19</option>
          </select>
        </div>
      </div>

      <div class="row row-op">
        <div class="col">
          <label class="label-bold">Шаблон</label>
          <div class="templates row-op">
            <b-form-radio-group v-model="template" :disabled="isGoogle">
              <b-form-radio :value="0"></b-form-radio>
              <div :class="{ 'disabled': isGoogle }"><img src="/static/img/traffic/0.png"></div>
            </b-form-radio-group>
            <b-form-radio-group v-model="template" :disabled="isGoogle">
              <b-form-radio :value="1"></b-form-radio>
              <div :class="{ 'disabled': isGoogle }"><img src="/static/img/traffic/1.png"></div>
            </b-form-radio-group>
            <b-form-radio-group v-model="template">
              <b-form-radio :value="2"></b-form-radio>
              <div><img src="/static/img/traffic/2.png"></div>
            </b-form-radio-group>
          </div>
        </div>
      </div>

      <div class="row row-op">
        <div class="col">
          <b-form-checkbox v-model="offlineHide">
            Скрывать виджет при отсутствии интернета
          </b-form-checkbox>
        </div>
      </div>
    
      <div class="row row-footer justify-content-end">
        <button
          class="btn btn-primary"
          @click="saveBtnClick">Сохранить</button>
        <button
          class="btn btn-secondary"
          @click="active = false">Отмена</button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import ModalWidgetHelper from './_ModalWidgetHelper.js'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import settingsList from '../../../../helpers/fonts-color-sizes.js'
import lodash from 'lodash'
const font = require('../../../lib/font')

export default {

  components: {
    VueGoogleAutocomplete
  },

  name: 'modal-traffic-view',

  data () {
    return {
      modalWidgetHelper: null,
      widgetType: 14,
      id: null,
      name: '',
      isError: false,
      fontNames: [],
      fontValues: [],
      // widget data
      fontColor: '#000',
      font: 'Times New Roman',
      city: '',
      coords: [0, 0],
      provider: 'yandex',
      height: '100%',
      width: '100%',
      offlineHide: false,
      template: 0,
      reloadTime: 5,
      zoom: 11
    }
  },

  async created () {
    this.fontNames = lodash.cloneDeep(settingsList.fonts)
    this.fontValues = lodash.cloneDeep(settingsList.fonts)
    let fontsInfo = await font.getFontsInfo()
    fontsInfo.forEach(info => {
      this.fontNames.push(info.name)
      this.fontValues.push(info.value)
    })
  },

  computed: {
    active: {
      get () {
        return this.modalWidgetType === this.widgetType
      },
      set (val) {
        if (val) this.modalWidgetType = this.widgetType
        else this.modalWidgetType = null
        this.isError = false
        this.$refs.autocomplete.update(this.city)
        this.scrollTop()
      }
    },
    isModify: {
      get () {
        const modalWidgetContent = this.modalWidgetContent
        return modalWidgetContent && modalWidgetContent.type === this.widgetType
      }
    },
    modalTitle () {
      if (this.isModify) return 'Изменение виджета пробок'
      else return 'Создание виджет пробок'
    },
    modalWidgetContent: {
      get () {
        return this.$store.getters.modalWidgetContent
      },
      set (val) {
        this.$store.commit('SET_MODAL_WIDGET_CONTENT', val)
      }
    },
    modalWidgetType: {
      get () {
        return this.$store.getters.modalWidgetType
      },
      set (val) {
        this.$store.commit('SET_MODAL_WIDGET_TYPE', val)
      }
    },
    container () {
      return this.$store.getters.coreActiveContainer
    },
    allMedias () {
      const cId = this.container.id
      return this.$store.getters.coreWidgets[cId] || []
    },
    numberOfWidgets () {
      return ModalWidgetHelper.numberOfWidgets(this.allMedias, this.widgetType)
    },
    isCanCreate: function () {
      return this.name && this.handle
    },
    isGoogle () {
      return this.provider === 'google'
    }
  },

  methods: {
    getAddressData (data, placeResultData, id) {
      this.isError = false
      this.city = [data.locality, data.country].join(', ')
      this.coords = [data.latitude, data.longitude]
    },
    changeProvider () {
      this.template = (this.isGoogle) ? 0 : 2
    },
    createWidgetItem: function () {
      let trafficItem = {
        fontColor: this.fontColor,
        font: this.font,
        city: this.city,
        type: this.widgetType,
        coords: this.coords,
        provider: this.provider,
        height: this.height,
        width: this.width,
        offlineHide: this.offlineHide,
        template: this.template,
        reloadTime: this.reloadTime,
        zoom: this.zoom
      }
      return JSON.stringify(trafficItem)
    },
    setAllDataByDefault () {
      this.fontColor = '#000'
      this.font = 'Times New Roman'
      this.city = ''
      this.id = null
      this.name = 'traffic' + this.numberOfWidgets
      this.coords = [0, 0]
      this.provider = 'yandex'
      this.height = '100%'
      this.width = '100%'
      this.offlineHide = false
      this.template = 0
      this.reloadTime = 5
      this.zoom = 11
    },
    setWidgetContent () {
      if (this.isModify) {
        const content = this.modalWidgetContent
        this.fontColor = content.fontColor
        this.font = content.font
        this.city = content.city
        this.id = content.id
        this.name = content.name
        this.coords = content.coords
        this.provider = content.provider
        this.height = content.height
        this.width = content.width
        this.offlineHide = content.offlineHide
        this.template = content.template
        this.reloadTime = content.reloadTime
        this.zoom = content.zoom
      } else this.setAllDataByDefault()
      this.modalWidgetHelper = new ModalWidgetHelper(this.$store, this.createWidgetItem,
        {wName: this.name, wId: this.id})
    },
    scrollTop () {
      this.$refs.container.parentNode.scrollTop = 0
    },
    openModal () {
      this.setWidgetContent()
    },
    closeModal () {
      this.setAllDataByDefault()
    },
    saveBtnClick () {
      if (this.city) {
        if (this.isModify) {
          this.changePlaylistItem()
        } else {
          this.createPlaylistItem()
        }
      } else {
        this.isError = true
        this.scrollTop()
      }
    },
    createPlaylistItem () {
      this.modalWidgetHelper.createPlaylistItem({ wName: this.name }, () => { this.active = false })
    },
    changePlaylistItem () {
      this.modalWidgetHelper.changePlaylistItem({ wName: this.name, wId: this.id }, () => { this.active = false })
    }
  }

}
</script>

<style scoped>
.row-op {
  margin-bottom: 15px;
}

.label-bold {
  font-weight: 600;
  margin-bottom: 0px;
}

.input-error {
  border-bottom: 1px solid red;
}

.templates {
  align-items: center;
  display: flex;
}

.templates > * {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-right: 10px;
}

.templates > *:last-child {
  margin: 0;
}

.templates .custom-radio {
  margin-left: 1em;
}

.templates img {
  object-fit: contain;
  height: 100%;
  width: 100%;
}
.custom-radio {
  margin-right: 0;
}

.disabled {
  opacity: 0.5;
}
</style>
