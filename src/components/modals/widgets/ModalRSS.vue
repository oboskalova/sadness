<template>
  <b-modal v-model="active" class="modal-inner-scroller" 
    size="lg" 
    :title="modalTitle" 
    @show="setWidgetContent"
    @shown="scrollToTop" 
    hide-footer
    id="rssModal"
    no-close-on-backdrop>
    
    <div class="container">
      <div class="row row-op">
        <label class="label-bold">Название:</label>
        <input type="text" v-model="name" placeholder="Введите название" />
      </div>

      <div class="row row-op">
        <label class="label-bold" for="RssUrl">Ссылка</label>
        <input v-model="settings.rssUrl" type="text" id="RssUrl">
      </div>

      <div class="rss-error" v-if="error.length">
        {{ error }}
      </div>
      
      <div class="row row-op">
        <div class="row ">
          <div class="col">
            <label class="label-reload label-bold">Обновить через:</label>
            <select v-model="settings.refresh" class="form-control" style="height: calc(2.25rem + 4px); width: 200px;">
              <option :value="0">не обновлять</option>
              <option :value="1">1 минуту</option>
              <option :value="5">5 минут</option>
              <option :value="15">15 минут</option>
              <option :value="30">30 минут</option>
              <option :value="60">60 минут</option>
            </select>
          </div>
        </div>
      </div>

      <div class="row row-op">
        <div class="col-5">
          <div class="row">
            <label class="label-bold">Количество отображаемых элементов</label>
            <input v-model="settings.itemsToShow" type="number">
          </div>
        </div>
        <div class="col-6 offset-1">
          <div class="row">
            <label class="label-bold">Максимальное количество элементов</label>
            <input v-model="settings.maxQueueItems" type="number">
          </div>
        </div>
      </div>

      <div class="row" style="margin-bottom: 13px;">
        <div class="col-2 d-flex align-items-center">
          <div class="row">
              <label class="label-bold">Эффект</label>
          </div>
        </div>
        <div class="col-3">
          <div class="row">
            <select v-model="mode" class="small-select" style="width:100%">
              <option value="none">Нет</option>
              <option value="fade">Затухание</option>
              <option value="vertical">Скроллинг</option>
              <option value="paging">Перелистывание</option>
              <option value="horizontal">Бегущая строка</option>
            </select>
          </div>
        </div>
        
          <div class="col-3 offset-1 d-flex align-items-center" v-if="isScrolling">
            <div class="row">
              <label class="label-bold">Скорость прокрутки</label>
            </div>
          </div>
          <div class="col-3" v-if="isScrolling">
            <div class="row">
              <select v-model="speed" class="small-select" style="width:100%">
                <option value="16">Очень медленно</option>
                <option value="13">Медленно</option>
                <option value="10">Средняя</option>
                <option value="8">Быстро</option>
                <option value="6">Очень быстро</option>
              </select>
            </div>
          </div>
      </div>

      <div class="row row-op">
        <div class="col-md-6 d-flex align-items-center">
          <div class="row">
            <label class="label-bold" for="SecondsToShowQueue">Время отображения элементов</label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="row">
            <input class="inputs-time" type="number" id="SecondsToShowQueue" v-model="delay" min="0" style="width: 90%"/>
            <span class="input-sec" style="width: 10%">сек</span>
          </div>
        </div>
      </div>

      <div class="row row-op" id="viewWrapper" v-if="mode !== 'horizontal'">
        <b-form-group label="Шаблон" class="label-bold col">
          <b-form-radio-group id="layout1" class="d-flex justify-content-between" v-model="settings.layoutType" name="radioSubComponent">
            <b-form-radio value="layout1">
              <img src="/static/img/rss/layout1.png" width="136" height="45" class="layout-img">
            </b-form-radio>
            <b-form-radio value="layout2">
              <img src="/static/img/rss/layout2.png" width="145"  height="68" class="layout-img">
            </b-form-radio>
            <b-form-radio value="layout3">
              <img src="/static/img/rss/layout3.png" width="115"  height="102" class="layout-img">
            </b-form-radio>
            <b-form-radio value="layout4">
              <img src="/static/img/rss/layout4.png" width="87" height="149" class="layout-img">
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </div>

      <div class="row row-op">
        <b-form-group label="Отображаемые элементы" class="label-bold">
          <b-form-checkbox id="titleDataSelection" v-model="settings.dataSelection" value="title" unchecked-value="not_accepted">
            Показывать заголовок
          </b-form-checkbox>
          <b-form-checkbox id="titleDataSelection" v-model="settings.dataSelection" value="timestamp" unchecked-value="not_accepted">
            Показывать дату
          </b-form-checkbox>
          <b-form-checkbox id="titleDataSelection" v-model="settings.dataSelection" value="author" unchecked-value="not_accepted">
            Показывать автора
          </b-form-checkbox>
          <b-form-checkbox id="titleDataSelection" v-model="settings.dataSelection" value="image" unchecked-value="not_accepted">
            Показывать картинку
          </b-form-checkbox>
        </b-form-group>
      </div>

      <div class="row row-op">
        <b-form-radio-group id="layout1" class="col" v-model="settings.descriptionType.isFull" name="descriptionSnippet">
            <div class="row">
              <b-form-radio :value="false" style="display:inline-block">
                Показывать часть описания
              </b-form-radio>
              <b-form-radio class="offset-3" :value="true" style="display:inline-block">
                Показывать полное описание
              </b-form-radio>
            </div>
        </b-form-radio-group>
      </div>

      <div class="row row-op">
        <div v-show="!settings.descriptionType.isFull" class="col">
          <div class="row">
            <label for="ItemsToShow" class="label-bold">Количество отображаемых символов</label>
            <input v-model="settings.descriptionType.charactersNumber" type="number" class="form-control" id="charactersNumber">
          </div>
        </div>
      </div>

      <div class="row row-op margin-text-editor" v-show="settings.dataSelection.includes('title')">
        <label class="label-bold">Стиль заголовка</label>
        <TextEditor :inputOptions="settings.headerOptions" @styles:updated="setHeaderOptions" />
      </div>

      <div class="row row-op margin-text-editor">
        <label class="label-bold">Стиль описания</label>
        <TextEditor :inputOptions="settings.descriptionOptions" @styles:updated="setDescriptionOptions" />
      </div>
      
      <div class="row row-op margin-text-editor" v-show="settings.dataSelection.includes('timestamp')">
        <label class="label-bold">Стиль даты</label>
        <TextEditor :inputOptions="settings.timestampOptions" @styles:updated="setTimestampOptions" />
      </div>

      <div class="row row-op" v-show="settings.dataSelection.includes('author')">
        <label class="label-bold">Стиль автора</label>
        <TextEditor :inputOptions="settings.authorOptions" @styles:updated="setAuthorOptions" />
      </div>

      <div class="row row-op">
        <b-form-checkbox id="titleDataSelection" v-model="settings.isSeparatorShown">
          Показывать разделитель между записями
        </b-form-checkbox>
      </div>
      
      <div class="row row-op" v-show="settings.isSeparatorShown">
        <div class="col-5">
            <div class="row">
              <label class="label-bold">Количество пикселей</label>
              <input v-model="settings.borderPx" type="number" class="form-control" id="ItemsToShow">
            </div>
        </div>
        <div class="col-6 offset-1">
          <div class="row">
            <label class="label-bold">Выбор цвета разделителя</label>
            <input v-model="settings.borderColor"
              type="text" readonly class="color-picker--input">
            <div @click="showBorderColorPicker" class="divider-color" :style="'background:' + settings.borderColor"></div>
            <chrome id="isBorderColorPicker" v-model="pickerBorderColor"
              v-show="isBorderColorPicker" 
              @input="setTextColor" 
              class="color-picker" />
          </div>
        </div>
      </div>

      <div class="row row-op">
        <b-form-group>
          <b-form-checkbox id="titleDataSelection" v-model="settings.offlineHide">
            Скрывать виджет при отсутствии интернета
          </b-form-checkbox>
        </b-form-group>
      </div>

      <div class="shadowField" @click="closeAllMenu" v-if="isVisibleShadowField"></div>
      <div class="row row-footer justify-content-end">
        <button :disabled="isLoading" class="btn btn-primary" @click="createRss">{{btnConfirmTitle}}</button>
        <button class="btn btn-secondary" @click="active = false">Отмена</button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import ModalWidgetHelper from './_ModalWidgetHelper.js'
import TextEditor from './helpers/TextEditor'
import { Chrome } from 'vue-color'

export default {
  name: 'modal-create-rss',
  components: {
    TextEditor,
    Chrome
  },
  computed: {
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
    active: {
      get () {
        return this.modalWidgetType === this.widgetType
      },
      set (val) {
        if (val) this.modalWidgetType = this.widgetType
        else this.modalWidgetType = null
      }
    },
    isModify: {
      get () {
        const modalWidgetContent = this.modalWidgetContent
        return modalWidgetContent && modalWidgetContent.type === this.widgetType
      }
    },
    container () {
      return this.$store.getters.coreActiveContainer
    },
    allMedias () {
      const cId = this.container.id
      return this.$store.getters.coreWidgets[cId] || []
    },
    scale () {
      return this.$store.getters.scale
    },
    numberOfWidgets () {
      return ModalWidgetHelper.numberOfWidgets(this.allMedias, this.widgetType)
    },
    modalTitle () {
      if (this.isModify) return 'Изменение rss'
      else return 'Добавление rss'
    },
    btnConfirmTitle () {
      if (this.isModify) return 'Сохранить'
      else return 'Сохранить'
    },
    isScrolling () {
      return this.mode !== 'none' && this.mode !== 'fade'
    },
    isSimple () {
      return this.effectMode === 'simple'
    },
    isVertical () {
      return this.mode === 'vertical'
    }
  },
  watch: {
    mode (val, prevVal) {
      if (prevVal === 'horizontal') {
        this.settings.layoutType = 'layout1'
      }
    }
  },
  mounted () {
    this.setViewIndicatorCenterPosition()
  },
  methods: {
    // need methods
    createWidgetItem () {
      let rssItem = {
        type: this.widgetType,
        settings: this.settings,
        mode: this.mode,
        effectMode: this.effectMode,
        speed: this.speed,
        transition: this.transition,
        delay: this.delay
      }

      return JSON.stringify(rssItem)
    },
    setAllDataByDefault () {
      this.id = null
      this.name = 'rss' + this.numberOfWidgets
      this.mode = 'none'
      this.effectMode = 'simple'
      this.speed = 10
      this.transition = 1
      this.delay = 5
      this.text = ''
      this.settings = {
        rssUrl: '',
        refresh: 0,
        managingEditor: '',
        itemsToShow: 5,
        maxQueueItems: 20,
        layoutType: 'layout1',
        isSeparatorShown: false,
        borderColor: '#ffffff',
        borderPx: '1',
        dataSelection: ['title', 'timestamp', 'author', 'image'],
        descriptionType: {
          isFull: false,
          charactersNumber: 120
        },
        headerOptions: this.clone(this.defaultOptions),
        descriptionOptions: this.clone(this.defaultOptions),
        timestampOptions: this.clone(this.defaultOptions),
        authorOptions: this.clone(this.defaultOptions)
      }

      this.settings.headerOptions.fontSize = '24px'
      this.settings.headerOptions.styles.fontSize = 'font-size: 24px;'
      this.settings.descriptionOptions.fontSize = '18px'
      this.settings.descriptionOptions.styles.fontSize = 'font-size: 18px;'
      this.settings.timestampOptions.fontSize = '14px'
      this.settings.timestampOptions.styles.fontSize = 'font-size: 14px;'
      this.settings.authorOptions.fontSize = '14px'
      this.settings.authorOptions.styles.fontSize = 'font-size: 14px;'
    },
    scrollToTop () {
      let el = document.getElementById('rssModal___BV_modal_body_')
      el.scrollTo(0, 10)
    },
    setWidgetContent () {
      if (this.isModify) {
        // изменение
        const content = this.modalWidgetContent
        this.id = content.id
        this.name = content.name
        this.settings = content.settings
        this.mode = content.mode
        this.effectMode = content.effectMode
        this.speed = content.speed
        this.transition = content.transition
        this.delay = content.delay
      } else this.setAllDataByDefault()
      this.modalWidgetHelper = new ModalWidgetHelper(this.$store, this.createWidgetItem)
    },
    createPlaylistItem () {
      this.isLoading = true
      if (this.mode === 'horizontal') {
        this.settings.layoutType = 'horizontal'
      }

      this.modalWidgetHelper.createPlaylistItem({ wName: this.name }, () => { this.active = false })
      this.isLoading = false
    },
    changePlaylistItem () {
      this.isLoading = true
      if (this.mode === 'horizontal') {
        this.settings.layoutType = 'horizontal'
      }

      this.modalWidgetHelper.changePlaylistItem({ wName: this.name, wId: this.id }, () => { this.active = false })
      this.isLoading = false
    },
    effectModeChange () {
      if (this.effectMode === 'loop') {
        this.transition = 0
      }
      if (this.effectMode === 'simple') {
        this.transition = 1
      }
    },
    setHeaderOptions (value = {}) {
      this.settings.headerOptions = value
    },
    setDescriptionOptions (value = {}) {
      this.settings.descriptionOptions = value
    },
    setTimestampOptions (value = {}) {
      this.settings.timestampOptions = value
    },
    setAuthorOptions (value = {}) {
      this.settings.authorOptions = value
    },
    setTextColor (val) {
      this.settings.borderColor = val.hex
    },
    closeAllMenu () {
      this.isBorderColorPicker = false
      this.isVisibleShadowField = false
    },
    showBorderColorPicker () {
      this.isBorderColorPicker = true
      let el = document.getElementById('rssModal___BV_modal_body_')
      this.$nextTick(() => {
        el.scrollTo(0, el.scrollHeight)
        this.isVisibleShadowField = true
      })
    },
    clone (obj = null) {
      if (typeof obj !== 'object' || obj === null) {
        return obj
      }

      var copy = obj.constructor()
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr])
      }

      return copy
    },
    setViewIndicatorCenterPosition () {
      var el = document.getElementById('viewWrapper')
      var indicatorEls = el.getElementsByClassName('custom-control-indicator')
      for (var i = 0; i < indicatorEls.length; i++) {
        indicatorEls[i].style.left = '50%'
      }
    },
    createRss () {
      if (this.settings.rssUrl === '') {
        document.querySelector('#RssUrl').focus()
        this.error = 'Введите ссылку!'
        return
      }
      this.error = ''
      if (this.isModify) {
        this.changePlaylistItem()
      } else {
        this.createPlaylistItem()
      }
    }
  },
  data () {
    return {
      error: '',
      isLoading: false,
      isVisibleShadowField: false,
      pickerBorderColor: '',
      isBorderColorPicker: false,
      modalWidgetHelper: null,
      widgetType: 10,
      id: null,
      name: 'rss1',
      effectMode: 'simple',
      mode: 'none',
      speed: 10,
      delay: 5,
      text: '',
      transition: 1,
      settings: {
        rssUrl: '',
        refresh: 0,
        managingEditor: '',
        itemsToShow: 5,
        maxQueueItems: 20,
        layoutType: 'layout1',
        isSeparatorShown: false,
        borderColor: '#ffffff',
        borderPx: '1',
        dataSelection: ['title', 'timestamp', 'author', 'image'],
        descriptionType: {
          isFull: false,
          charactersNumber: 120
        },
        headerOptions: this.defaultOptions,
        descriptionOptions: this.defaultOptions,
        timestampOptions: this.defaultOptions,
        authorOptions: this.defaultOptions
      },
      defaultOptions: {
        pickerBackgroundColor: '#fff',
        pickerTextColor: '#000',
        alignType: 'left',
        fontSize: '24px',
        fontFamily: 'verdana,geneva',
        styles: {
          outputStyles: '',
          fontWeight: 'font-weight: bold;',
          fontStyle: '',
          textDecoration: '',
          backgroundColor: 'background-color: rgba(0,0,0,0);',
          textColor: 'color: #000;',
          textAlign: 'display: block; text-align: left;',
          fontSize: 'font-size: 24px;',
          fontFamily: 'font-family: verdana,geneva;'
        }
      }
    }
  }
}
</script>
<style scoped>
.rss-error {
    color: red;
    font-size: 14px;
    margin: 6px 0 10px;
}
.custom-control-indicator{
  left: 50% !important;
  border:1px solid grey; 
}
  .row-op {
    margin-bottom: 10px;
  }
  .layout-img {
    object-fit: contain;
    margin-top: 40px;
  }
  .color-picker{
    bottom: -250px;
    left: -40px;
    margin-bottom: 10px;
    position: absolute;
    z-index: 9999;
  }

  .shadowField {
    width: 100%;
    height: 100%;
    opacity: 0;
    top: 0;
    left: 0;
    border: 1px solid black;
    position: fixed;
    z-index: 999;
  }  
  .inputs-time {
    height: 30px !important;
    text-align: right;
    border: 1px solid #dad7d4 !important;
    border-radius: 4px 0px 0px 4px !important;
    padding-right: 2px !important;
  }
  .input-sec {
    margin-left: -4px;
    padding: 8px 6px 7px;
    font-weight: 400;
    line-height: 1;
    color: #5b5b5b;
    text-align: center;
    background-color: #d5d5d5;
    border: 1px solid #dad7d4;
    border-radius: 0px 4px 4px 0px;
  }
  .label-bold {
    font-weight: 600;
  }
  .custom-control-indicator{
    left: 50% !important;
  }
  .margin-text-editor{
    margin-bottom: 40px;
  }
  .divider-color{
    position: absolute; 
    height: 35px; 
    width: 35px; 
    left: 100px; 
    top: 35px;
    border: 1px solid lightgrey;
    border-radius: 5px;
    box-shadow: inset 0px 0px 3px 1px lightgrey;
  }
  
  .color-picker--input {
    width: 100%;
    min-width: 75px;
    margin-top: 1.05rem;
    border: none;
    border-bottom: 1px solid #d9d9d9;
    background-color: white;
    outline: none;
    color: #333;
  }
</style>