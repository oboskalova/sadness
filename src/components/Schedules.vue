<template>
  <div>
    <div class="content row no-gutters">
      <main class="main col" @click.self="removeSelection">
        <div class="file-manager container">
          <ScheduleList
            :catalogue="catalogue"
            :isLoading="isLoading"/>
          <b-modal centered
            id="createSchedule"
            ref="createSchedule"
            title="Создать новый дисплей" 
            cancel-title="Отмена"
            :hide-footer="isChanging"
            @ok="createSchedule"
            @shown="resetSchedule()">
            <p>Название дисплея</p>
            <b-form-input
              ref="name"
              type="text"
              :disabled="isChanging"
              v-model="newName" />
            <img
              v-if="isChanging"
              src="/static/img/spinner.gif"
              class="loader">
          </b-modal>
          <b-modal centered
            id="aboutSchedule"
            ref="aboutSchedule"
            title="Создать новый дисплей" 
            hide-footer>
            <p>Вы добавили дисплей с названием '{{ newSchedule.name }}'. Активируейте новый дисплей, согласно следующим шагам:</p>
            <p><span class="badge badge-success">Шаг 1</span> Загрузите и установите Cubic Player на вашем устройстве</p>
            <div class="row download">
              <div class="col-md-6">
                <div class="getApp">
                  <a href=""><i class="mi mi-get-app"></i> Скачать на Android</a>
                </div>                
              </div>
            </div>
            <p><span class="badge badge-success">Шаг 2</span> Открыв Cubic Player, введите указаный пинкод
             на устройстве для завершения установки</p>
            <input v-model="newSchedule.pincode"
              readonly
              type="text" 
              @focus="$event.target.select()"
              class="pincode">
            <p>После активации Дисплей сможет показывать Ваши презентации.</p>
            <p>Мы так же отправили инструкции на Ваш email.</p>
          </b-modal>
          
        </div>
      </main>
    </div>
    <b-modal centered
      id="delete-schedule"
      ref="delete-schedule"
      title="Подтверждение удаления" 
      cancel-title="Отмена"
      :hide-footer="isChanging"
      @ok="deleteSchedule">
      Вы действительно хотите удалить расписание?
      <img
        v-if="isChanging"
        src="/static/img/spinner.gif"
        class="loader">
    </b-modal>
    <ModalRename />
  </div>
</template>

<script>
  import ScheduleList from './schedules/SchedulesList'
  import ModalRename from './modals/ModalRename'
  import {
    getScheduleObjects,
    createScheduleObject,
    removeScheduleObject
  } from '../../api/schedule-manager'

  export default {
    name: 'schedule-manager',
    filters: {
      truncate (value) {
        value = value + ''
        if (value.length > 40) {
          return `${value.substr(0, 24)} ... ${value.substr(-16)}`
        }
        return value
      },
      percent (value) {
        return `${value.toFixed(1)}%`
      }
    },
    computed: {
      isLoading () {
        return this.$store.getters.scheduleLoading
      },
      catalogue () {
        // const isSearching = this.$store.getters.searchingSchedules
        const isSearching = false
        return isSearching
          ? this.$store.getters.searchScheduleResults
          : this.$store.getters.schedules
      },
      choosedObjects () {
        return this.$store.getters.choosedObjects
      },
      selectedSchedule () {
        return this.$store.getters.targetScheduleId
      },
      targetObject () {
        return this.$store.getters.firstSelected
      }
    },
    created () {
      this.fetchData()
    },
    methods: {
      createSchedule () {
        this.isChanging = true
        return createScheduleObject(this.newName).then(response => {
          const data = response.data
          if (!data) return
          this.$store.commit('PUSH_Schedule', data)
          this.newSchedule = data
          this.isChanging = false
          this.$refs.aboutSchedule.show()
        }).catch(error => {
          console.log(error)
          this.isChanging = false
        })
      },
      resetSchedule () {
        this.newName = ''
        this.newSchedule = {}
      },
      removeSelection: function () {
        this.$store.commit('REMOVE_SCHEDULE_SELECTION')
      },
      fetchData: function () {
        this.$store.commit('TOOGLE_SCHEDULE_LOADING', true)
        return getScheduleObjects().then(response => {
          const data = response.data
          if (!data) return
          this.updateCatalogue(data)
          this.$store.commit('TOOGLE_SCHEDULE_LOADING', false)
        }).catch(error => {
          console.log(error)
          this.$store.commit('TOOGLE_SCHEDULE_LOADING', false)
        })
      },
      updateCatalogue: function (data) {
        this.$store.dispatch('uploadSchedules', data)
      },
      deleteSchedule () {
        return removeScheduleObject(this.selectedSchedule).then(response => {
          this.$store.commit('TOGGLE_SCHEDULE_OBJECT', 0)
          this.fetchData()
        }).catch(error => {
          console.log(error)
          this.isChanging = false
        })
      }
    },
    components: {
      ScheduleList,
      ModalRename
    },
    data () {
      return {
        newName: '',
        newSchedule: {
          pincode: 'asddsfdsf'
        },
        isChanging: false
      }
    }
  }
</script>

<style scoped>
#app input[type=text][readonly="readonly"].pincode {
  text-align: center;
  font-size: 36px!important;
  box-sizing: border-box!important;
  margin-bottom: 15px;
  border-bottom: 1px solid #000!important;
}
#app input[type=text][readonly="readonly"].pincode:focus {
  border-bottom: 1px solid #4aafb7!important;
}
#aboutSchedule p {
  font-size: 15px!important;
}
.getApp {
  border:1px solid #ccc;
  padding: 21px 5px;
  font-size: 17px;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 15px;
}
.getApp i{
  top: 3px;
}
</style>