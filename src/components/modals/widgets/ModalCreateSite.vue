<template>
  <b-modal
    v-model="active"
    class="modal-inner-scroller"
    no-close-on-backdrop
    size="lg"
    :title="modalTitle"
    @show="setWidgetContent"
    hide-footer>
    <div class="container">
      <div class="row row-op">
        <label>Название:</label>
        <input type="text" v-model="name" placeholder="Введите название"/>
      </div>
      <div class="row row-op" style="margin-bottom: 20px;">
        <label>Ссылка</label>
        <input 
          @keydown.up.ctrl.90="linkPrevEvent" 
          @keydown.down.ctrl.90="linkPrevEvent"
          @keydown.up.ctrl.89="linkNextEvent" 
          @keydown.down.ctrl.89="linkNextEvent" 
          @blur="linkBlurEvent" type="text" v-model="link" placeholder="http://"/>
        <div class="alert-link"
          :class="{success: alertLink.isSucc, error: alertLink.isErr}"
          v-show="alertLink.isVal">
          {{alertLink.text}}
        </div>
      </div>
      <div class="row row-op">
        <label>Обновить через</label>
        <select v-model="refresh" class="form-control" style="height: calc(2.25rem + 4px);">
          <option value="0">не обновлять</option>
          <option value="1">1 минуту</option>
          <option value="5">5 минут</option>
          <option value="30">30 минут</option>
          <option value="60">60 минут</option>
        </select>
      </div>
      <div class="row row-op">
        <label>Приближение</label>
        <select v-model="zoom" class="form-control">
          <option value="0.5">50%</option>
          <option value="0.75">75%</option>
          <option value="0.9">90%</option>
          <option value="1">100%</option>
          <option value="1.25">125%</option>
          <option value="1.5">150%</option>
          <option value="2">200%</option>
        </select>
      </div>
      <div class="row">
        <b-form-group label="Отображение">
          <b-form-radio-group @change="displaySettingsChange" v-model="isDisplayIndent">
            <b-form-radio value="false">Полностью</b-form-radio>
            <b-form-radio value="true">Область</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </div>
      <div class="row row-op" v-show="isDisplayIndent">
        <div class="col">
          <label>горизонтальный отступ</label>
          <input type="number" v-model="horizIndent" min="0"/>
        </div>
        <div class="col">
          <label>вертикальный отступ</label>
          <input type="number" v-model="verticIndent" min="0"/>
        </div>
      </div>
      <div class="row row-op">
        <div>
          <b-form-checkbox v-model="isInteract">
            Разрешить интерактивность
          </b-form-checkbox>
        </div>
        <div>        
          <b-form-checkbox v-model="isScroll" v-show="isInteract">
            Разрешить прокрутку
          </b-form-checkbox>
        </div>
      </div>
      <div class="row row-op" style="margin-top: 5px">
        <b-form-checkbox v-model="offlineHide">
          Скрывать виджет при отсутствии интернета
        </b-form-checkbox>
      </div>
        <div class="row row-footer justify-content-end">
          <button
            :disabled="!isCanCreate"
            class="btn btn-primary"
            @click="isModify?changePlaylistItem():createPlaylistItem()">{{btnConfirmTitle}}</button>
          <button
            class="btn btn-secondary"
            @click="active = false">Отмена</button>
        </div>
    </div>
  </b-modal>
</template>

<script>
import ModalWidgetHelper from './_ModalWidgetHelper.js'
import {getHeadersByUrl} from '../../../../api/template-editor'
import AlertHelper from './helpers/AlertHelper'

export default {
  name: 'modal-create-site',
  components: {},
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
        console.log('isModify')
        console.log(modalWidgetContent)
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
    isCanCreate: function () {
      return this.link !== '' && this.alertLink.isSucc
    },
    numberOfWidgets () {
      return ModalWidgetHelper.numberOfWidgets(this.allMedias, this.widgetType)
    },
    modalTitle () {
      if (this.isModify) return 'Изменение сайта'
      else return 'Добавление сайта'
    },
    btnConfirmTitle () {
      if (this.isModify) return 'Сохранить'
      else return 'Сохранить'
    }
  },
  methods: {
    // need methods
    createWidgetItem () {
      let siteItem = {
        type: 5,
        link: this.link,
        refresh: this.refresh,
        horizIndent: this.horizIndent,
        verticIndent: this.verticIndent,
        zoom: this.zoom,
        isInteract: this.isInteract,
        isScroll: this.isScroll,
        offlineHide: this.offlineHide
      }
      console.log(siteItem)
      return JSON.stringify(siteItem)
    },
    setAllDataByDefault () {
      this.id = null
      this.name = 'site' + this.numberOfWidgets
      this.link = ''
      this.refresh = 0
      this.isDisplayIndent = false
      this.horizIndent = 0
      this.verticIndent = 0
      this.zoom = 1
      this.isInteract = false
      this.isScroll = false
      this.offlineHide = false
    },
    setWidgetContent () {
      if (this.isModify) {
        // изменение
        this.alertLink.setSucc('Отображение сайта разрешено')
        const content = this.modalWidgetContent
        this.id = content.id
        this.name = content.name
        this.link = content.link
        this.refresh = content.refresh
        this.isDisplayIndent = (content.horizIndent > 0 || content.verticIndent > 0)
        this.horizIndent = content.horizIndent
        this.verticIndent = content.verticIndent
        this.zoom = content.zoom
        this.isInteract = content.isInteract
        this.isScroll = content.isScroll
        this.offlineHide = content.offlineHide
      } else this.setAllDataByDefault()
      this.modalWidgetHelper = new ModalWidgetHelper(this.$store, this.createWidgetItem)
      console.log(this.modalWidgetHelper)
      this.prevLinks = []
      this.nextLinks = []
      this.addLink(this.prevLinks, this.link)
    },
    createPlaylistItem () {
      this.modalWidgetHelper.createPlaylistItem({wName: this.name}, () => { this.active = false })
    },
    changePlaylistItem () {
      this.modalWidgetHelper.changePlaylistItem({wName: this.name, wId: this.id}, () => { this.active = false })
    },
    // local methods
    displaySettingsChange (value) {
      this.isDisplayIndent = !this.isDisplayIndent
      if (!this.isDisplayIndent) {
        this.horizIndent = 0
        this.verticIndent = 0
      }
    },
    setAlertLinkText (val, isErr) {
      this.aletLinkText = val
      this.isLinkErr = isErr
    },
    linkBlurEvent () {
      console.log('blur')
      const url = document.createElement('a')
      url.setAttribute('href', this.link)
      console.log('href', url.href)
      let link = url.href
      if (this.link) {
        getHeadersByUrl(encodeURI(link)).then((res) => {
          console.log('header fun work')
          const resData = res.data
          console.log(resData, resData.indexOf('200 OK'))
          if (resData.indexOf('200 OK') === -1) {
            this.alertLink.setErr('Такой ссылки не существует(http ошибка)')
          } else if (resData.indexOf('X-Frame-Options') !== -1) {
            this.alertLink.setErr('Отображение сайта запрещено её владельцем')
          } else this.alertLink.setSucc('Отображение сайта разрешено')
          setTimeout(() => {
            this.alertLink.clear()
          }, 3500)
        })
      }
      console.log(this.link)
      this.addLink(this.prevLinks, this.link)
      console.log(this.prevLinks)
    },
    addLink (arr, elem) {
      let index = arr.indexOf(elem)
      if (index !== -1) arr.splice(index, 1)
      if (elem) arr.push(elem)
    },
    linkHotKeys (popArr, pushArr) {
      let temp = popArr.length === 1 ? popArr[0] : popArr.pop()
      if (temp) {
        this.link = temp
        this.addLink(pushArr, this.link)
      }
    },
    linkPrevEvent () {
      this.linkHotKeys(this.prevLinks, this.nextLinks)
    },
    linkNextEvent () {
      this.linkHotKeys(this.nextLinks, this.prevLinks)
    }
  },
  data () {
    return {
      // need data
      modalWidgetHelper: null,
      widgetType: 5, // widget type
      // modal data
      isDisplayIndent: false,
      id: null,
      name: 'site1',
      link: '',
      refresh: 0,
      horizIndent: 0,
      verticIndent: 0,
      zoom: 1,
      isInteract: false,
      isScroll: false,
      offlineHide: false,
      isLinkErr: false,
      aletLinkText: null,
      alertLink: new AlertHelper(),
      prevLinks: [],
      nextLinks: []
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
</style>
