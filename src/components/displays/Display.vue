<template>
  <div v-if="canSee" class="main col">
    <main class="display-editor container">
      <div class="">
        <h5>Имя плеера</h5>
        <b-form-input
          ref="name"
          type="text"
          id="name"
          @change="validator"
          placeholder="Имя плеера"
          v-model="obj.name" />
      </div>
      <div class="message" v-if="errors.name.show">
        {{ errors.name.text }}
      </div>
      <VolumeTool
        class="float-left"
        :initialVolume="volume"
        :initialMute="mute"
        :changeVolume="changeVolume"
        :mute="changeMute" />
      <div class="text-right">
        <button
          class="btn btn-md btn-secondary"
          title="Отвязать устройство"
          :disabled="notActivated || !canEdit"
          @click="disActivate">
          <i class="mi mi-clear"></i>
          Отвязать устройство
        </button>
        <button
          class="btn btn-md btn-secondary"
          title="Получить статистику"
          :disabled="isGetStats || disabler || !canEdit"
          @click="getStats">
          Получить статистику
        </button>
        <button
          class="btn btn-md btn-secondary"
          title="Перезагрузить устройство"
          :disabled="isReboot || disabler || !canEdit"
          @click="reboot">
          <i class="mi mi-power-settings-new"></i>
          Перезагрузить устройство
        </button>
        <button
          class="btn btn-md btn-secondary"
          title="Перезапустить плеер"
          :disabled="isRebootPlayer || disabler || !canEdit"
          @click="rebootPlayer">
          <i class="mi mi-cached"></i>
          Перезапустить плеер
        </button>
      </div>
      <div class="row">
        <div class="col-md-6">
          <h5>Параметры плеера</h5>
          <ul class="list-group">
            <li class="list-group-item">
              <span class="lefter">Пинкод плеера</span>
              <span id="pincode">{{ currentDisplay.pincode }}</span>
              <button :disabled="isCopyPincodeDisable" @click="copyPincode" class="btn btn-sm btn-secondary apply-rotation">Скопировать</button>
            </li>
            <li class="list-group-item">
              <span class="lefter">Статус</span>
              <span v-html="rawHtml"></span><img v-if="this.currentDisplay.active == 'Loading'" src="/static/img/spinner.gif" class="loading"/>
            </li>
            <li class="list-group-item">
              <span class="lefter">Назначенное расписание</span>
              <span class="scheduler" @click="scheduler">{{ currentDisplay.schedule | scheduleValue }} </span>
              <i title="Изменить" v-if="this.currentDisplay.schedule" class="mi mi-edit scheduler" v-b-modal.setSchedule></i>
            </li>
            <li class="list-group-item">
              <span class="lefter">Последнее подключение</span>
              {{ currentDisplay.connected_at | formatDate }} <i title="Статистика" class="mi mi-today statistic" v-b-modal.log></i>
            </li>
            <li class="list-group-item">
              <span class="lefter">Разрешение</span>
              {{ currentDisplay.resolution }}
            </li>
            <li class="list-group-item">
              <span class="lefter">Поворот экрана</span>
              <div class="angle">{{ rotation }}°</div><i class="mi mi-autorenew rotate" @click="rotate" title="Повернуть экран на 90°"></i>
              <button class="btn btn-sm btn-secondary apply-rotation" :disabled="isChanging || !canEdit" @click="applyRotation">Применить</button>
            </li>
            <li class="list-group-item">
              <span class="lefter">Операционная система</span>
              {{ currentDisplay.type }}
            </li>
          </ul>
        </div>
        <div class="col-md-6">
          <h5>Скриншот плеера
            <button
              class="btn btn-md btn-secondary float-right move__button"
              title="Обновить"
              @click="renewScreen"
              :disabled="disabler || isImaging">
              <i class="mi mi-autorenew"></i>
              Обновить
            </button>
          </h5>
          <div class="screenshot">
            <div v-if="disabler">Нет данных</div>
            <img v-if="screenshot && !disabler" :src="currentDisplay.screenshot" alt="">
            <div v-if="isImaging" class="loaderer"></div>
          </div>
        </div>
      </div>
      <br>
      <h5>Место расположения плеера</h5>
      <button v-if="!this.newAd && this.obj.adresses.length > 0" class="btn btn-md btn-secondary" type="button" v-b-modal.selectAdr>Выбрать из раннее введеных</button>
      <button v-if="!this.newAd && this.obj.adresses.length > 0 && this.obj.adr" class="btn btn-md btn-secondary" type="button" @click="toogleNew(true)">Задать новое</button>
      <button v-if="this.newAd && this.obj.adresses.length > 0" class="btn btn-md btn-secondary" type="button" @click="toogleNew(false)">Отменить изменение адреса</button>
      <div v-if="obj.adress && !this.newAd">
        <br>
        <h6>Адрес</h6>
        <b-form-input
          ref="name"
          type="text"
          :readonly="true"
          id="name"
          placeholder="Имя плеера"
          v-model="obj.adress" />
        <h6>Широта</h6>
        <b-form-input
          ref="name"
          type="text"
          :readonly="true"
          placeholder="Широта"
          v-model="obj.lat" />
        <h6>Долгота</h6>
        <b-form-input
          ref="name"
          type="text"
          :readonly="true"
          placeholder="Долгота"
          v-model="obj.lon" />
      </div>
      <div v-if="!this.obj.adr || this.newAd">
        <br>
        <h6>Адрес</h6>
        <vue-google-autocomplete
          id="map"
          classname="form-control"
          placeholder="Начните вводить"
          v-on:placechanged="getAddressData">
        </vue-google-autocomplete>
        <h6>Широта</h6>
        <b-form-input
          ref="name"
          type="number"
          step="any"
          placeholder="Широта"
          v-model="lat" />
        <h6>Долгота</h6>
        <b-form-input
          ref="name"
          step="any"
          type="number"
          placeholder="Долгота"
          v-model="lon" />
      </div>
      <button v-if="canEdit" :disabled="isChanging" class="btn btn-md btn-secondary float-right" type="button" v-b-modal.cancel>Отмена</button>
      <button v-if="canEdit" :disabled="isChanging" class="btn btn-md btn-primary float-right" type="button" @click="editDisplay">Сохранить</button>
    </main>
    <b-modal centered
      id="selectAdr"
      ref="selectAdr"
      title="Выбор адреса"
      cancel-title="Отмена"
      :hide-footer="true">
      <div
        class="adresser"
        v-for="el in this.obj.adresses"
        :key='el.id'
        @click="selectAdress(el.id)">
        {{el.adress}}
      </div>
      <img
        v-if="isChanging"
        src="/static/img/spinner.gif"
        class="loader">
    </b-modal>
    <b-modal centered
      id="log"
      ref="log"
      title="Статистика"
      cancel-title="Отмена"
      :hide-footer="true">
      <div class="scrollable">
        <div class="row" v-for="log in currentDisplay.log">
          <div class="col-md-8">{{ log.updated_at | formatDate }}</div>
          <div class="col-md-4">{{ log.action }}</div>
        </div>
      </div>
    </b-modal>
    <b-modal centered
      id="cancel"
      ref="cancel"
      title="Отмена изменений"
      cancel-title="Отмена"
      :hide-footer="isChanging"
      @ok="leavePage">
      Несохраненные данные будут утеряны, вы точно хотите покинуть страницу?
      <img
        v-if="isChanging"
        src="/static/img/spinner.gif"
        class="loader">
    </b-modal>
    <b-modal centered
      id="setSchedule"
      ref="setSchedule"
      title="Назначение расписания плееру"
      cancel-title="Отмена"
      :hide-footer="true">
      <p>Создать новое расписание или добавить плеер в существующее?</p>
      <button type="button" class="btn btn-secondary btn-md" @click="$router.push('/schedules/new?d=' + currentDisplay.id)">Создать новое</button>
      <button type="button" class="btn btn-secondary btn-md" @click="openLister()">Добавить в существующее</button>
      <div v-if="openList" class="row no-gutters header">
        <div class="col col-12">Название расписания</div>
      </div>
      <div v-if="openList" class="bounded">
        <div
          class="row no-gutters list-item"
          v-for="c in scheduleList"
          :key="c.id"
          @click="selectSchedule(c.id)">
          <div class="col col-12">{{ c.name }}</div>
        </div>
      </div>
    </b-modal>
  </div>
  <div v-else>
    У вас нет прав на просмотр содержимого страницы
  </div>
</template>
<script>
  import { getDisplayObject, editDisplayObject, logoutDisplay } from '../../../api/display-manager'
  import RulesChecker from '../../../helpers/rulesChecker'
  import VueGoogleAutocomplete from 'vue-google-autocomplete'
  import VolumeTool from '../common/VolumeTool'
  import moment from 'moment'

  export default {
    components: {
      VueGoogleAutocomplete,
      VolumeTool
    },
    name: 'display-editor',
    beforeRouteLeave (to, from, next) {
      this.fn = () => {
        this.isLeaving = true
        next()
      }
      var el = document.getElementsByClassName('pac-container')
      el[0].parentNode.removeChild(el[0])
      console.log('khe')
      clearTimeout(this.timer)
      next(this.isLeaving)
    },
    watch: {
      canSee (v) {
        if (v) {
          const id = this.$route.params.id
          this.loadDisplay(id)
          if (this.scheduleList.length === 0) {
            this.$store.dispatch('fetchSchedules')
          }
        }
      }
    },
    created () {
      this.checkRule()
      this.isCopyPincodeDisable = !(navigator && navigator.clipboard)
    },
    filters: {
      scheduleValue (value) {
        if (value === null) {
          return 'Назначить расписание'
        } else {
          const maxNameLength = 15
          if (value.name.length > maxNameLength) {
            return value.name.substr(0, maxNameLength) + ' ...'
          }
          return value.name
        }
      },
      formatDate (value) {
        if (value) {
          const date = moment.utc(value).format()
          if (date === 'Invalid Date') return value
          return moment(date).format('DD.MM.YYYY HH:mm')
        }
      }
    },
    computed: {
      scheduleList () {
        return this.$store.getters.schedules
      },
      notActivated () {
        return this.currentDisplay.active === 'Не активирован'
      },
      disabler () {
        return this.currentDisplay.active !== 'Online'
      },
      rawHtml () {
        if (this.currentDisplay.active === 'Offline') {
          this.first = true
          return '<span style="color: red">Offline</span> <span class="mi mi-error" style="color: red"></span>'
        }
        if (this.currentDisplay.active === 'Online') {
          if (this.first) {
            this.renewScreen()
            this.first = false
          }
          return '<span style="color: green">Online</span> <span class="mi mi-check-circle" style="color: green"></span>'
        }
        if (this.currentDisplay.active === 'Не активирован') {
          return 'Не активирован'
        }
      },
      currentDisplay () {
        return this.$store.getters.currentDisplay
      }
    },
    methods: {
      checkRule () {
        if (this.$store.getters.passport.id && this.$store.getters.userGroup.length > 0) {
          this.canSee = RulesChecker.canUserDo('', 'players', this.$store.getters)
          this.canEdit = RulesChecker.canUserDo('edit', 'players', this.$store.getters)
        } else {
          console.log('make a timer')
          setTimeout(() => { this.checkRule() }, 200)
        }
      },
      rotate () {
        if (this.rotation === 270) {
          this.rotation = 0
        } else {
          this.rotation = this.rotation + 90
        }
      },
      changeMute (newMute) {
        this.mute = newMute
      },
      changeVolume (newVolume) {
        this.volume = newVolume
      },
      selectSchedule (id) {
        this.$router.push('/schedules/' + id + '?d=' + this.currentDisplay.id)
      },
      openLister () {
        this.openList = true
      },
      selectAdress (id) {
        this.obj.adr = id
        const item = this.obj.adresses.find((e) => e.id === id)
        this.obj.adress = item.adress
        this.obj.lat = item.lat
        this.obj.lon = item.lon
        this.$refs.selectAdr.hide()
      },
      toogleNew (stat) {
        if (!stat) {
          this.newAdr = null
        }
        this.newAd = stat
      },
      renewLocation () {
        this.obj.lat = this.lat
        this.obj.lon = this.lon
      },
      getAddressData (e) {
        console.log(e)
        this.newAdr = JSON.stringify(e)
        this.lat = e.latitude
        this.lon = e.longitude
      },
      disActivate () {
        this.isChanging = true
        return logoutDisplay(this.currentDisplay.token).then(response => {
          this.$root.sockets.sendData('alert', { client: this.currentDisplay.id, message: 'logout' })
          const data = response.data
          if (!data) return
          this.isChanging = false
          this.loadDisplay(this.currentDisplay.id)
        }).catch(error => {
          console.log(error)
          this.isChanging = false
        })
      },
      getStats () {
        this.isGetStats = true
        this.$root.sockets.sendData('alert', { client: this.currentDisplay.id, message: 'stats' })
        setTimeout(() => { this.isGetStats = false }, 500)
      },
      reboot () {
        this.isReboot = true
        this.$root.sockets.sendData('alert', { client: this.currentDisplay.id, message: 'reboot' })
        setTimeout(() => { this.isReboot = false }, 500)
      },
      rebootPlayer () {
        this.isRebootPlayer = true
        this.$root.sockets.sendData('alert', { client: this.currentDisplay.id, message: 'rebootPlayer' })
        setTimeout(() => { this.isRebootPlayer = false }, 500)
      },
      renewScreen () {
        this.$root.sockets.sendData('alert', { client: this.currentDisplay.id, message: 'makeScreenShot' })
        this.isImaging = true
        this.timer = setTimeout(() => {
          if (this.currentDisplay.id) {
            this.screenshot = true
            this.loadImage(this.currentDisplay.id)
            this.isImaging = false
          }
        }, 10000)
      },
      leavePage () {
        this.reset()
        this.$router.push('/players')
      },
      reset () {
        this.obj = {
          name: null,
          adr: null,
          adresses: []
        }
        this.adr = null
        this.lat = null
        this.lon = null
        this.rotation = 0
        this.$store.commit('CLEAR_DISPLAY')
      },
      loadImage (id) {
        return getDisplayObject(id).then(response => {
          const data = response.data
          if (!data) return
          this.$store.commit('LOAD_DISPLAY', data)
          if (this.currentDisplay.token) {
            this.$root.sockets.sendData('checkSingleStatus', { client: this.currentDisplay.id })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      loadDisplay (id) {
        this.isChanging = true
        return getDisplayObject(id).then(response => {
          const data = response.data
          if (!data) return
          this.$store.commit('LOAD_DISPLAY', data)
          this.obj.name = this.currentDisplay.name
          this.mute = this.currentDisplay.mute
          this.volume = this.currentDisplay.volume
          this.rotation = this.currentDisplay.rotation
          if (this.currentDisplay.adr) {
            this.obj.adr = this.currentDisplay.adr.id
            this.obj.adress = this.currentDisplay.adr.adress
            this.obj.lat = this.currentDisplay.adr.lat
            this.obj.lon = this.currentDisplay.adr.lon
          }
          this.obj.adresses = this.currentDisplay.adresses
          this.isChanging = false
          this.$root.$emit('setVolume')
          if (this.currentDisplay.token) {
            this.$root.sockets.sendData('checkSingleStatus', { client: this.currentDisplay.id })
          }
        }).catch(error => {
          console.log(error)
          this.isChanging = false
        })
      },
      applyRotation () {
        this.isChanging = true
        const display = {}
        display.rotation = this.rotation
        display.id = this.currentDisplay.id
        return editDisplayObject(display).then(response => {
          const data = response.data
          if (!data) return
          this.$root.sockets.sendData('setRotation', { client: this.currentDisplay.id, message: this.rotation })
          this.isChanging = false
        }).catch(error => {
          console.log(error)
          this.isChanging = false
        })
      },
      editDisplay () {
        var err = this.validate()
        if (err) return
        this.isChanging = true
        const display = {}
        display.id = this.currentDisplay.id
        display.name = this.obj.name
        display.volume = this.volume
        display.rotation = this.rotation
        display.mute = this.mute
        display.adress = '{}'
        if (this.newAdr) {
          display.newAdr = this.newAdr
        } else {
          display.adr = this.obj.adr
        }
        return editDisplayObject(display).then(response => {
          const data = response.data
          if (!data) return
          if (this.mute) {
            console.log('setVolume' + 0)
            this.$root.sockets.sendData('setVolume', { client: this.currentDisplay.id, message: 0 })
          } else {
            console.log('setVolume' + this.volume * 0.01)
            this.$root.sockets.sendData('setVolume', { client: this.currentDisplay.id, message: this.volume * 0.01 })
          }
          this.$root.sockets.sendData('setRotation', { client: this.currentDisplay.id, message: this.rotation })
          this.isChanging = false
          this.reset()
          this.$router.push('/players')
        }).catch(error => {
          console.log(error)
          this.isChanging = false
        })
      },
      scheduler () {
        if (this.currentDisplay.schedule === null) {
          this.$router.push('/schedules/new?d=' + this.currentDisplay.id)
        } else {
          this.$router.push('/schedules/' + this.currentDisplay.schedule.id + '?p=1')
        }
      },
      scrollto (theElement) {
        var selectedPosX = 0
        var selectedPosY = 0
        while (theElement != null) {
          selectedPosX += theElement.offsetLeft
          selectedPosY += theElement.offsetTop - 50
          theElement = theElement.offsetParent
        }
        var el = document.getElementsByClassName('main')
        el[0].scrollTo(selectedPosX, selectedPosY)
      },
      validator () {
        if (this.errors.name.show) {
          this.validate()
        }
      },
      validate () {
        var err = false
        if (this.obj.name === '') {
          this.errors.name.show = true
          err = true
          this.scrollto(document.getElementById('name'))
        } else { this.errors.name.show = false }
        return err
      },
      copyPincode () {
        let pincode = this.currentDisplay.pincode
        this.isCopyPincodeDisable = true
        if (navigator && navigator.clipboard) {
          navigator.clipboard.writeText(pincode)
          setTimeout(() => { this.isCopyPincodeDisable = false }, 500)
        } else console.log('копирование запрещено, не безопасно')
      }
    },
    data () {
      return {
        timer: null,
        canSee: false,
        canEdit: false,
        volume: 100,
        rotation: 0,
        mute: false,
        screenshot: false,
        first: true,
        openList: false,
        errors: {
          name: {
            text: 'Введите название плеера',
            show: false
          }
        },
        obj: {
          name: null,
          adr: null,
          adress: null,
          adresses: [],
          lat: null,
          lon: null
        },
        adr: null,
        lat: null,
        lon: null,
        newAdr: null,
        newAd: false,
        editItem: false,
        isLoading: false,
        isImaging: false,
        isChanging: false,
        isGetStats: false,
        isReboot: false,
        isRebootPlayer: false,
        isCopyPincodeDisable: false
      }
    }
  }
</script>
<style scoped>
  .apply-rotation {
    position: absolute;
    top: 1px;
    right: 1px;
  }
  .scroller {
    max-height: 190px;
    overflow-y: auto;
  }
  .statistic {
    font-size: 17px;
    top: 3px;
    margin-left: 5px;
    color: #6fb6d2;
    cursor: pointer;
  }
  #app input[type=text][readonly="readonly"] {
    color: #000;
    padding: 8px 0;
    font-size: 16px;
    border-bottom: 1px solid #bdbdbd!important;
  }
  .adresser {
    border-bottom: 1px solid #e9ecef;
    padding: 5px 0px;
    cursor: pointer;
  }
  .adresser:last-child {
    border: none;
  }
  .message {
    color:red
  }
  .display-editor {
    padding-top: 15px;
  }
  .row {
    margin-top: 15px;
  }
  .row h5 {
    margin-bottom: 15px;
  }
  .screenshot {
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 3px;
    padding: 0.75rem 1.25rem;
    min-height: 300px;
    position: relative;
  }
  .screenshot img{
    width: 100%;
  }
  .move__button {
    margin-top: -8px;
  }
  .lefter {
    width: 50%;
    float: left;
  }
  .scheduler, .rotate{
    color: #00b0b7;
    cursor: pointer;
  }
  .rotate {
    top: 3px;
    margin-right: 5px;
  }
  .loading{
    width: 28px;
    margin-top: -8px;
    margin-bottom: -4px;
  }
  .loaderer {
  background-image: url('/static/img/loading-spinner.gif');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 26px 26px;
  background-color: #ffffff8a;
  top: 0;
  width: 100%;
  left: 0;
  height: 100%;
  position: absolute;
}
.bounded {
  margin: 1rem 0;
  max-height: 160px;
  overflow-y: scroll;
}
.header {
  padding: 4px 0;
  margin-right: 15px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1.5px solid rgba(235,235,235,1);
  align-items: center;
}
.list-item {
  padding: 4px 0;
  cursor: pointer;
}
.bounded .row{
  margin-top:0;
}
i.scheduler{
  font-size: 17px;
  top: 3px;
  margin-left: 5px;
}
.angle {
  width: 37px;
  float: left;
}
</style>