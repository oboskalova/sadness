<template>
  <b-modal
    ref="modal"
    class="modal-inner-scroller"
    v-model="active"
    @show="openModal"
    @hide="closeModal"
    no-close-on-backdrop
    size="lg"
    :title="modalTitle"
    hide-footer>
    <div class="container">
      <div class="row row-op" :class="{lowOp: local.isJsonTree}">
        <div class="col">
          <label class="label-bold">Название:</label>
          <input type="text" v-model="name" placeholder="Введите название"/>
        </div>
      </div>
      <div class="row" style="margin-bottom: 12px;" :class="{lowOp: local.isJsonTree}">
        <div class="col">
          <label class="label-bold">Ссылка:</label>
          <input
            @keydown.up.ctrl.90="linkHotKeys('prev')"
            @keydown.down.ctrl.90="linkHotKeys('prev')"
            @keydown.up.ctrl.89="linkHotKeys('next')"
            @keydown.down.ctrl.89="linkHotKeys('next')"
            @blur="linkBlurEvent" type="text" v-model="widget.link" placeholder="http://"/>
          <div class="alert-link"
            :class="{success: local.alertLink.isSucc, error: local.alertLink.isErr}"
            v-show="local.alertLink.isVal">
            {{local.alertLink.text}}
          </div>
        </div>
      </div>
      <div class="row" :class="{lowOp: local.isJsonTree}">
        <div class="col-md-3">
          <b-form-radio-group class="radio-format" v-model="widget.isXml">
            <b-form-radio :value="true">
              XML
            </b-form-radio>
            <b-form-radio :value="false">
              JSON
            </b-form-radio>
          </b-form-radio-group>
        </div>
        <div class="col">
          <label class="label-bold" style="padding: 5px;">Количество отображаемых знаков:</label><br>
          <input class="input-char" type="number" v-model="widget.tree.charCount" min="1" step="1"/>
        </div>
        <div class="col">
          <label class="label-bold">Обновить через:</label>
          <select v-model="widget.refresh" class="form-control" style="height: calc(2.25rem + 4px); width: 200px;">
            <option value="0">не обновлять</option>
            <option value="1">1 минуту</option>
            <option value="5">5 минут</option>
            <option value="15">15 минут</option>
            <option value="30">30 минут</option>
            <option value="60">60 минут</option>
          </select>
        </div>
      </div>
      <div class="row" style="margin-top: 5px;" :class="{lowOp: local.isJsonTree}">
        <div class="col-md-3">
          <label class="label-bold" style="padding: 5px;">Макс глубина:</label>
          <input class="input-num" type="number" v-model="widget.tree.maxDepth" min="1" step="1"/>
        </div>
        <div class="col-md-2">
          <b-form-checkbox style="margin-top: 5px;" v-model="widget.tree.isKey">
            Показывать ключи
          </b-form-checkbox>
        </div>
        <div class="col-md-2">
          <b-form-checkbox style="margin-top: 5px;" v-model="widget.tree.isIndent">
            Создавать отступы
          </b-form-checkbox>
        </div>
        <div class="col-md-2">
          <b-form-checkbox style="margin-top: 5px;" v-model="widget.tree.isWordshy">
            Переносить текст
          </b-form-checkbox>
        </div>
        <div class="col-md-3">
          <button class="btn btn-secondary btn-md" @click="openSourceModal">Источник</button>
        </div>
      </div>
      <div ref="sourceModal" style="display:none; pointer-events: initial;" class="modal-source justify-content-center container">
        <div class="row" style="overflow: hidden; height: 88%;">
          <tree-view ref="treeView" v-if="local.isJsonTree" :data="widget.tree.root"
          :options="{maxDepth: widget.tree.maxDepth, rootObjectKey: 'Данные'}"></tree-view>
        </div>
        <div class="row modal-source-footer ">
          <button
            style="float: right;"
            class="btn btn-primary btn-sm"
            @click="treeChange">Применить</button>
          <button
            style="float: right;"
            class="btn btn-secondary btn-sm"
            @click="closeSourceModal">Отмена</button>
        </div>
      </div>
      <div class="row row-op" :class="{lowOp: local.isJsonTree}">
        <div class="col">
          <b-form-radio-group class="radio-edit" v-model="local.isTinyEdit">
            <b-form-radio :value="true">
              Редактирование
            </b-form-radio>
            <b-form-radio :value="false">
              Предпросмотр
            </b-form-radio>
          </b-form-radio-group>
        </div>
      </div>
      <tinymce :class="{lowOp: local.isJsonTree}" v-if="local.isTinyMce" ref="tinymce" id="textarea-parser"
        v-model="local.tinyModel"
        :toolbar1="local.tinyToolbar1" :plugins="local.tinyPlugins"
        :other_options="tinyOptions" @editorInit="tinyMceInit"></tinymce>
      <div class="row row-op" style="margin-top: 15px;" :class="{lowOp: local.isJsonTree}">
        <div class="col">
          <b-form-checkbox v-model="widget.offlineHide">
            Скрывать виджет при отсутствии интернета
          </b-form-checkbox>
        </div>
      </div>
      <div :class="{lowOp: local.isJsonTree}" class="row row-footer justify-content-end">
        <button
          :disabled="!isCanCreate"
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
import Vue from 'vue'
import ModalHelper from './helpers/ModalHelper'
import EditorHelper from './helpers/EditorHelper'
import AlertHelper from './helpers/AlertHelper'
import LinksHelper from './helpers/LinksHelper'
import JsonTree from '../../widgets/components/JsonTree/'
import axios from 'axios'
import tinymce from 'vue-tinymce-editor'
import parserXmlLight from 'xml2json-light'

const widgetDefault = () => {
  return {
    link: '',
    refresh: 0,
    isXml: true,
    offlineHide: false,
    tree: {
      root: null,
      tokenText: '',
      maxDepth: 5,
      isKey: false,
      isIndent: false,
      isWordshy: false,
      charCount: 120
    }
  }
}

const localDefault = (context) => {
  return {
    linksHelper: new LinksHelper(),
    tinyToolbar1: EditorHelper.toolbar1.replace('wordshy', ''),
    tinyPlugins: EditorHelper.plugins,
    isJsonTree: false,
    isTinyMce: true,
    alertLink: new AlertHelper(),
    tinyModel: '',
    isTinyEdit: true,
    text: ''
  }
}

export default {
  name: 'modal-parser',
  components: {tinymce},
  mixins: [ModalHelper.getMixin()],
  created () {
    JsonTree.install(Vue)
  },
  computed: {
    fontsInfo () {
      return this.$store.getters.fontsInfo
    },
    tinyOptions () {
      return EditorHelper.getOptions({
        langPath: '/static/tiny-mce-ru.js',
        setupFun: (editor) => { EditorHelper.setupFun(editor, this) },
        extraFonts: this.fontsInfo
      })
    },
    charCount () {
      return this.widget.tree.charCount
    },
    isCanCreate: function () {
      return this.widget.link !== '' && !this.local.alertLink.isVal
    },
    modalTitle () {
      if (this.isModify) return 'Изменение Parser'
      else return 'Добавление Parser'
    },
    treeToken () {
      return this.widget.tree.tokenText
    },
    isTinyEdit () {
      return this.local.isTinyEdit
    },
    tinyModel () {
      return this.local.tinyModel
    }
  },
  methods: {
    // begin ModalHelper use
    nameDefault () {
      return 'parser'
    },
    widgetDefault () {
      return widgetDefault()
    },
    localDefault () {
      return localDefault(this)
    },
    // end ModalHelper use
    linkBlurEvent () {
      if (this.widget.link && !this.local.alertLink.isVal) {
        // axios.get('http://visionproxy.cubicservice.ru:8888/daily_utf8.xml', { headers: {'proxyhost': 'www.cbr-xml-daily.ru'} })
        //   .then(response => {
        //     console.log('work', response)
        //   })
        //   .catch((error) => {
        //     console.log(error)
        //   })
        /* const instance = axios.create({
          transformRequest: [
            (data, headers) => {
              delete headers.common.Authorization
              return data
            }
          ]
        })
        var linker = this.widget.link.split('//')[this.widget.link.split('//').length - 1]
        var posL = linker.indexOf('/')
        var host = linker.substring(0, posL)
        var uri = linker.substring(posL)
        console.log(linker, posL, host, uri)
        let config = { headers: {'proxyhost': host} }
        instance.get('https://visionproxy.cubicservice.ru:8888' + uri, config) */
        // let config = { headers: { 'Cache-Control': 'no-cache' } }
        axios.get('https://visionproxy.cubicservice.ru?url=' + this.widget.link)
          .then(res => {
            console.log('ответ', res)
            if (res && res.status !== 200) {
              this.local.alertLink.setErr('Не удалось получить данные')
            } else {
              try {
                let jsonSource = {}
                if (this.widget.isXml) {
                  console.log('xml')
                  jsonSource = parserXmlLight.xml2json(res.data)
                } else {
                  if (res.data instanceof String) {
                    console.log('json string')
                    jsonSource = JSON.parse(res.data)
                  } else if (res.data instanceof Object) {
                    console.log('json object')
                    jsonSource = res.data
                  } else throw new Error('Данные невалидны')
                }
                if (this.widget.tree.root) {
                  let checks = JsonTree.checkInfo(this.widget.tree.root)
                  this.widget.tree.root = JsonTree.parsedData(jsonSource, checks)
                } else this.widget.tree.root = JsonTree.parsedData(jsonSource)
                this.local.alertLink.setSucc('Данные по ссылке успешно получены')
              } catch (err) {
                console.log(err)
                this.local.alertLink.setErr('Не удалось распарсить полученные данные')
              }
              setTimeout(() => {
                this.local.alertLink.reset()
              }, 3500)
            }
          })
          /* eslint-disable handle-callback-err */
          .catch(err => {
            console.log('ответ', err)
            this.local.alertLink.setErr('Не удалось получить данные')
          })
      }
      this.local.linksHelper.addPrev(this.widget.link)
    },
    linkHotKeys (dir) {
      switch (dir) {
        case 'prev':
          this.widget.link = this.local.linksHelper.popPrev(this.widget.link)
          break
        case 'next':
          this.widget.link = this.local.linksHelper.popNext(this.widget.link)
          break
      }
    },
    tinyMceInit () {
      let editor = this.$refs.tinymce.editor
      editor.setContent(this.widget.tree.tokenText)
      let organFonts = document.getElementById('organ-fonts')
      let fontStyle = organFonts.cloneNode()
      fontStyle.innerHTML = organFonts.innerHTML
      console.log('parser fontStyle need add', fontStyle)
      let doc = editor.contentDocument
      console.log('parser document editor', doc)
      if (doc && doc.head) {
        console.log('parser fontStyle add into editor')
        doc.head.appendChild(fontStyle)
      }
      editor.on('NodeChange', (e) => {
        let root = editor.dom.getRoot()
        let selNode = editor.selection.getNode()
        let select = editor.selection.getContent()
        if (select && selNode !== root) {
          editor.selection.select(selNode)
        } else if (select) {
          if (!JsonTree.isTokensText(select)) {
            editor.selection.collapse()
          }
        }
      })
    },
    treeChange () {
      console.log('treeChange:')
      console.log(this.widget.tokenText)
      if (this.widget.tree.tokenText) {
        let styles = JsonTree.stylesInfo(this.widget.tree.tokenText)
        console.log('styles', styles)
        this.widget.tree.tokenText = JsonTree.toToken(this.widget.tree, styles)
      } else this.widget.tree.tokenText = JsonTree.toToken(this.widget.tree)
      this.local.text = JsonTree.toText(this.widget.tree)
      let content = this.isTinyEdit ? this.widget.tree.tokenText : this.local.text
      this.$refs.tinymce.editor.setContent(content)
      this.closeSourceModal()
    },
    openModal () {
      this.setDataByContent()
      this.local.linksHelper.addPrev(this.widget.link)
      this.local.tinyModel = this.widget.tree.tokenText
      this.local.isTinyMce = true
      // if (this.widget.link) this.linkBlurEvent()
    },
    closeModal () {
      this.closeSourceModal()
      this.setDataByDefault()
      this.local.isTinyMce = false
      if (this.$refs.modal.$el) {
        this.$refs.modal.$el.querySelector('.modal-body').scrollTop = 0
      }
    },
    openSourceModal () {
      let modal = this.$refs.modal.$el
      let modalBody = modal.querySelector('.modal-body')
      if (modalBody) {
        modalBody.style.pointerEvents = 'none'
        // modalBody.style.opacity = 0.5
      }
      let sourceModal = this.$refs.sourceModal
      sourceModal.classList.remove('modal-source-close')
      sourceModal.classList.add('modal-source-open')
      sourceModal.style.display = 'block'
      this.local.isJsonTree = true
    },
    closeSourceModal () {
      let modal = this.$refs.modal.$el
      let modalBody = modal.querySelector('.modal-body')
      if (modalBody) {
        modalBody.style.pointerEvents = 'initial'
        // modalBody.style.opacity = 1
      }
      let sourceModal = this.$refs.sourceModal
      sourceModal.classList.remove('modal-source-open')
      sourceModal.classList.add('modal-source-close')
      sourceModal.style.display = 'none'
      this.local.isJsonTree = false
    },
    // need for tiny mce btn plugins
    setText (val) {
      this.local.tinyModel = val
    }
  },
  watch: {
    link () {
      var objRE = /(^https?:\/\/)?[a-z0-9~_\-.]+\.[a-z]{2,9}((\/|:|\?)(.*))?$/i
      console.log(this.widget.link && this.widget.link !== '' ? objRE.test(this.widget.link) : true)
      let isValid = this.widget.link && this.widget.link !== '' ? objRE.test(this.widget.link) : true
      if (!isValid) this.local.alertLink.setErr('Некорректная ссылка')
      else this.local.alertLink.reset()
    },
    tinyModel (newValue) {
      if (this.isTinyEdit && this.widget.tree) {
        let self = this
        JsonTree.isSyncWithTokenText(newValue, this.widget.tree)
          .then(() => {
            self.widget.tree.tokenText = newValue
            self.local.text = JsonTree.toText(self.widget.tree)
          })
          .catch(() => {
            if (self.$refs.tinymce && self.$refs.tinymce.editor) {
              let editor = self.$refs.tinymce.editor
              if (editor) editor.setContent(self.widget.tree.tokenText)
            }
          })
      }
    },
    isTinyEdit (val) {
      let toolbar = this.$refs.tinymce.editor.editorContainer.querySelector('.mce-first')
      if (val) {
        if (toolbar) toolbar.style.display = 'block'
        this.$refs.tinymce.editor.setContent(this.widget.tree.tokenText)
        this.$refs.tinymce.editor.getBody().setAttribute('contenteditable', true)
      } else {
        if (toolbar) toolbar.style.display = 'none'
        this.$refs.tinymce.editor.setContent(this.local.text)
        this.$refs.tinymce.editor.getBody().setAttribute('contenteditable', false)
      }
    },
    charCount () {
      this.local.text = JsonTree.toText(this.widget.tree)
      if (!this.local.isTinyEdit) this.$refs.tinymce.editor.setContent(this.local.text)
    },
    tinyOptions () {
      this.local.isTinyMce = false
      this.$nextTick(() => {
        this.local.isTinyMce = true
      })
    }
  },
  data () {
    return {
      widgetType: 11,
      id: null,
      name: this.nameDefault(),
      widget: this.widgetDefault(),
      local: this.localDefault()
    }
  }
}
</script>

<style scoped>
  .row-op {
    margin-bottom: 10px;
  }
  .alert-link {
    margin-top: 10px;
    margin-bottom: 0px;
  }
  .error {
    color: #721c24;
    font-size: 16px;
  }
  .success {
    color: #2b5c2f;
    font-size: 10px;
  }
  .label-bold {
    font-weight: 600;
    margin-bottom: 0px;
  }
  .input-num {
    max-width: 40px;
    height: 30px !important;
    text-align: center;
    border: 1px solid #dad7d4 !important;
    border-radius: 4px 0px 0px 4px !important;
    padding-right: 2px !important;
  }
  .input-char {
    height: 30px !important;
    text-align: center;
    padding-right: 2px !important;
  }
  .label-reload {
    float: left;
    margin-right: 20px;
    padding-top: 13px;
  }
  .radio-format {
    padding-top: 25px;
  }
  .radio-edit {
    padding-top: 13px;
  }
  .modal-source {
    position: fixed;
    top: 15%;
    left: 10%;
    background: whitesmoke;
    width: 80%;
    height: 80%;
    outline: 0.2px solid #d4c7c7;
    z-index: 1;
  }

  .modal-source-open {
    opacity: 1;
  }

  .modal-source-close {
    opacity: 0;
    transition: opacity 0.15s linear;
  }

  .modal-source-footer {
    bottom: 0px;
    right: 15px;
    position: absolute;
  }

  .tree-view-wrapper {
    padding-top: 10px;
    padding-left: 10px;
  }

  .lowOp {
    opacity: 0.5;
  }
</style>
