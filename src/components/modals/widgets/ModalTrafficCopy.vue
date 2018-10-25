<template>
<div>
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
          <label class="label-bold">Введите имя:</label>
           <div style="color: red" v-show="isErrorName">Введите адрес</div>
            <input type="text" v-modal="name" id='first' placeholder="Введите имя " @focus="show" data-layout="normal"/>
        </div>
      </div>
      <div class="row row-op">
        <div class="col">
          <label class="label-bold">Введите фамилию:</label>
          <div style="color: red" v-show="isErrorLastName">Введите адрес</div>
            <input type="text" @click="second" v-model="lastName" placeholder="Введите фамилию " @focus="show" data-layout="normal" />
        </div>
      </div>
      <div class="row row-op">
        <div class="col">
          <label class="label-bold">Введите почту:</label>
           <div style="color: red" v-show="isErrorPost">Введите адрес</div>
            <input type="text" v-model="post" placeholder="Введите почту " />
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
   <div>
  <vue-touch-keyboard v-if="visible" :layout="layout" :cancel="hide" :accept="accept" :input="input" />
  </div>
  </div>
</template>
<script>
import ModalWidgetHelper from './_ModalWidgetHelper.js'

import VueTouchKeyboard from "vue-touch-keyboard";
import style from "vue-touch-keyboard/dist/vue-touch-keyboard.css"; // load default style

export default {
  components: {
    
  },
  name: 'modal-user-view',
  data () {
    return {
      visible: false,
      layout: "normal",
      input: null,
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      modalWidgetHelper: null,
      widgetType: 100,
      id: null,
      name: '',
      lastName:'',
      post: '',
      isErrorName: false,
      isErrorLastName: false,
      isErrorPost: false,
      fontNames: [],
      fontValues: [],
      //widget data
      fontColor: '#000',
      font: 'Times New Roman',
      //coords: [0, 0],
      height: '100%',
      width: '100%',
      offlineHide: false,
      template: 0,
      reloadTime: 5,
      arr:[]
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
        this.isErrorName = false
        this.isErrorLastName = false
        this.isErrorPost = false
      }
    },
    isModify: {
      get () {
        const modalWidgetContent = this.modalWidgetContent
        return modalWidgetContent && modalWidgetContent.type === this.widgetType
      }
    },
    modalTitle () {
      if (this.isModify) return 'Изменение '
      else return 'Создание '
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
    }
    
  },

  methods: {
    /*getAddressData (data, placeResultData, id) {
      this.isError = false
      this.city = [data.locality, data.country].join(', ')
      this.coords = [data.latitude, data.longitude]
    },*/
    second(){
      this.lastName=text;
      content.lastName=text;
    },
    accept(text) {
          
          
          
         
this.hide();
        },
         show(e) {
          this.input = e.target;
          this.layout = e.target.dataset.layout;
          
          if (!this.visible)
            this.visible = true
        },
         hide() {
          this.visible = false;
        },
    
    createWidgetItem: function () {
      let trafficItem = {
        fontColor: this.fontColor,
        font: this.font,
      /*  city: this.city,*/
        //nameOfUser: this.nameOfUser,
        type: this.widgetType,
       // coords: this.coords,
        height: this.height,
        width: this.width,
        offlineHide: this.offlineHide,
        template: this.template,
        reloadTime: this.reloadTime,
        
      }
      return JSON.stringify(trafficItem)
    },
    setAllDataByDefault () {
      this.fontColor = '#000'
      this.font = 'Times New Roman'
    /*  this.city = ''*/
      this.id = null
      this.lastName = ''
      this.name = ''
      this.post = ''
      //this.coords = [0, 0]
      this.height = '100%'
      this.width = '100%'
      this.offlineHide = false
      this.template = 0
      this.reloadTime = 5
      
    },
    setWidgetContent () {
      if (this.isModify) {
        const content = this.modalWidgetContent
        this.fontColor = content.fontColor
        this.font = content.font
      /*  this.city = content.city*/
        this.lastName = content.lastName
        this.post = content.post
        this.id = content.id
        this.name = content.name
       // this.coords = content.coords
        this.height = content.height
        this.width = content.width
        this.offlineHide = content.offlineHide
        this.template = content.template
        this.reloadTime = content.reloadTime
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
      if (this.name&&this.lastName&&this.post) {
        if (this.isModify) {
          this.changePlaylistItem()
        } else {
          this.createPlaylistItem()
        }
      } 
      if(!this.name){
        this.isErrorName = true
        this.scrollTop()
      }
      if(!this.lastName){
        this.isErrorLastName = true
        this.scrollTop()
      }
      if(!this.post){
        this.isErrorPost = true
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

.footer{
   position: fixed; /* Фиксированное положение */
    left: 0; bottom: 0; /* Левый нижний угол */
    padding: 10px; /* Поля вокруг текста */
}
</style>
