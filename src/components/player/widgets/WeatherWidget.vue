<template>
  <div ref="textContent"
      class="text-content"
      :style="contentProp.contentStyleObj"
      v-if="isShow">
      <div class="sss" :style="someStyle">
        <div class="main-weather-block" :style="style">
          <img v-if="isLoading" src="/static/img/loading-spinner.gif" class="loader">
          <div v-for="days in contentProp.daysArray" :key="days.key"  v-if="days.currentDay && !isLoading" class="firstRow">            
              <img class="img" :src="days.imageUrl" alt="weather">
              <p class="curTemp">{{days.temp}}°</p>            
              <p class="city" v-if="contentProp.language !== 'english'">{{contentProp.city}}</p>
              <p class="city" v-else>{{contentProp.cityEn}}</p>
              <p class="temps">{{days.minTemp}}° - {{days.maxTemp}}°</p>
          </div>
          <div class="secondRow">
            <div v-for="days in contentProp.daysArray" :key="days.key"  v-if="!days.currentDay && !isLoading" class="secondBlocks">         
              <img class="img" :src="days.imageUrl" alt="weather">
              <p class="temp">{{days.temp}}°</p>       
              <p class="day">{{days.dayName}}&nbsp;</p>
            </div>
          </div>
        </div>
      </div>
  </div>
  <div v-else-if="!offlineHide" class="text-center">Отсутствует соединение с интернетом</div>
</template>

<script>
import { baseUrl } from '../../../../api/config'
import axios from 'axios'
import Connection from './helpers/Connection'
import moment from 'moment'

export default {
  name: 'weather-content',
  props: ['content', 'containerStyle'],

  created () {
    console.log('Weather created')
    console.log(this.content)
    console.log('cont', this.containerStyle)
  },
  mounted () {
    this.connect = new Connection(
      () => {
        console.log('internet connection find')
        this.isShow = true
        this.init()
      },
      () => {
        console.log('internet connection lost')
        this.isShow = false
      }
    )
    setInterval(() => this.refreshWeather(), 5 * 60 * 1000)
    this.connect.startListen()
    console.log('monted: ' + this.contentId)
    console.log(this.content)
  },

  data () {
    return {
      weatherContent: '',
      title: '',
      sevenDaysForecast: '',
      currentForecast: '',
      connect: null,
      isShow: false,
      curTempr: null,
      isLoading: true
    }
  },

  computed: {
    someStyle () {
      var cWidth = parseInt(this.containerStyle.width)
      var cHeight = parseInt(this.containerStyle.height)
      var sizer
      if (cHeight > cWidth) {
        sizer = cWidth
      } else {
        sizer = cHeight
      }
      return {
        width: sizer + 'px',
        height: sizer + 'px',
        margin: 'auto'
      }
    },
    style () {
      console.log(this.zoom)
      return {
        transform: `scale(${this.zoom})`,
        color: this.content.themeColor
      }
    },
    zoom () {
      var cWidth = parseInt(this.containerStyle.width)
      var cHeight = parseInt(this.containerStyle.height)
      var height = 500
      var width = 500
      var zoomH = cHeight / height
      var zoomW = cWidth / width
      if (zoomH > zoomW) {
        return zoomW
      } else {
        return zoomH
      }
    },
    contentId () {
      return this.content.id
    },
    contentProp () {
      return this.content
    },
    mainStyleObj () {
      return {
        minWidth: 2000 + 'px'
      }
    },
    contentStyleObj () {
      let res = {}
      res.overflow = 'hidden'
      res.color = this.contentProp.themeColor
      return res
    },
    blockStyleObj () {
      let res = {}
      res.width = `${240}px`
      res.height = `${220}px`
      res.overflow = 'hidden'
      res.textAlign = 'center'
      res.display = 'inline-block'
      res.marginRight = 5 + 'px'
      return res
    },
    divStyleObj () {
      return {
        float: 'right',
        margin: 5 + 'px ' + 40 + 'px ' + 0 + 'px ' + 30 + 'px'
      }
    },
    pStyleObj () {
      return {
        margin: 0,
        width: 70 + 'px',
        height: 50 + 'px'
      }
    },
    h2StyleObj () {
      return {
        fontWeight: 'bold',
        margin: 10 + 'px ' + '0px' + '0px' + '0px'
      }
    },
    widthImg () {
      let res = {}
      res.marginTop = 10 + 'px'
      res.width = 50 + 'px'
      res.height = 50 + 'px'
      return res
    },
    offlineHide () {
      return Boolean(this.content.offlineHide)
    }
  },

  methods: {
    generateCurTemp () {
      var temp = this.weatherContent.list[0].main.temp
      if (this.content.tempPoints === 'far') {
        console.log(temp)
        this.curTempr = Math.round((temp - 273) * 1.8 + 32)
      }
      if (this.content.tempPoints === 'celc') {
        console.log(temp)
        this.curTempr = Math.round(temp - 273)
      }
    },

    refreshWeather () {
      if (this.connect && this.connect.isOnline) {
        axios.get(baseUrl + '/weather/' + this.content.lat + '/' + this.content.lng)
        .then(response => {
          this.weatherContent = response.data
          console.log('погода обновлена')
          console.log(this.weatherContent)
          this.insertData()
          // this.chooseLangPhraze()
          this.generateCurTemp()
        })
        .catch(e => {
          console.log(e)
          console.log('error')
        })
      }
    },
    init () {
      new Promise((resolve, reject) => {
        this.isShow = true
        resolve(this)
      })
      .then((self) => {
        axios.get(baseUrl + '/weather/' + this.content.lat + '/' + this.content.lng)
        .then(response => {
          this.weatherContent = response.data
          console.log(this.weatherContent)
          console.log(this.contentProp.daysArray)
          this.insertData()
          // this.chooseLangPhraze()
          // this.controlBlocks()
          this.generateCurTemp()
          this.$nextTick(() => {
            if (this.weatherContent) {
              this.isLoading = false
            }
          })
        })
        .catch(e => {
          console.log(e)
          console.log('eeerror')
        })
      })
    },

    insertData () {
      var mint, maxt, sum1, count1, sum2, count2, sum3, count3
      var curDate = moment().format('DD.MM.YYYY')
      var Date1 = moment(new Date()).add(1, 'days').format('DD.MM.YYYY')
      var DayName1 = moment(new Date()).add(1, 'days').format('ddd')
      var Date2 = moment(new Date()).add(2, 'days').format('DD.MM.YYYY')
      var DayName2 = moment(new Date()).add(2, 'days').format('ddd')
      var Date3 = moment(new Date()).add(3, 'days').format('DD.MM.YYYY')
      var DayName3 = moment(new Date()).add(3, 'days').format('ddd')
      // var Date4 = moment(new Date()).add(4, 'days').format('DD.MM.YYYY')
      console.log('cur', curDate)
      const dater = moment.utc(this.weatherContent.list[4].dt_txt.split(' ')[0]).format('DD.MM.YYYY')
      console.log('mom', dater)
      this.weatherContent.list.forEach((item, i) => {
        var itemDate = moment.utc(this.weatherContent.list[i].dt_txt.split(' ')[0]).format('DD.MM.YYYY')
        // var hour = moment.utc(item.dt_txt).format('HH')
        var hour = item.dt_txt.split(' ')[1].split(':')[0]
        // console.log(hour) many place in console
        if (itemDate === curDate) {
          if (maxt) {
            if (item.main.temp > maxt) {
              maxt = item.main.temp
            }
          } else {
            maxt = item.main.temp
          }
          if (mint) {
            if (item.main.temp < mint) {
              mint = item.main.temp
            }
          } else {
            mint = item.main.temp
          }
        }
        if (this.content.daysArray.length === 4) {
          if (itemDate === Date1) {
            if (hour === '15') {
              this.content.daysArray[1].imageUrl = this.chooseWeatherIcon(item)
            }
            if (sum1) {
              sum1 = sum1 + item.main.temp
            } else {
              sum1 = item.main.temp
            }
            if (count1) {
              count1++
            } else {
              count1 = 1
            }
          }
          if (itemDate === Date2) {
            if (hour === '15') {
              this.content.daysArray[2].imageUrl = this.chooseWeatherIcon(item)
            }
            if (sum2) {
              sum2 = sum2 + item.main.temp
            } else {
              sum2 = item.main.temp
            }
            if (count2) {
              count2++
            } else {
              count2 = 1
            }
          }
          if (itemDate === Date3) {
            if (hour === '15') {
              this.content.daysArray[3].imageUrl = this.chooseWeatherIcon(item)
            }
            if (sum3) {
              sum3 = sum3 + item.main.temp
            } else {
              sum3 = item.main.temp
            }
            if (count3) {
              count3++
            } else {
              count3 = 1
            }
          }
        }
      })
      console.log(parseInt(sum3 / count3))
      console.log(maxt, mint)
      var currentTemp = JSON.parse(this.weatherContent.current)
      console.log('current', currentTemp)
      this.content.daysArray[0].imageUrl = this.chooseWeatherIcon(currentTemp)
      if (currentTemp.main.temp < mint) {
        this.content.daysArray[0].minTemp = this.correctTemperature(currentTemp.main.temp)
      } else {
        this.content.daysArray[0].minTemp = this.correctTemperature(mint)
      }
      this.content.daysArray[0].temp = this.correctTemperature(currentTemp.main.temp)
      if (currentTemp.main.temp > maxt) {
        this.content.daysArray[0].maxTemp = this.correctTemperature(currentTemp.main.temp)
      } else {
        this.content.daysArray[0].maxTemp = this.correctTemperature(maxt)
      }
      if (this.content.daysArray.length === 4) {
        this.content.daysArray[1].temp = this.correctTemperature(parseInt(sum1 / count1))
        this.content.daysArray[1].dayName = this.correctName(DayName1)
        this.content.daysArray[2].temp = this.correctTemperature(parseInt(sum2 / count2))
        this.content.daysArray[2].dayName = this.correctName(DayName2)
        this.content.daysArray[3].temp = this.correctTemperature(parseInt(sum3 / count3))
        this.content.daysArray[3].dayName = this.correctName(DayName3)
      }
    },
    correctName (name) {
      var word
      if (this.content.language === 'russian') {
        switch (name) {
          case 'Mon':
            return 'Пн'
          case 'Tue':
            word = 'Вт'
            break
          case 'Wed':
            word = 'Ср'
            break
          case 'Thu':
            word = 'Чт'
            break
          case 'Fri':
            word = 'Пт'
            break
          case 'Sat':
            word = 'Сб'
            break
          case 'Sun':
            word = 'Вс'
            break
        }
      }
      if (this.content.language === 'english') {
        word = name
      }
      console.log(word)
      return word
    },
    chooseWeatherIcon (weatherDescription) {
      var iconUrl
      var id = weatherDescription.weather[0].id
      console.log('ss', weatherDescription)
      var dateHours = new Date().getHours()
      if (id > 199 && id < 233) {
        iconUrl = '../../../../static/img/weather-icons/thunderstorm.png'
      }
      if (id > 299 && id < 322) {
        iconUrl = '../../../../static/img/weather-icons/shower_rain.png'
      }
      if (id > 499 && id < 505) {
        iconUrl = '../../../../static/img/weather-icons/rain_day.png'
      }
      if (id > 519 && id < 532) {
        iconUrl = '../../../../static/img/weather-icons/shower_rain.png'
      }
      if ((id > 599 && id < 623) || id === 511) {
        iconUrl = '../../../../static/img/weather-icons/snow.png'
      }
      if (id > 700 && id < 782) {
        iconUrl = '../../../../static/img/weather-icons/broken_clouds.png'
      }
      if (id === 800 && dateHours > 4 && dateHours < 19) {
        iconUrl = '../../../../static/img/weather-icons/clear_sky_day.png'
      }
      if ((id === 800 && dateHours > 18) || (id === 800 && dateHours > 0 && dateHours < 5)) {
        iconUrl = '../../../../static/img/weather-icons/clear_sky_night.png'
      }
      if (id === 801 && dateHours > 4 && dateHours < 19) {
        iconUrl = '../../../../static/img/weather-icons/few_clouds_day.png'
      }
      if ((id === 801 && dateHours > 18) || (id === 800 && dateHours > 0 && dateHours < 5)) {
        iconUrl = '../../../../static/img/weather-icons/few_clouds_night.png'
      }
      if (id === 802) {
        iconUrl = '../../../../static/img/weather-icons/scattered_clouds.png'
      }
      if (id === 803) {
        iconUrl = '../../../../static/img/weather-icons/broken_clouds.png'
      }
      if (id === 804) {
        iconUrl = '../../../../static/img/weather-icons/broken_clouds.png'
      }
      console.log(iconUrl)
      return iconUrl
    },

    chooseLangPhraze () {
      var lang = this.content.language
      if (lang === 'russian') {
        this.title = 'ПРОГНОЗ НА НЕДЕЛЮ'
        this.sevenDaysForecast = this.generateSevForecast(lang) + ' в течении всей недели, со средней температурой ' + this.generateSevenDaysTemp()
        this.currentForecast = this.currentDescription(lang)
        console.log(this.sevenDaysForecast)
        console.log(this.currentForecast)
      }
      if (lang === 'english') {
        this.title = 'IN 7 DAYS'
        this.sevenDaysForecast = this.generateSevForecast(lang) + ' during the week,with average temperature ' + this.generateSevenDaysTemp()
        this.currentForecast = this.currentDescription(lang)
      }
    },

    generateSevForecast (lang) {
      var list = this.weatherContent.list
      var rainCoutner = 0
      var snowCounter = 0
      var mistCounter = 0
      var clearSkyCounter = 0
      var scattredCloudsCounter = 0
      var word = ''
      var weatherConds = []

      for (var i = 0; i < list.length; i++) {
        if (list[i].weather[0].description.indexOf('rain') !== -1 ||
            list[i].weather[0].description.indexOf('thunderstorm') !== -1 ||
            list[i].weather[0].description.indexOf('drizzle') !== -1) {
          rainCoutner++
        }
        if (list[i].weather[0].description.indexOf('snow') !== -1 ||
            list[i].weather[0].description.indexOf('sleet') !== -1) {
          snowCounter++
        }
        if (list[i].weather[0].description.indexOf('mist') !== -1 ||
            list[i].weather[0].description.indexOf('smoke') !== -1 ||
            list[i].weather[0].description.indexOf('haze') !== -1 ||
            list[i].weather[0].description.indexOf('sand') !== -1 ||
            list[i].weather[0].description.indexOf('fog') !== -1 ||
            list[i].weather[0].description.indexOf('dust') !== -1 ||
            list[i].weather[0].description.indexOf('ash') !== -1 ||
            list[i].weather[0].description.indexOf('squalls') !== -1 ||
            list[i].weather[0].description.indexOf('tornado') !== -1) {
          mistCounter++
        }
        if (list[i].weather[0].description.indexOf('clear sky') !== -1) {
          clearSkyCounter++
        }
        if (list[i].weather[0].description.indexOf('few clouds') !== -1 ||
            list[i].weather[0].description.indexOf('scattered clouds') !== -1 ||
            list[i].weather[0].description.indexOf('broken clouds') !== -1 ||
            list[i].weather[0].description.indexOf('overcast clouds') !== -1) {
          scattredCloudsCounter++
        }
      }
      weatherConds.push(rainCoutner, snowCounter, mistCounter, clearSkyCounter, scattredCloudsCounter)
      var max = 0
      var index
      for (var j = 0; j < weatherConds.length; j++) {
        if (weatherConds[j] >= max) {
          max = weatherConds[j]
          index = j
        }
      }
      if (lang === 'russian') {
        switch (index) {
          case 0:
            word = 'Дождливо'
            break
          case 1:
            word = 'Снегопад'
            break
          case 2:
            word = 'Туманно'
            break
          case 3:
            word = 'Безоблачно'
            break
          case 4:
            word = 'Облачно'
            break
        }
      }
      if (lang === 'english') {
        switch (index) {
          case 0:
            word = 'Rainy'
            break
          case 1:
            word = 'Snow'
            break
          case 2:
            word = 'Misty'
            break
          case 3:
            word = 'Clear sky'
            break
          case 4:
            word = 'Cloudy'
            break
        }
      }
      return word
    },

    generateSevenDaysTemp () {
      var list = this.weatherContent.list
      var tempSum = 0
      var tempCounts = 0
      var temp
      for (var i = 0; i < list.length; i++) {
        tempSum += list[i].main.temp
        tempCounts++
      }
      temp = Math.round(tempSum / tempCounts)
      if (this.content.tempPoints === 'far') {
        return Math.round((parseInt(temp) - 273) * 1.8 + 32)
      }
      if (this.content.tempPoints === 'celc') {
        return Math.round(parseInt(temp) - 273)
      }
    },
    correctTemperature (temp) {
      if (this.content.tempPoints === 'far') {
        return Math.round((parseInt(temp) - 273) * 1.8 + 32)
      }
      if (this.content.tempPoints === 'celc') {
        return Math.round(parseInt(temp) - 273)
      }
    },
    correctTemperatureMin (temp) {
      var tempr = temp.main.temp_min
      if (this.content.tempPoints === 'far') {
        return Math.round((parseInt(tempr) - 273) * 1.8 + 32)
      }
      if (this.content.tempPoints === 'celc') {
        return Math.round(parseInt(tempr) - 273)
      }
    },
    correctTemperatureMax (temp) {
      var tempr = temp.main.temp_max
      if (this.content.tempPoints === 'far') {
        return Math.round((parseInt(tempr) - 273) * 1.8 + 32)
      }
      if (this.content.tempPoints === 'celc') {
        return Math.round(parseInt(tempr) - 273)
      }
    },
    modifyTemp (temp) {
      if (this.content.tempPoints === 'far') {
        return Math.round((parseInt(temp) - 273) * 1.8 + 32)
      }
      if (this.content.tempPoints === 'celc') {
        return Math.round(parseInt(temp) - 273)
      }
    },
    currentDescription (lang) {
      var description = this.weatherContent.list[0].weather[0].description
      if (lang === 'english') {
        return description
      }
      if (lang === 'russian') {
        if (description.indexOf('rain') !== -1 ||
        description.indexOf('thunderstorm') !== -1 ||
        description.indexOf('drizzle') !== -1) {
          return 'Дождь'
        }
        if (description.indexOf('snow') !== -1 ||
        description.indexOf('sleet') !== -1) {
          return 'Снег'
        }
        if (description.indexOf('mist') !== -1 ||
        description.indexOf('smoke') !== -1 ||
        description.indexOf('haze') !== -1 ||
        description.indexOf('sand') !== -1 ||
        description.indexOf('fog') !== -1 ||
        description.indexOf('dust') !== -1 ||
        description.indexOf('volcanic ') !== -1 ||
        description.indexOf('squalls') !== -1 ||
        description.indexOf('tornado') !== -1) {
          return 'Туманно'
        }
        if (description.indexOf('clear sky') !== -1) {
          return 'Безоблачно'
        }
        if (description.indexOf('overcast clouds') !== -1 ||
        description.indexOf('few clouds') !== -1 ||
        description.indexOf('scattered clouds') !== -1 ||
        description.indexOf('broken clouds') !== -1) {
          return 'Облачно'
        }
      }
    }
  }
}
</script>

<style scoped>
  .text-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .main-weather-block{
    overflow: hidden;
    transform-origin: 0 0;
    /* margin: auto; */
    width: 500px;
    height: 500px;
    font-family: Roboto;
    font-weight: bold;
    padding: 50px;
    line-height: 1;
  }

  .clearfix{
    clear: both;
  }
  .firstRow img{
    height: 110px;
    float: right;
  }
  .curTemp {
    font-size: 121px;
  }
  .city {
    font-size: 34px;
  }
  .temps {
    font-size: 34px;
    margin-top: 7px;
  }
  .secondBlocks {
    width: 158px;
    text-align: center;
    display: inline-block;
    position: relative;
    font-size:34px;
  }
  .secondBlocks img {
    height: 80px;
    margin-bottom: 10px;
  }
  .secondRow {
    margin-left: -70px;
    margin-right: -70px;
    text-align: center;
    margin-top: 10px;
  }
  .day {
    margin-top: 5px;
  }
</style>