<template>
    <b-modal
    v-model="active"
    @show="setWidgetContent"
    size="lg"
    :title="modalTitle"
    class="modalCreateWeather modal-inner-scroller"
    no-close-on-backdrop
    hide-footer>
      <div class="container">
        <div class="row row-op">
        	<div class="col">
          	<label>Название:</label>
          	<input type="text" v-model="name" placeholder="Введите название"/>
        </div>
      </div>
      <div style="margin-top: 10px;" class="row row-op rowMarg">
        	<div class="col">
            <label>Цветовая тема:</label>
            <select class="form-control font-size" v-model="themeColor">
                <option value="rgb(51,51,51)">По умолчанию</option>
                <option value="rgb(255,255,255)">Светлая</option>
            </select>
        </div>
      </div>
      <div class="row row-op rowMarg">
        	<div class="col">
            <label>Единины измерения температуры:</label>
            <select  class="form-control font-size" v-model="tempPoints">
                <option value="celc">Градусы Цельсия</option>
                <option value="far">Градусы Фаренгейта</option>
            </select>
        </div>
      </div>
      <div class="row row-op rowMarg">
        	<div class="col">
            <label>Язык:</label>
            <select class="form-control font-size" v-model="language">
                <option value="russian">Русский</option>
                <option value="english">English</option>
            </select>
        </div>
      </div>
      <div class="row row-op rowMarg">
        	<div class="col">
            <label>Длительность прогноза:</label>
            <select class="form-control font-size" v-model="forecastDuration">
                <option value="1">Прогноз на сегодняшний день</option>
                <option value="4">Прогноз на четыре дня</option>
            </select>
        </div>
      </div>
       <div class="row row-op rowMarg">
        	<div class="col">
            <vue-google-autocomplete
              id="map"
              @placechanged="getAddressData"
              :types="cities"
              classname="form-control"
              placeholder="Введите адрес">
            </vue-google-autocomplete>
            <p v-if="activePage" style="margin: -10px;color: red">Введите адрес</p>
        </div>
      </div>
      <div class="row row-op rowMarg">
        	<div class="col">
            <b-form-checkbox v-model="offlineHide">
              Скрывать виджет при отсутствии интернета
            </b-form-checkbox>
        </div>
      </div>
      <div class="row row-footer justify-content-end">
        <button
          class="btn btn-primary"
          @click="isModify?changePlaylistItem():createPlaylistItem()">
          Сохранить
        </button>
        <button
          @click="active=false"
          class="btn btn-secondary">
          Отмена
         </button>
      </div>
      </div>
    </b-modal>
</template>

<script>
import ModalWidgetHelper from './_ModalWidgetHelper.js'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import axios from 'axios'

export default {
  components: {
    VueGoogleAutocomplete
  },

  data () {
    return {
      cities: '(cities)',
      widgetType: 7,
      name: 'Weather',
      cityEn: '',
      themeColor: '', // цветовая тема
      tempPoints: '', // единицы измерения температуры
      language: '',
      forecastDuration: '', // длительность прогноза
      lat: '',
      lng: '',
      daysArray: [],
      inputVal: '',
      offlineHide: false,
      activePage: false
    }
  },
  computed: {
    activeInput () {
      if (this.lat !== '' && this.lng !== '') {
        return false
      } else {
        return true
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
        document.getElementById('map').value = this.inputVal
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
      if (this.isModify) return 'Изменение отображения погоды'
      else return 'Отображение погоды'
    }
  },

  methods: {
    temperature (temp) {
      var tempr
      if (this.tempPoints === 'celc') {
        // tempr = Math.round(parseInt(temp) - 273) + ' °C'
        tempr = Math.round(parseInt(temp) - 273)
        return tempr
      } else if (this.tempPoints === 'far') {
        // tempr = Math.round(parseInt(temp) + 273) + ' °K'
        tempr = Math.round(parseInt((parseInt(temp) - 273) * 1.8 + 32))
        return tempr
      }
      return temp
    },

    chooseLangDays (day) {
      var daysRu = [
        'Вс',
        'Пн',
        'Вт',
        'Ср',
        'Чт',
        'Пт',
        'Сб',
        'Вс'
      ]
      var daysEng = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
      ]
      day > 6 ? day = day - 7 : day = day + 0
      var dayWithLanguage
      if (this.language === 'russian') {
        dayWithLanguage = daysRu[day]
      }
      if (this.language === 'english') {
        dayWithLanguage = daysEng[day]
      }
      return dayWithLanguage
    },

    generateDaysArray () {
      var date = new Date().getDay()
      switch (this.forecastDuration) {
        case '1':
          this.daysArray = []
          this.daysArray.push(
            {
              temp: this.temperature('300°'),
              maxTemp: this.temperature('295°'),
              minTemp: this.temperature('305°'),
              imageUrl: '../../../../static/img/weather-icons/rain_day.png',
              currentDay: true
            }
          )
          break
        case '4':
          this.daysArray = []
          this.daysArray.push(
            {
              temp: this.temperature('300°'),
              maxTemp: this.temperature('303°'),
              minTemp: this.temperature('301°'),
              imageUrl: '../../../../static/img/weather-icons/rain_day.png',
              currentDay: true
            },
            {
              dayName: this.chooseLangDays(date + 1),
              temp: this.temperature('290°'),
              imageUrl: '../../../../static/img/weather-icons/clear_sky_day.png',
              currentDay: false
            },
            {
              dayName: this.chooseLangDays(date + 2),
              temp: this.temperature('295°'),
              imageUrl: '../../../../static/img/weather-icons/rain_day.png',
              currentDay: false
            },
            {
              dayName: this.chooseLangDays(date + 3),
              temp: this.temperature('285°'),
              imageUrl: '../../../../static/img/weather-icons/few_clouds_day.png',
              currentDay: false
            }
          )
          break
      }
    },
    getAddressData (e) {
      console.log(e)
      this.lat = e.latitude
      this.lng = e.longitude
      this.city = e.locality + ', ' + e.country
      const instance = axios.create({
        transformRequest: [
          (data, headers) => {
            delete headers.common.Authorization
            return data
          }
        ]
      })
      instance.get('https://translate.googleapis.com/translate_a/single?client=gtx&sl=' +
        'auto' + '&tl=' + 'en' + '&dt=t&q=' + encodeURI(this.city)).then((response) => {
          this.cityEn = response.data[0][0][0]
        })
    },

    createWidgetItem: function () {
      console.log('createWeather: ')
      this.generateDaysArray()
      let weatherItem = {
        type: this.widgetType,
        themeColor: this.themeColor,
        tempPoints: this.tempPoints,
        language: this.language,
        forecastDuration: this.forecastDuration,
        lat: this.lat.toString(),
        lng: this.lng.toString(),
        city: this.city,
        // data from server
        daysArray: this.daysArray,
        contentStyleObj: {},
        blockStyleObj: {},
        imgWeatherStyle: {},
        divData: {},
        cityEn: this.cityEn,
        firstPstyle: {},
        secondPstyle: {},
        thirdPstyle: {},
        divData2: {},
        imgWeatherStyle2: {},
        firstPstyle2: {},
        inputVal: document.getElementById('map').value,
        offlineHide: this.offlineHide,
        offset: 1
      }
      console.log(JSON.stringify(weatherItem))
      return JSON.stringify(weatherItem)
    },
    setAllDataByDefault () {
      this.id = null
      this.themeColor = 'rgb(51,51,51)'
      this.tempPoints = 'celc'
      this.language = 'russian'
      this.name = 'Weather' + this.numberOfWidgets
      this.forecastDuration = '1'
      this.inputVal = ''
      this.lat = ''
      this.lng = ''
      this.contentStyleObj = {}
      this.blockStyleObj = {}
      this.imgWeatherStyle = {}
      this.divData = {}
      this.firstPstyle = {}
      this.secondPstyle = {}
      this.thirdPstyle = {}
      this.divData2 = {}
      this.imgWeatherStyle2 = {}
      this.firstPstyle2 = {}
      this.offlineHide = false
      this.activePage = false
    },
    setWidgetContent () {
      // изменение
      if (this.isModify) {
        const content = this.modalWidgetContent
        this.id = content.id
        this.name = content.name
        this.themeColor = content.themeColor
        this.tempPoints = content.tempPoints
        this.language = content.language
        this.forecastDuration = content.forecastDuration
        this.lat = content.lat.toString()
        this.lng = content.lng.toString()
        this.city = content.city
        this.cityEn = content.cityEn
        this.daysArray = content.daysArray
        this.inputVal = content.inputVal
        this.offlineHide = content.offlineHide
        this.activePage = false
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
    },

    createPlaylistItem () {
      if (!this.activeInput) {
        this.modalWidgetHelper.createPlaylistItem(
          {
            wName: this.name
          },
          () => {
            this.active = false
          }
        )
      } else {
        this.activePage = true
      }
    },
    changePlaylistItem () {
      if (!this.activeInput) {
        this.modalWidgetHelper.changePlaylistItem(
          {
            wName: this.name,
            wId: this.id
          },
          () => {
            this.active = false
          }
        )
      } else {
        this.activePage = true
      }
    }
  }
}
</script>

<style>

.rowMarg{
  margin-top: -15px;
}

.pac-container {
  z-index: 10000 !important;
}
.font-size{
  font-size: 0.9rem!important;
}

</style>


