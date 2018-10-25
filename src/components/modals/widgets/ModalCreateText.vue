<template>
  <b-modal
    v-model="active"
    @show="openModal"
    @hide="closeModal"
    no-close-on-backdrop
    size="lg"
    :title="modalTitle"
    class="modalCreateText modal-inner-scroller"
    hide-footer>
    <div class="container">
      <div class="row row-op">
        <div class="col">
          <label class="label-bold">Название:</label>
          <input type="text" v-model="name" placeholder="Введите название"/>
        </div>
      </div>
      <div class="row" style="margin-bottom: 13px; text-align: center;">
        <div class="col">
          <label class="label-bold" style="margin-bottom: 5px;">Прокрутка</label><br>
          <select v-model="mode" class="small-select">
              <option value="none">Нет</option>
              <option value="horizontal">Горизонтальная</option>
              <option value="vertical">Вертикальная</option>
          </select>
        </div>
        <div class="col">
          <div v-show="isScrolling">
            <label class="label-bold" style="margin-bottom: 5px;">Тип</label><br>
            <select v-model="effectMode" class="small-select" @change="effectModeChange">
              <option value="simple">Обычный</option>
              <option value="loop">Цикличный</option>
            </select>
          </div>
        </div>
        <div class="col-md-3">
          <div v-show="isScrolling">
            <label class="label-bold" style="margin-bottom: 5px;">Скорость прокрутки</label><br>
            <select v-model="speed" class="small-select">
              <option value="16">Очень медленно</option>
              <option value="13">Медленно</option>
              <option value="10">Средняя</option>
              <option value="8">Быстро</option>
              <option value="6">Очень быстро</option>
            </select>
          </div>
        </div>
        <div class="col">
          <div v-show="isScrolling">
            <label class="label-bold">Переход</label><br>
            <input class="input-time" type="number" v-model="transition" min="0" step="0.5"/>
            <span class="input-sec">сек</span>
          </div>
        </div>
        <div class="col">
          <div v-show="isScrolling && isSimple">
            <label class="label-bold">Задержка</label><br>
            <input class="input-time" type="number" v-model="delay" min="0" step="0.5"/>
            <span class="input-sec">сек</span>
          </div>
        </div>
      </div>
      <div class="row">
          <div class="col" v-show="isScrolling && isSimple">
            <b-form-checkbox
            v-model="leave">
            Покидать видимую область
          </b-form-checkbox>
        </div>
      </div>
      <div class="row justify-content-center">
        <div :style="prewiewWrapperStyleObj">
          <div lang="ru" ref="textContent" class="text-content" v-html="text" :style="prewiewStyleObj"></div>
        </div>
        <div><i class="mi mi-pageview radio-scroll" @click="changeScrollVisible"></i></div>
      </div>
      <tinymce v-if="isTinyMce" ref="tinymce" id="textarea" v-model="text" :toolbar1="tinyToolbar1" :plugins="tinyPlugins"
        :other_options="tinyOptions" @editorInit="tinyMceInit"></tinymce>
      <div class="row row-footer justify-content-end">
        <button
          class="btn btn-primary"
          @click="isModify?changePlaylistItem():createPlaylistItem()">Сохранить</button>
        <button
          class="btn btn-secondary"
          @click="active = false">Отмена</button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import ModalWidgetHelper from './_ModalWidgetHelper.js'
import TinyMcePlugins from './helpers/_TinyMcePlugins.js'
import tinymce from 'vue-tinymce-editor'
import EditorHelper from './helpers/EditorHelper'

export default {
  name: 'modal-create-text',
  components: {
    tinymce
  },
  watch: {
    tinyOptions () {
      this.isTinyMce = false
      this.$nextTick(() => {
        this.isTinyMce = true
      })
    }
  },
  computed: {
    extraFontFormats () {
      let fontsInfo = this.$store.getters.fontsInfo
      let extraFontFormats = ''
      if (Array.isArray(fontsInfo)) {
        fontsInfo.forEach(info => {
          extraFontFormats += `${info.name}=${info.value};`
        })
      }
      return extraFontFormats
    },
    tinyOptions () {
      let mainFontFormats = 'FuturaFuturisC=FuturaFuturisC;Roboto=Roboto;Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;'
      return {
        language_url: '/static/tiny-mce-ru.js',
        menubar: false,
        height: 250,
        font_formats: mainFontFormats + this.extraFontFormats,
        fontsize_formats: '8px 9px 10px 11px 12px 14px 16px 18px 24px 36px 48px 60px 72px 96px',
        lineheight_formats: '1 1.5 2',
        setup: (editor) => { tinySetupFun(editor, this) },
        content_css: '/static/css/tiny-mce-content.css'
      }
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
    isScrolling () {
      return this.mode !== 'none'
    },
    isSimple () {
      return this.effectMode === 'simple'
    },
    isVertical () {
      return this.mode === 'vertical'
    },
    prewiewStyleObj () {
      let res = {}
      if (this.container) {
        res.width = `${this.container.width}px`
        res.height = `${this.container.height}px`
        const s = this.previewScale
        res.transform = `scaleX(${s}) scaleY(${s})`
        res.transformOrigin = '0 0'

        if (this.mode === 'horizontal') {
          res.overflowX = this.scrollVisible ? 'scroll' : 'hidden'
          res.overflowY = 'hidden'
        } else if (this.mode === 'vertical') {
          res.overflowY = this.scrollVisible ? 'scroll' : 'hidden'
          res.overflowX = 'hidden'
        } else res.overflow = res.overflow = 'hidden'

        res.outline = '1px solid'
        res.backgroundImage = 'url(static/img/transparent.png)'
        res.backgroundRepeat = 'repeat'

        if (this.mode === 'horizontal') res.whiteSpace = 'nowrap'
      }
      return res
    },
    prewiewWrapperStyleObj () {
      let res = {}
      if (this.container) {
        res.width = `${this.previewScale * this.container.width}px`
        res.height = `${this.previewScale * this.container.height}px`
        res.marginBottom = '10px'
        res.marginTop = '5px'
      }
      return res
    },
    modalTitle () {
      if (this.isModify) return 'Изменение текста'
      else return 'Создание текста'
    },
    previewScale () {
      const w = this.container.width
      const h = this.container.height
      if (w <= 600 && h <= 300) return 0.8
      else if (w <= 1000 && h <= 600) return 0.6
      else if (w <= 1500 && h <= 1200) return 0.4
      else return 0.3
    }
  },
  methods: {
    // need methods
    createWidgetItem: function () {
      let object = EditorHelper.textToObject(this.$refs.tinymce.editor.contentDocument.body.cloneNode(true))
      console.log(object)
      let textItem = {
        type: this.widgetType,
        mode: this.mode,
        effectMode: this.effectMode,
        speed: Number(this.speed),
        transition: this.transition,
        delay: this.delay,
        text: this.text.replace(/class=".*"/g, ''),
        leave: this.leave,
        offset: 1,
        object: object
      }
      return JSON.stringify(textItem)
    },
    setAllDataByDefault () {
      this.id = null
      this.name = 'text' + this.numberOfWidgets
      this.mode = 'none'
      this.effectMode = 'simple'
      this.speed = 10
      this.delay = 0
      this.transition = 1
      this.text = ''
      this.leave = false
    },
    setWidgetContent () {
      if (this.isModify) {
        // изменение
        const content = this.modalWidgetContent
        this.id = content.id
        this.name = content.name
        this.mode = content.mode
        this.effectMode = content.effectMode
        this.speed = content.speed
        this.delay = content.delay
        this.transition = content.transition
        this.leave = content.leave
        this.text = content.text
      } else this.setAllDataByDefault()
      this.modalWidgetHelper = new ModalWidgetHelper(this.$store, this.createWidgetItem,
         {wName: this.name, wId: this.id})
    },
    openModal () {
      this.isTinyMce = true
      this.setWidgetContent()
    },
    closeModal () {
      this.setAllDataByDefault()
      this.isTinyMce = false
    },
    createPlaylistItem () {
      this.modalWidgetHelper.createPlaylistItem({wName: this.name}, () => {
        this.active = false
      })
    },
    changePlaylistItem () {
      this.modalWidgetHelper.changePlaylistItem({wName: this.name, wId: this.id}, () => {
        this.active = false
      })
    },
    // local methods
    changeScrollVisible () {
      this.scrollVisible = !this.scrollVisible
    },
    effectModeChange () {
      if (this.effectMode === 'loop') {
        this.transition = 0
      }
      if (this.effectMode === 'simple') {
        this.transition = 1
      }
    },
    setText (val) {
      this.text = val
    },
    tinyMceInit () {
      console.log('EDITOR', this.$refs.tinymce.editor)
      let editor = this.$refs.tinymce.editor
      editor.setContent(this.text)
      let organFonts = document.getElementById('organ-fonts')
      let fontStyle = organFonts.cloneNode()
      fontStyle.innerHTML = organFonts.innerHTML
      console.log('text fontStyle need add', fontStyle)
      let doc = editor.contentDocument
      console.log('text document editor', doc)
      if (doc && doc.head) {
        console.log('text fontStyle add into editor')
        doc.head.appendChild(fontStyle)
      }
    }
  },
  data () {
    return {
      defaultPadding: 2,
      defaultFontSize: 16,
      // need data
      modalWidgetHelper: null,
      widgetType: 4, // widget type
      // modal data
      scrollVisible: false,
      tinyToolbar1: 'fontselect fontsize lineheight | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright | outdent indent | wordshy _removeformat code',
      tinyPlugins: ['code, textcolor, colorpicker, paste'],
      // widget data
      id: null, // для изменений
      effectMode: 'simple',
      name: 'text',
      mode: 'none',
      speed: 10,
      delay: 0,
      text: '',
      transition: 1,
      isTinyMce: false,
      leave: false
    }
  }
}

function tinySetupFun (editor, context) {
  TinyMcePlugins.init(editor, context)
  TinyMcePlugins.addButtons(editor, context)
}
</script>

<style>
  .row-op {
    margin-bottom: 20px;
  }
  .form-control-height {
    height: calc(2.25rem + 4px) !important;
  }
  .mce-edit-area {
    border-width: 1px 1px 1px !important;
  }
  .mce-panel {
    background-color: #f5f5e2
  }
  #tinymce p {
    margin-bottom: 0px;
  }
  .radio-scroll {
    font-size: 25px;
    cursor: pointer;
  }
  .input-time {
    max-width: 60px;
    height: 30px !important;
    text-align: center;
    border: 1px solid #dad7d4 !important;
    border-radius: 4px 0px 0px 4px !important;
    padding-right: 2px !important;
  }
  .input-sec {
    margin-left: -4px;
    padding: 9px 6px 7px;
    font-weight: 400;
    line-height: 1;
    color: #5b5b5b;
    text-align: center;
    background-color: #d5d5d5;
    border: 1px solid #dad7d4;
    border-radius: 0px 4px 4px 0px;
  }
  .col-center {
    text-align: center;
  }
  .small-select {
    height: 30px !important;
    font-size: 14px;
    min-width: 128px;
    border-radius: 4px;
  }
  .label-bold {
    font-weight: 600;
    margin-bottom: 0px;
  }
  .mce-listbox[aria-label="Font Family"] {
    width: 90px;
  }
  .mce-listbox[aria-label="Font Sizes"] {
    width: 35px;
  }
  #LineHeightBtn {
    width: 45px;
  }
  .mce-listbox button {
    padding-left: 2px !important;
  }
  .modalCreateText .modal{
    overflow: hidden !important;
  }
  .modalCreateText .modal-body {
    max-height: 80vh;
    overflow-y: scroll;
  }
  #WordBreakBtn i {
    font-size: 17px;
  }
</style>