<template>
  <div>
    <div class="content row no-gutters">
      <main class="main col">
        <div class="schedule-editor container">
          <h5>Название расписания</h5>
          <b-form-input
            ref="name"
            type="text"
            id="name"
            @input="validator"
            v-model="obj.name" />
          <div class="message" v-if="errors.name.show">
            {{ errors.name.text }}
          </div>
          <button
            class="btn btn-md btn-secondary"
            title="Настройки воспроизведения"
            @click="toogleTimeline">
            <i class="mi">&#xE923;</i>
            Настройки воспроизведения
          </button>
          <div class="clearfix"></div>
          <br>
          <button :disabled="!canEdit" class="btn btn-md btn-secondary float-right move__button" type="button" v-b-modal.selectDisplays>Выбрать плееры</button>
          <h5>Плееры</h5>
          <div id="players" class="template__list no_border">
            <DisplayElementsItem
              v-for="player in selectedDisplays"
              :key="player.id"
              :obj="player" />
          </div>
          <div class="message" v-if="errors.players.show">
            {{ errors.players.text }}
            <br>
            <br>
            <br>
          </div>
          <button :disabled="!canEdit" class="btn btn-secondary btn-md float-right move__button" type="button" v-b-modal.selectTemplate>Добавить шаблон</button>
          <h5>Расписание</h5>
          <div id="playlist" class="template__list">
            <draggable
              :list="templates"
              @end="move">
              <TemplateElementsItem
                v-for="template in templates"
                :key="template.id"
                :template="template" />
            </draggable>            
          </div>
          <div class="message" v-if="errors.playlist.show">
            {{ errors.playlist.text }}
          </div>
          <button v-if="canEdit" :disabled="isChanging" class="btn btn-md btn-secondary float-right" type="button" v-b-modal.cancel>Отмена</button>
          <button v-if="!editItem && canEdit" :disabled="isChanging" class="btn btn-md btn-primary float-right" type="button" @click="createSchedule">Сохранить</button>
          <button v-if="editItem && canEdit" :disabled="isChanging" class="btn btn-md btn-primary float-right" type="button" @click="editSchedule">Сохранить</button>
        </div>
      </main>
    </div>
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
      id="badDisplays"
      ref="badDisplays"
      size="lg"
      title="Замена расписания у плееров" 
      cancel-title="Отмена"
      :hide-footer="true">
      У {{ colOfBad }} уже назначено другое расписание.
      <br>
      <br>
      <br>
      <button class="btn btn-md btn-secondary" type="button" @click="approveAll">Заменить на новое</button>
      <button class="btn btn-md btn-secondary" type="button" @click="removeAll">Оставить прежнее</button>
      <button class="btn btn-md btn-secondary" type="button" v-b-modal.approving>Запрашивать для каждого плеера</button>
    </b-modal>
    <b-modal centered
      id="approving"
      ref="approving"
      title="Замена расписания у плееров" 
      cancel-title="Отмена"
      @ok="recalcBads"
      @show="reseter">
      <h6>У каких плееров вы хотите заменить расписание на новое?</h6>
      У остальных плееров будет оставлено прежнее расписание
      <div class="row no-gutters header">
        <div class="col col-8">Название дисплея</div>
        <div class="col col-2">
          <input type="checkbox" id="checkbox" :indeterminate.prop="this.indeterminate" v-model="all" @change="select">
          <label for="checkbox" class="labl">Выбрать</label>
        </div>
      </div>
      <div class="bounded">
        <div
          class="row no-gutters list-item"
          v-for="c in badDisplays"
          :key="c.id"
          :show="c.show">
          <div class="col col-8">{{ c.name }}</div>
          <div class="col col-2">
            <b-form-checkbox v-model="c.selected" @change="pick">
              {{ c.selected ? 'да' : 'нет' }}
            </b-form-checkbox>
          </div>
        </div>
      </div>
    </b-modal>
    <ModalDisplaysSearch />
    <ModalTemplatesSearch @next="showElementEditor"/>
    <ModalCreatePlaylistItem />
    <ModalTimelineSettings :timeline="timeline.obj.timeline" @changeTimeline="changeTimeline"/>
    <ModalConfirmLeaving
      title="Все изменения будут утеряны"
      warning="Вы уверены, что хотите покинуть эту страницу?"
      :ok="leaveSchedule" />
  </div>
</template>

<script>
  import {
    createScheduleObject,
    getScheduleObject,
    editScheduleObject
    } from '../../../api/schedule-manager'
  import ModalDisplaysSearch from './../modals/ModalDisplaysSearch'
  import ModalCreatePlaylistItem from './../modals/ModalCreatePlaylistItem'
  import ModalTimelineSettings from './../modals/ModalTimelineSettings'
  import ModalTemplatesSearch from './../modals/ModalTemplatesSearch'
  import ModalConfirmLeaving from './../modals/ModalConfirmLeaving'
  import draggable from 'vuedraggable'
  import axios from 'axios'
  import TemplateElementsItem from './TemplateElementsItem'
  import DisplayElementsItem from './DisplayElementsItem'
  import RulesChecker from '../../../helpers/rulesChecker'
  import { getDisplayObjects } from '../../../api/display-manager'

  export default {
    name: 'schedule-editor',
    computed: {
      allDisplays () {
        return this.$store.getters.displays
      },
      templates () {
        return this.$store.getters.currentSchedule.playlist
      },
      selectedDisplays () {
        return this.$store.getters.currentSchedule.displays
      },
      currentSchedule () {
        return this.$store.getters.currentSchedule
      },
      timeline () {
        return this.$store.getters.timelineSelection
      },
      scheduleTimeline () {
        return this.$store.getters.currentSchedule.timeline
      },
      colOfBad () {
        const counter = this.badDisplays.length - this.approvedDisplays.length
        if (counter === 1) {
          return counter + ' плеера'
        } else {
          return counter + ' плееров'
        }
      }
    },
    components: {
      ModalDisplaysSearch,
      ModalCreatePlaylistItem,
      ModalTemplatesSearch,
      ModalTimelineSettings,
      TemplateElementsItem,
      ModalConfirmLeaving,
      draggable,
      axios,
      DisplayElementsItem
    },
    created () {
      this.checkRule()
      const id = this.$route.params.id
      this.resetSchedule()
      if (id !== 'new') {
        this.loadSchedule(id)
        this.editItem = true
      } else {
        this.obj.name = 'Новое расписание'
        this.editItem = false
        this.fetchData()
      }
    },
    beforeRouteLeave (to, from, next) {
      this.fn = () => {
        this.isLeaving = true
        next()
      }
      if (!this.isLeaving) {
        this.$store.commit('TOGGLE_CONFIRM_LEAVING', true)
      }
      if (this.isLeaving) {
        this.$store.commit('CLEAR_SCHEDULE')
      }
      next(this.isLeaving)
    },
    methods: {
      checkRule () {
        if (this.$store.getters.passport.id && this.$store.getters.userGroup.length > 0) {
          const id = this.$route.params.id
          if (id === 'new') {
            this.canEdit = RulesChecker.canUserDo('create', 'schedules', this.$store.getters)
          } else {
            this.canEdit = RulesChecker.canUserDo('edit', 'schedules', this.$store.getters)
          }
        } else {
          console.log('make a timer')
          setTimeout(() => { this.checkRule() }, 200)
        }
      },
      recalcBads () {
        this.badDisplays.forEach((el) => {
          if (el.selected) {
            this.approvedDisplays.push(el.id)
          } else {
            this.$store.commit('REMOVE_SELECTED_PLAYER', el.id)
          }
        })
      },
      reseter () {
        this.all = false
        this.indeterminate = false
      },
      pick () {
        setTimeout(() => {
          var status = false
          var allCheck = true
          this.badDisplays.forEach((el) => {
            if (el.selected) {
              if (!status) {
                status = true
              }
            } else {
              allCheck = false
            }
          })
          if (allCheck) {
            this.all = true
            this.indeterminate = false
          } else {
            this.all = false
            this.indeterminate = status
          }
        }, 200)
      },
      select () {
        setTimeout(() => {
          this.badDisplays.forEach((el) => {
            el.selected = this.all
          })
          this.indeterminate = false
        }, 200)
      },
      removeAll () {
        this.badDisplays.forEach((el) => {
          this.$store.commit('REMOVE_SELECTED_PLAYER', el.id)
        })
        this.$refs.badDisplays.hide()
      },
      approveAll () {
        this.badDisplays.forEach((el) => {
          this.approvedDisplays.push(el.id)
        })
        this.$refs.badDisplays.hide()
      },
      leaveSchedule () {
        if (typeof this.fn === 'function') this.fn()
      },
      toogleTimeline () {
        this.$store.commit('SELECT_TIMELINE', {type: 'schedule', obj: this.$store.getters.currentSchedule})
        this.$store.commit('TOGGLE_TIMELINE_SETTINGS', true)
      },
      fetchData () {
        this.isLoading = true
        return getDisplayObjects().then(response => {
          const data = response.data
          if (!data) return
          this.updateCatalogue(data)
          this.isLoading = false
          if (this.$route.query.d) {
            var e = {}
            this.$store.getters.displays.forEach(element => {
              if (element.id === parseInt(this.$route.query.d)) e = element
            })
            this.$store.getters.currentSchedule.displays.push({
              id: e.id,
              name: e.name,
              pincode: e.pincode,
              type: e.type,
              schedule: e.schedule,
              selected: true,
              show: true
            })
            this.approvedDisplays.push(e.id)
          }
        }).catch(error => {
          console.log(error)
          this.isLoading = false
        })
      },
      updateCatalogue: function (data) {
        this.$store.dispatch('uploadDisplays', data)
      },
      move () {
        this.$store.commit('CHANGE_PLAYLIST_ORDER', this.templates)
      },
      showElementEditor () {
        console.log('nokek')
        this.$store.commit('TOGGLE_CREATE_PLAYLIST_ITEM', true)
      },
      leavePage () {
        this.isLeaving = true
        this.$store.commit('CLEAR_SCHEDULE')
        this.resetSchedule()
        if (this.$route.query.d || this.$route.query.p) {
          this.$router.push('/players')
        } else {
          this.$router.push('/schedules')
        }
      },
      loadSchedule (id) {
        this.isChanging = true
        return getScheduleObject(id).then(response => {
          const data = response.data
          if (!data) return
          this.$store.commit('LOAD_SCHEDULE', data)
          this.obj.name = this.$store.getters.currentSchedule.name
          this.isChanging = false
          this.fetchData()
        }).catch(error => {
          console.log(error)
          this.isChanging = false
        })
      },
      editSchedule () {
        var err = this.validate()
        if (err) return
        this.isChanging = true
        const schedule = {}
        schedule.id = this.$store.getters.currentSchedule.id
        schedule.name = this.obj.name
        schedule.playlist = JSON.stringify(this.templates)
        schedule.displays = JSON.stringify(this.selectedDisplays)
        schedule.timeline = JSON.stringify(this.scheduleTimeline)
        return editScheduleObject(schedule).then(response => {
          const data = response.data
          if (!data) return
          this.$root.sockets.sendData('updateSchedule', { schedule: this.currentSchedule.id })
          this.isChanging = false
          this.$store.commit('CLEAR_SCHEDULE')
          this.resetSchedule()
          this.isLeaving = true
          this.leavePage()
        }).catch(error => {
          console.log(error)
          this.isChanging = false
        })
      },
      createSchedule () {
        var err = this.validate()
        if (err) return
        this.isChanging = true
        const schedule = {}
        schedule.name = this.obj.name
        schedule.templates = this.templates
        schedule.displays = this.$store.getters.currentSchedule.displays
        schedule.timeline = this.scheduleTimeline
        return createScheduleObject(schedule).then(response => {
          const data = response.data
          if (!data) return
          this.$store.commit('PUSH_SCHEDULE', data)
          this.isChanging = false
          this.resetSchedule()
          this.isLeaving = true
          this.leavePage()
        }).catch(error => {
          console.log(error)
          this.isChanging = false
        })
      },
      resetSchedule () {
        this.$store.commit('CLEAR_SCHEDULE')
        this.obj = {
          name: null
        }
      },
      removeSelection: function () {
        this.$store.commit('REMOVE_SELECTION')
      },
      changeTimeline (data) {
        if (this.timeline.type === 'playlist') {
          this.$store.commit('UPDATE_SCHEDULE_PLAYLIST_ITEM', {obj: this.timeline.obj, timeline: data.new})
        }
        if (this.timeline.type === 'schedule') {
          this.$store.commit('UPDATE_SCHEDULE_TIMELINE_ITEM', data.new)
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
        var el = document.getElementsByTagName('main')
        console.log(selectedPosX, selectedPosY)
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
        this.badDisplays = []
        this.selectedDisplays.forEach((el) => {
          if (el.schedule !== null && el.schedule.id !== this.currentSchedule.id) {
            if (this.approvedDisplays.indexOf(el.id) === -1) {
              el.selected = false
              this.badDisplays.push(el)
              err = true
            }
          }
        })
        if (this.badDisplays.length > 0) {
          this.badIndex = 0
          this.activeBad.name = this.badDisplays[this.badIndex].name
          this.activeBad.id = this.badDisplays[this.badIndex].id
          this.$refs.badDisplays.show()
        }
        return err
      }
    },
    data () {
      return {
        canEdit: false,
        all: false,
        indeterminate: false,
        badDisplays: [],
        badIndex: 0,
        activeBad: {
          name: '',
          id: 0
        },
        approvedDisplays: [],
        obj: {
          name: null
        },
        errors: {
          name: {
            text: 'Введите название расписания',
            show: false
          },
          players: {
            text: 'Должен быть выбран хоть один плеер',
            show: false
          },
          playlist: {
            text: 'Должен быть выбран хотя бы один шаблон',
            show: false
          }
        },
        editItem: false,
        isLoading: false,
        isChanging: false,
        isLeaving: false
      }
    }
  }
</script>

<style scoped>
.message {
  color:red
}
.no_border .list-item:first-child {
  border-top: none;
}
#app input[type=text][readonly="readonly"] {
  box-sizing: border-box!important;
  height: 40px;
  padding: 0;
  border-bottom: 1px solid #bdbdbd!important;
}
#app input[type=text][readonly="readonly"]:focus {
  border-bottom: 1px solid #4aafb7!important;
}
#aboutSchedule p {
  font-size: 15px!important;
}
.main {
  overflow-y: scroll!important;
}
.getApp {
  border:1px solid #ccc;
  padding: 21px 5px;
  font-size: 17px;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 15px;
}
.getApp i {
  top: 3px;
}
.schedule-editor {
  margin-top: 15px;
}
.template__list {
  border: 1px solid #bdbdbd;
  border-radius: 5px;
  overflow-y: scroll;
  padding: 5px 15px;
  min-height: 160px;
  max-height: 295px;
  margin: 15px 0 45px 0;
}
.template__list.no_border {
  min-height: 106px;
  max-height: 207px;
}
.move__button {
  margin-top: -8px;
}
.bounded {
  margin: 1rem 0;
  max-height: 160px;
  overflow-y: scroll;
}
.header {
  width: calc(100% - 14px);
  padding: 4px 0;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1.5px solid rgba(235,235,235,1);
  align-items: center;
}
.list-item {
  padding: 4px 0;
}
.labl {
  position: absolute;
  top: 5px;
}
#checkbox {
  margin-top: 5px;
  margin-right: 5px;
}
</style>