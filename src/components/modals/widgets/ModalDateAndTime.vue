<template>
<div> <div class="shadowField" @click="closeAllMenu" v-if="isVisibleShadowField" ref="shadow"></div>
    <b-modal
    v-model="active"
    @show="setWidgetContent"
    size="lg"
    :title="modalTitle"
    class="modalCreateDate modal-inner-scroller"
    hide-footer
    no-close-on-backdrop
     style="overflow=hidden">
      <div class="container">
      	<div class="row row-op">
        	<div class="col">
          	<label>Название:</label>
          	<input type="text" v-model="name" placeholder="Введите название"/>
        </div>
      </div>
            <label class="lbl">Время</label>
            <div class="row row-op">
           <div class="col-md-4">
                <label>
                    <input type="checkbox"
                    name="showtime"
                    v-model="isVisibleTime"
                     @click="toggleTime"
                      @change="check"
                       :disabled.prop="disabledTime">
                        Показать время
                </label>
            </div>
            <div class="col-md-8" style="height: 57px;">
                <select name="hoursType"
                class="form-control"
                v-if="isVisibleTime"
                v-model="selectedTimeFormat">
                    <option value="h:mm A">12-часовой формат</option>
                    <option value="HH:mm">24-часовой формат</option>
                </select>
            </div>
        </div>
            <label class="lbl">Дата</label>
            <div class="row row-op">
               <div class="col-md-4">
                    <label>
                        <input type="checkbox" name="showtime"
                             v-model="isVisibleDate"
                             @change="check"
                            @click="toggleDate"
                            :disabled.prop="disabledDate">
                        Показать дату
                    </label>
                </div>
                <div class="col-md-8" style="height: 57px;">
                    <select name="hoursType"
                    class="form-control"
                    v-if="isVisibleDate"
                    v-model="selectedDateFormat">                       
                        <option value="DD.MM.YYYY">{{zeroOpt}}</option>
                        <option value="MMMM DD, YYYY">{{firstOpt}}</option>
                        <option value="MMM DD YYYY">{{secondOpt}}</option>
                        <option value="MM/DD/YYYY">{{thirdOpt}}</option>
                        <option value="DD/MM/YYYY">{{fourthOpt}}</option>
                    </select>
                </div>
            </div>
				<div class="row row-op">
					<div class="col-md-4">
							<label><input type="radio" name="timezone" @change="timeZonesChange" value=false v-model="timeZonesCondition" ref="first"> Часовой пояс пользователя</label>
							<label><input type="radio" name="timezone" @change="timeZonesChange" value=true v-model="timeZonesCondition" ref="second"> Другой часовой пояс</label>
              <select style="font-size: 14px" class="form-control" v-model="timeZone" v-if="timeZonesCondition">
							<option  v-for="timezone in timeZones">{{timezone}}</option>
						</select>
					</div>
					<div class="col-md-12">
           <div class="container">
   <div class="shadowField" @click="closeAllMenu" v-if="isVisibleShadowField"></div>
    <div class="settings-bar row row-op">       
        <ul class="buttons">
            <li class="fontFamily moreIndex" @click="toggleFonts"><span style="padding-left: 10px;">{{fontName}}</span></li>
            <div class="title title-1">
               Шрифт 
            </div>
            <li class="block-fonts moreIndex" v-if="fontsMenu">
                <p class="fontTarget" @click='changeFamily(font, fontValues[ind])'  v-for="(font, ind) in fontNames" :style="{fontFamily: fontValues[ind]}"> {{font}} </p>
            </li>
            <li class="fontSize bt-2 moreIndex" @click="toggleSizes"><input ref="handInput" @keyup.13="submit" @change="controlSizeInput" type="number" max="380" class="handinput" v-model="fontSize" v-show="sizesMenu">{{fontSize + 'px'}}</li>
             <div class="title title-2">
               Размер текста 
            </div>
            <hr style="transform: rotate(90deg); background: rgb(193,193,193); width: 40px; margin-right: -15px; margin-left: -15px">
            <li class="block-sizes moreIndex" v-if="sizesMenu">        
                <p v-for="size in sizes" class="sizesTarget" @click="changeFontSize(size)"> {{size}} </p>
            </li>
             <li class="btColor moreIndex" @click="toggleTextColorMenu"><i class="mce-ico mce-i-forecolor" style="margin-right:2px"></i>
             <i style="margin-top: 6px;" class="mce-caret"></i></li>
            <div class="title title-3">
               Цвет текста    
            </div>
            <hr :style="{backgroundColor: this.color}" class="underColorFirst">
            <li class="btColor2 moreIndex" @click="toggleBgColorMenu"> <i style="margin-right:4px" class="mce-ico mce-i-backcolor"></i>
            <i style="margin-top: 6px" class="mce-caret"></i></li>
            <div class="title title-4">
               Цвет фона    
            </div>
            <hr :style="{backgroundColor: this.backgroundColor}" class="underColor">
            <hr style="transform: rotate(90deg); background: rgb(193,193,193); width: 40px; margin-right: -15px; margin-left: -15px">
            <!-- colorBlocks-->
              <div class="text-color-block moreIndex" v-if="textColorMenu">
                <div class="textcolor-blocks" v-for="color in colors" :style="{background: color}" @click=changeTextColor(color)></div>
                <div class="textcolor-blocks close-blocks" @click="canselColor">×</div>
                <label class="ownChoose">
                <span class="buttonPicker" @click="toggleColorPicker">Выбрать...</span>               
                <div          
                  class="color-picker--wrap">
                  <Chrome
                    v-if="colorPicker"
                    class="color-picker--core"
                    :value="colorss"
                    @input="changeWithPicker" 
                    v-model="colorss"/>
                </div>
                </label>
            </div>
            <!-- colorBlocksEnd-->
              <!-- colorBlocks-->
              <div class="text-colorBg-block moreIndex" v-if="bgColorMenu">
                <div class="textcolor-blocks" v-for="color in colors" :style="{background: color}" @click=changeBgcolor(color)></div>
                <div class="textcolor-blocks close-blocks" @click="canselBgColor">×</div>
                <label class="ownChoose">
                <span class="buttonPicker" @click="toggleColorPicker">Выбрать...</span>               
                <div
                  class="color-picker--wrap">
                  <Chrome
                    v-if="colorPicker"
                    class="color-picker--core"
                    :value="colorss"
                    @input="changeWithPickerBg" 
                    v-model="colorss"/>
                </div>
                </label>
            </div>
            <!-- colorBlocksEnd-->
             <li class="moreIndex bt mce-ico mce-i-bold" @click="toggleBoldText"></li>
             <div class="title title-5">Полужирный</div>    
              <li class="moreIndex bt mce-ico mce-i-italic" @click="toggleItalicText"></li>
             <div class="title title-6">Курсив</div>
             <li class="moreIndex bt mce-ico mce-i-underline" @click="toggleUnderline"></li>
             <div class="title title-7">Подчеркнутый</div>
             <li class="moreIndex bt mce-ico mce-i-strikethrough" @click="toggleLineThrough"></li>
             <div class="title title-8">Зачеркнутый</div>
             <hr style="transform: rotate(90deg); background: rgb(193,193,193); width: 40px; margin-right: -15px; margin-left: -15px">
            <li class="moreIndex bt bt bt-3 moreIndex mce-ico mce-i-alignleft" @click="changeTextAlign('left')"></li>
            <div class="title title-9">По левому краю</div>
            <li class="moreIndex bt bt bt-4 moreIndex mce-ico mce-i-aligncenter" @click="changeTextAlign('center')"></li>
             <div class="title title-10">По центру</div>
            <li class="moreIndex bt bt bt-5 moreIndex mce-ico mce-i-alignright" @click="changeTextAlign('right')"></li>
             <div class="title title-11">По правому краю</div>
            <li class="moreIndex bt bt bt-6 moreIndex mce-ico mce-i-alignjustify" @click="changeTextAlign('justify')"></li>
            <div class="title title-12">По ширине</div>
            <hr style="transform: rotate(90deg); background: rgb(193,193,193); width: 40px; margin-right: -15px; margin-left: -15px">
            <li class="moreIndex bt mce-ico mce-i-removeformat" @click="changeOnDefault"></li>
             <div class="title title-13">Очистить формат</div>
            <li class="moreIndex bt mce-ico mce-i-code" @click="openSource"></li>
             <div class="title title-14">Исходный код</div>
            <div class="showSource" v-if="showSource"> 
              <div class="headerSource">
                Исходный код
                <i class="mce-ico mce-i-remove" @click="closeSource"></i>
              </div>
              <div class="bodySource">
                {{showSourseCode}}
              </div>
              <div class="footerSource">
                <span class="okey" @click="closeSource">Oк</span>
                <span class="cansel" @click="closeSource">Отменить</span>
              </div>
            </div>
        </ul>           
    </div>
    </div>
          <div style="padding: 20px 0 20px 0;" class="display">
            <div class="display-current-time" :style="styObj">
                <span :style="{background:styObj.backgroundColorr,textDecoration:styObj.textDecorationThr}" ref="timeText" id="timeShow" v-if="isVisibleTime"> {{currentTime}} </span>
                <span :style="{background:styObj.backgroundColorr,textDecoration:styObj.textDecorationThr}" ref="dateText" id="dateShow" v-if="isVisibleDate"> {{currentDate}} </span>
            </div>
        </div>
					</div>
				</div>

        <div class="row row-footer justify-content-end">
        <button
         @click="isModify?changePlaylistItem():createPlaylistItem()"
          class="btn btn-primary">
          {{btnConfirmTitle}}</button>
        <button
            @click="active=false"
          class="btn btn-secondary"
          >Отмена</button>
      </div>
    </div>
    </b-modal>
    </div>
</template>

<script>
import moment from 'moment-timezone'
import ModalWidgetHelper from './_ModalWidgetHelper.js'
import timeZoness from '../../../../helpers/time-zones.js'
import settingsList from '../../../../helpers/fonts-color-sizes.js'
import {Chrome} from 'vue-color'
import lodash from 'lodash'
moment().locale('en')
const font = require('../../../lib/font')

export default {
  components: {
    Chrome
  },

  data () {
    return {
      timeZonesCondition: false,
      timeZones: timeZoness.timeZones,
      timeZone: 'Europe/Moscow',
      modalWidgetHelper: null,
      widgetType: 6, // widget type
      isVisibleTime: true,
      isVisibleDate: true,
      disabledDate: false,
      disabledTime: false,
      selectedTimeFormat: 'HH:mm',
      selectedDateFormat: 'DD.MM.YYYY',
      name: 'DateAndTime',
      title: 'Дата и время',
      id: null,
      fontNames: [],
      fontValues: [],
      sizes: settingsList.sizes,
      colors: settingsList.colors,
      fontName: 'Arial',
      fontFamily: 'Arial',
      fontSize: 16,
      color: '',
      backgroundColor: '',
      fontWeight: '',
      fontStyle: '',
      textDecoration: '',
      textDecorationThr: '',
      textAlign: '',
      justifyContent: '',
      userTextColor: '',
      isVisibleShadowField: false,
      colorss: {
        hex: '#194d33'
      },
      colorPicker: false,
      fontsMenu: false,
      sizesMenu: false,
      textColorMenu: false,
      bgColorMenu: false,
      curTime: '',
      curDate: '',
      showSource: false,
      timer: null
    }
  },
  async created () {
    // font.addFontsOnPage()
    this.fontNames = lodash.cloneDeep(settingsList.fonts)
    this.fontValues = lodash.cloneDeep(settingsList.fonts)
    let fontsInfo = await font.getFontsInfo()
    // let fontsInfo = this.$store.getters.fontsInfo
    fontsInfo.forEach(info => {
      this.fontNames.push(info.name)
      this.fontValues.push(info.value)
    })
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  computed: {
    showSourseCode () {
      return '<p style="font-family: ' + `${this.fontFamily}; ` + 'font-size: ' + `${this.fontSize}px; ` +
      'color: ' + `${this.color}; ` + 'background-color: ' + `${this.backgroundColor}; ` +
      'font-weight: ' + `${this.fontWeight}; ` + 'font-style: ' + `${this.fontStyle}; ` +
      'text-decoration: ' + `${this.textDecoration}; ` + 'text-align: ' + `${this.textAlign}` +
      `> ${this.curTime + ' ' + this.curDate}` + '</p>'
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
        this.check()
        this.closeAllMenu()
        this.checkActive()
      }
    },
    isModify: {
      get () {
        const modalWidgetContent = this.modalWidgetContent
        console.log('isModify')
        console.log(modalWidgetContent)
        return (
          modalWidgetContent && modalWidgetContent.type === this.widgetType
        )
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
    modalTitle () {
      if (this.isModify) return 'Изменение даты и времени'
      else return 'Дата и время'
    },
    btnConfirmTitle () {
      if (this.isModify) return 'Сохранить'
      else return 'Сохранить'
    },
    zeroOpt () {
      return moment().format('DD.MM.YYYY')
    },
    firstOpt () {
      return moment().locale('ru').format('MMMM DD, YYYY')
    },
    secondOpt () {
      return moment().locale('ru').format('MMM DD YYYY')
    },
    thirdOpt () {
      return moment().format('MM/DD/YYYY')
    },
    fourthOpt () {
      return moment().format('DD/MM/YYYY')
    },
    currentTime () {
      this.timer = setInterval(() => {
        this.curTime = moment().tz(this.timeZone).locale('en').format(this.selectedTimeFormat)
      }, 200)
      return this.curTime
    },
    currentDate () {
      this.timer = setInterval(() => {
        this.curDate = moment().tz(this.timeZone).locale('ru').format(this.selectedDateFormat)
      }, 200)
      return this.curDate
    },

    styObj () {
      let styleObject = {}
      styleObject = {
        fontFamily: this.fontFamily,
        fontSize: this.fontSize + 'px',
        color: this.color,
        backgroundColorr: this.backgroundColor,
        fontWeight: this.fontWeight,
        fontStyle: this.fontStyle,
        textDecoration: this.textDecoration,
        textAlign: this.textAlign,
        // textDecorationUnd: this.textDecorationUnd,
        textDecorationThr: this.textDecorationThr
      }
      return styleObject
    }
  },

  methods: {
    checkActive () {
      if (this.fontWeight !== 'normal') {
        document.getElementsByClassName('mce-i-bold')[0].classList.add('activebutton')
      } else document.getElementsByClassName('mce-i-bold')[0].classList.remove('activebutton')
      if (this.fontStyle !== 'normal') {
        document.getElementsByClassName('mce-i-italic')[0].classList.add('activebutton')
      } else document.getElementsByClassName('mce-i-italic')[0].classList.remove('activebutton')
      if (this.textDecoration === 'underline') {
        document.getElementsByClassName('mce-i-underline')[0].classList.add('activebutton')
      } else document.getElementsByClassName('mce-i-underline')[0].classList.remove('activebutton')
      if (this.textDecorationThr === 'line-through') {
        document.getElementsByClassName('mce-i-strikethrough')[0].classList.add('activebutton')
      } else document.getElementsByClassName('mce-i-strikethrough')[0].classList.remove('activebutton')
      if (this.textAlign === 'left') {
        document.getElementsByClassName('mce-i-alignleft')[0].classList.add('activebutton')
      } else document.getElementsByClassName('mce-i-alignleft')[0].classList.remove('activebutton')
      if (this.textAlign === 'center') {
        document.getElementsByClassName('mce-i-aligncenter')[0].classList.add('activebutton')
      } else document.getElementsByClassName('mce-i-aligncenter')[0].classList.remove('activebutton')
      if (this.textAlign === 'right') {
        document.getElementsByClassName('mce-i-alignright')[0].classList.add('activebutton')
      } else document.getElementsByClassName('mce-i-alignright')[0].classList.remove('activebutton')
      if (this.textAlign === 'justify') {
        document.getElementsByClassName('mce-i-alignjustify')[0].classList.add('activebutton')
      } else document.getElementsByClassName('mce-i-alignjustify')[0].classList.remove('activebutton')
    },

    timeZonesChange () {
      if (this.$refs.first.checked) {
        this.timeZonesCondition = false
        this.timeZone = 'Europe/Moscow'
      }

      if (this.$refs.second.checked) {
        this.timeZonesCondition = true
      }
    },
    check () {
      if (!this.isVisibleTime && this.isVisibleDate) {
        this.disabledDate = true
        return
      }
      if (this.isVisibleTime && !this.isVisibleDate) {
        this.disabledTime = true
        return
      }
      this.disabledDate = false
      this.disabledTime = false
    },

    toggleTime () {
      this.isVisibleTime = !this.isVisibleTime
    },
    toggleDate () {
      this.isVisibleDate = !this.isVisibleDate
    },
    createWidgetItem: function () {
      console.log('CreateDateAndTimeItem: ')

      let dateAndTimeItem = {
        type: this.widgetType,
        isVisibleTime: this.isVisibleTime,
        isVisibleDate: this.isVisibleDate,
        selectedTimeFormat: this.selectedTimeFormat,
        selectedDateFormat: this.selectedDateFormat,
        timeZone: this.timeZone,
        timeZonesCondition: this.timeZonesCondition,
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
        color: this.color,
        backgroundColor: this.backgroundColor,
        fontWeight: this.fontWeight,
        fontStyle: this.fontStyle,
        textDecoration: this.textDecoration,
        textDecorationThr: this.textDecorationThr,
        textAlign: this.textAlign,
        justifyContent: this.justifyContent,
        offset: 1
      }
      console.log(JSON.stringify(dateAndTimeItem))
      return JSON.stringify(dateAndTimeItem)
    },
    setAllDataByDefault () {
      this.id = null
      this.name = 'DateAndTime' + this.numberOfWidgets
      this.isVisibleTime = true
      this.isVisibleDate = true
      this.selectedTimeFormat = 'HH:mm'
      this.selectedDateFormat = 'DD.MM.YYYY'
      this.timeZone = 'Europe/Moscow'
      this.timeZonesCondition = false
      this.fontFamily = 'Arial'
      this.fontSize = 16
      this.color = 'black'
      this.backgroundColor = 'inherit'
      this.fontWeight = 'normal'
      this.fontStyle = 'normal'
      this.textDecoration = 'none'
      this.textDecorationThr = 'none'
      this.textAlign = ''
    },
    setWidgetContent () {
      if (this.isModify) {
        // изменение
        const content = this.modalWidgetContent
        this.id = content.id
        this.name = content.name
        this.isVisibleTime = content.isVisibleTime
        this.isVisibleDate = content.isVisibleDate
        this.selectedTimeFormat = content.selectedTimeFormat
        this.selectedDateFormat = content.selectedDateFormat
        this.timeZone = content.timeZone
        this.timeZonesCondition = content.timeZonesCondition
        this.fontFamily = content.fontFamily
        this.fontSize = content.fontSize
        this.color = content.color
        this.backgroundColor = content.backgroundColor
        this.fontWeight = content.fontWeight
        this.fontStyle = content.fontStyle
        this.textDecoration = content.textDecoration
        this.textDecorationThr = content.textDecorationThr
        this.textAlign = content.textAlign
      } else {
        this.setAllDataByDefault()
      }
      this.modalWidgetHelper = new ModalWidgetHelper(
        this.$store,
        this.createWidgetItem,
        {
          wName: this.name,
          wId: this.id
        }
      )
      console.log(this.modalWidgetHelper)
    },
    createPlaylistItem () {
      this.modalWidgetHelper.createPlaylistItem(
        {
          wName: this.name
        },
        () => {
          this.active = false
        }
      )
    },
    changePlaylistItem () {
      this.modalWidgetHelper.changePlaylistItem(
        {
          wName: this.name,
          wId: this.id
        },
        () => {
          this.active = false
        }
      )
    },

    // setting bar methods
    toggleColorPicker () {
      this.colorPicker = !this.colorPicker
    },

    toggleColorPickerBg () {
      this.colorPicker = !this.colorPicker
    },

    closeAllMenu () {
      this.fontsMenu = false
      this.sizesMenu = false
      this.textColorMenu = false
      this.bgColorMenu = false
      this.isVisibleShadowField = false
      this.colorPicker = false
      this.showSource = false
    },

    openSource () {
      this.closeAllMenu()
      this.showSource = true
      this.isVisibleShadowField = true
    },

    closeSource () {
      this.showSource = false
      this.isVisibleShadowField = false
    },

    toggleFonts () {
      this.sizesMenu = false
      this.textColorMenu = false
      this.bgColorMenu = false
      this.fontsMenu = !this.fontsMenu
      this.isVisibleShadowField = true
      if (!this.fontsMenu) {
        this.isVisibleShadowField = false
      }
      this.colorPicker = false
    },
    toggleSizes () {
      this.fontsMenu = false
      this.textColorMenu = false
      this.bgColorMenu = false
      this.sizesMenu = true
      this.isVisibleShadowField = true
      if (!this.sizesMenu) {
        this.isVisibleShadowField = false
      }
      this.colorPicker = false
      this.$nextTick(() => {
        this.$refs.handInput.focus()
      })
    },

    submit () {
      this.sizesMenu = false
      this.isVisibleShadowField = false
    },

    toggleTextColorMenu () {
      this.sizesMenu = false
      this.fontsMenu = false
      this.bgColorMenu = false
      this.textColorMenu = !this.textColorMenu
      this.isVisibleShadowField = true
      if (!this.textColorMenu) {
        this.isVisibleShadowField = false
      }
      this.colorPicker = false
    },

    toggleBgColorMenu () {
      this.fontsMenu = false
      this.sizesMenu = false
      this.textColorMenu = false
      this.bgColorMenu = !this.bgColorMenu
      this.isVisibleShadowField = true
      if (!this.bgColorMenu) {
        this.isVisibleShadowField = false
      }
      this.colorPicker = false
    },

    canselColor () {
      this.color = 'black'
      this.toggleTextColorMenu()
    },

    canselBgColor () {
      this.backgroundColor = 'inherit'
      this.toggleBgColorMenu()
    },

    changeFamily (newName, newValue) {
      this.closeAllMenu()
      this.fontName = newName
      this.fontFamily = newValue
    },

    changeFontSize (newSize) {
      this.closeAllMenu()
      this.fontSize = newSize
    },

    controlSizeInput () {
      if (this.fontSize > 380) {
        this.fontSize = 380
      }
      if (this.fontSize === '') {
        this.fontSize = 16
      }
    },

    changeTextAlign (newAlign) {
      this.closeAllMenu()
      if (this.textAlign === newAlign) {
        this.textAlign = ''
      } else this.textAlign = newAlign
      this.checkActive()
      if (newAlign === 'center') {
        this.justifyContent = 'center'
      }
      if (newAlign === 'left') {
        this.justifyContent = 'flex-start'
      }
      if (newAlign === 'right') {
        this.justifyContent = 'flex-end'
      }
      if (newAlign === 'justify') {
        this.justifyContent = 'center'
      }
    },

    toggleBoldText () {
      if (this.fontWeight === 'bold') this.fontWeight = 'normal'
      else this.fontWeight = 'bold'
      this.closeAllMenu()
      this.checkActive()
    },

    changeTextColor (newColor) {
      this.color = newColor
      this.closeAllMenu()
    },

    changeBgcolor (newColor) {
      this.backgroundColor = newColor
      this.closeAllMenu()
    },

    toggleItalicText () {
      if (this.fontStyle === 'italic') this.fontStyle = 'normal'
      else this.fontStyle = 'italic'
      this.closeAllMenu()
      this.checkActive()
    },

    toggleUnderline () {
      if (this.textDecoration === 'underline') {
        this.textDecoration = 'none'
      } else {
        this.textDecoration = 'underline'
      }
      this.closeAllMenu()
      this.checkActive()
    },

    toggleLineThrough () {
      if (this.textDecorationThr === 'line-through') {
        this.textDecorationThr = 'none'
      } else {
        this.textDecorationThr = 'line-through'
      }
      this.closeAllMenu()
      this.checkActive()
    },

    changeWithPicker () {
      this.color = this.colorss.hex
    },

    changeWithPickerBg () {
      this.backgroundColor = this.colorss.hex
    },

    changeOnDefault () {
      this.fontFamily = 'Arial'
      this.fontSize = 16
      this.color = 'black'
      this.backgroundColor = 'inherit'
      this.fontWeight = 'normal'
      this.fontStyle = 'normal'
      this.textDecoration = 'none'
      this.textDecorationThr = 'none'
      this.textAlign = ''
      this.checkActive()
      this.closeAllMenu()
      this.justifyContent = 'flex-start'
    }
  }
}
</script>

<style>
.handinput{
  border: 1px solid black;
  background: red;
  z-index: 99999999999999999;
  width: 50%;
  position: relative;
  top: -5px;
  font-size: 100px;  
  cursor: pointer;
}

.underColor{
  height: 1.5px;
  width: 17px;
  background-color: red;
  position: absolute;
  left: 189.5px;
  top: 8px;
  z-index: 9999999;
}

.underColorFirst{
  height: 1.5px;
  width: 17px;
  background-color: red;
  position: absolute;
  left: 156px;
  top: 8px;
  z-index: 9999999;
}

.showSource{ 
  width: 600px;
  position: absolute;
  top: -300px;
  left: 0px;
  border: 1px solid rgb(192, 192, 192);
  background:  rgb(245,245,226);
  z-index: 999999999;
}

.headerSource{
  background: rgb(245,245,226);
  font-size: 20px;
  font-weight: bold;
  color: #595959;
  height: 40px;
  border-bottom: 1px solid rgb(192, 192, 192);
  padding: 0px 15px 0px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mce-i-remove:hover{  
  opacity: .5;
  cursor: pointer;
}

.bodySource{
  margin: 15px;
  background: white;
  height: 370px;
  box-sizing: border-box;
  padding: 5px;
  border: 1px solid rgb(192, 192, 192);
}

.footerSource{
  height: 50px;
  background: rgb(245,245,226);
  border-top: 1px solid rgb(192, 192, 192);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 15px 0 15px
}

.okey{
  width: 45px;
  height: 30px;
  background: rgb(34,118,210);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-right: 10px;
  cursor: pointer;
}

.okey:hover{
  background: rgb(30,106,188);
}

.cansel{
  width: 75px;
  height: 30px;
  border: 1px solid rgb(192, 192, 192);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #595959;
  background: white;
  cursor: pointer;
}

.display {
  margin: 30px 0 30px 0;
  min-height: 20px;
  background: url("../../../../static/img/quill-icons/background.png");
  border: 1px solid rgb(193,193,193);
}

.display-current-time{
 overflow: auto;
}

p {
  margin: 0px;
}

.modalCreateDate .modal {
  overflow: hidden !important;
}

.modalCreateDate .modal-body {
  max-height: 80vh;
  overflow-y: scroll;
}

#mceu_1-open .mce-txt {
  overflow: hidden;
  width: 50px !important;
}

.settings-bar {
  border: 1px solid rgb(193,193,193);
  height: 41px;
  padding: 5px 0 10px 5px;
  margin-bottom: -30px;
}

@media screen and (max-width: 990px){
  .settings-bar{
     border: 1px solid rgb(193,193,193);
     height: 41px;
     padding: 5px 0 10px 5px;
     margin-bottom: -29px;
     border: 1px solid rgb(193,193,193);
     overflow-x: scroll;
  }
}

.buttons {
  margin: 0;
  padding: 0;
  display: flex;
  position: relative;
}

.buttons li {
  list-style-type: none;
  margin-left: 3px;
}

.bt:hover + div {
  display: block;
}

.block-fonts {
  width: 200px;
  height: 150px;
  border: 1px solid black;
  position: absolute;
  top: 40px;
  left: -10px;
  background: white;
  overflow: auto;
}

.fontTarget,
.sizesTarget {
  box-sizing: border-box;
  padding-left: 20px;
  line-height: 30px;
  margin: 0;
}

.fontTarget:hover,
.sizesTarget:hover {
  background: green;
  color: white;
}

.block-sizes {
  position: absolute;
  background: white;
  top: 41px;
  left: 81px;
  overflow: auto;
  width: 80px;
  height: 150px;
  border: 1px solid black;
}

.text-color-block {
  width: 166px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: absolute;
  background: white;
  padding: 7px 7px 0px 7px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  left: 5px;
  top: 50px;
}

.text-colorBg-block{
  width: 166px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: absolute;
  background: white;
  padding: 7px 7px 0px 7px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  left: 40px;
  top: 50px;
}

.text-color-block::after {
  content: "";
  margin-left: -11px;
  position: absolute;
  top: -29px;
  left: 140px;
  border: 14px solid transparent;
  border-bottom: 14px solid rgba(0, 0, 0, 0.2);
}

.text-colorBg-block::after {
  content: "";
  margin-left: -11px;
  position: absolute;
  top: -29px;
  left: 140px;
  border: 14px solid transparent;
  border-bottom: 14px solid rgba(0, 0, 0, 0.2);
}

.textcolor-blocks {
  width: 16px;
  height: 16px;
  cursor: pointer;
  border: 1px solid #a1a1a1;
  margin-right: 1px;
  margin-bottom: 1px;
}

.textcolorBg-blocks {
  width: 16px;
  height: 16px;
  cursor: pointer;
  border: 1px solid #a1a1a1;
  margin-right: 1px;
  margin-bottom: 1px;
}

.textcolor-blocks:active {
  border: 1px solid rgba(0, 0, 0, 0.5);
}

.textcolorBg-blocks:active {
  border: 1px solid rgba(0, 0, 0, 0.5);
}

.close-blocks {
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  color: #8b8b8b;
  font-family: "Roboto", sans-serif;
  line-height: 13px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.ownChoose {
  width: 100%;
  padding: 0 5px 0 5px;
  cursor: pointer;
  color: #595959;
  height: 25px;
}

.title {
  background: #333333;
  text-align: center;
  color: white;
  position: absolute;
  padding: 5px;
  font-size: 12px;
  display: none;
}

li:hover + div.title {
  display: block;
}

.title-1 {
  top: 45px;
  left: 20px;
}

.title-2 {
  top: 45px;
  left: 95px;
}

.title-3 {
  top: 45px;
  left: 140px;
}

.title-4 {
  top: 45px;
  left: 177px;
}

.title-5 {
  top: 45px;
  left: 220px;
}

.title-6 {
  top: 45px;
  left: 255px;
}

.title-7 {
  top: 45px;
  left: 285px;
}

.title-8 {
  top: 45px;
  left: 315px;
}

.title-9 {
  top: 45px;
  left: 355px;
}

.title-10 {
  top: 45px;
  left: 385px;
}

.title-11 {
  top: 45px;
  left: 420px;
}

.title-12 {
  top: 45px;
  left: 450px;
}

.title-13 {
  top: 45px;
  left: 490px;
}

.title-14 {
  top: 45px;
  left: 520px;
}

.title::after {
  content: "";
  margin-left: -11px;
  position: absolute;
  top: -14px;
  left: 20px;
  border: 7px solid transparent;
  border-bottom: 7px solid #333333;
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

.moreIndex {
  z-index: 9999999;
}

.inputColor {
  position: absolute;
  right: 10px;
}

.color-picker--core {
  position: absolute;
  right: 30px;
  bottom: 20px;
}

.color-picker--wrap {
  position: relative;
  top: 135px;
  left: 280px;
}

.buttonPicker:hover {
  background: #e6e6e6;
}

.buttonPicker {
  display: block;
}

.buttons {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.bt {
  width: 28px;
  height: 29px;
  padding-top: 5px;
  text-align: center;
  font-family: "tinymce", Arial;
  cursor: pointer;
}

.fontFamily, .fontSize, .btColor, .btColor2{
  cursor: pointer;
}

.btColor {
  width: 30px;
  height: 29px;
  padding-top: 5px;
  font-family: "tinymce", Arial;
  display: flex;
  justify-content: center;
}

.btColor2 {
  width: 34px;
  height: 29px;
  padding-top: 5px;
  font-family: "tinymce", Arial;
  display: flex;
  justify-content: center;
}

.fontFamily {
  text-overflow: ellipsis;
  width: 90px;
  height: 29px;
  padding-top: 3px;
  font-size: 14px;
  overflow-x: hidden;
  white-space: nowrap;
}
.fontSize {
  width: 45px;
  height: 29px;
  padding-top: 3px;
  font-size: 16px;  
}

.mce-caret {
  height: 15px;
}

.bt,
.btColor,
.fontFamily,
.fontSize,
.btColor2 {
  background: white;
}

.bt:hover,
.btColor:hover,
.btColor2:hover,
.fontFamily:hover,
.fontSize:hover {
  outline: 1px solid rgb(192, 192, 192);
}

.activebutton{
  background: #595959;
  color: white;
}
</style>
