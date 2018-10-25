<template>
  <div class="container">
    <div class="date-range">
      <div class="row no-gutters">
        <div class="col col-5">
          <InputDate
            :opened="closeAnotherDatepicher"
            :date="start"
            @update:date="validateStartDate" />
        </div>
        <div class="col col-1 text-center">
          -
        </div>
        <div class="col col-5">
          <InputDate
            :opened="closeAnotherDatepicher"
            :date="end"
            @update:date="validateEndDate" />
        </div>
        <div class="col col-1">
        </div>
      </div>
      <p class="message" v-if="errors.has('dateRange')">
        {{ errors.message('dateRange') }}
      </p>
    </div>
    <h5>Выбор элемента</h5>
    <div class="line">
      <Dropdown
        v-if="false"
        type="radio"
        class="typeSelect"
        :options="typeList"
        @changed="updateType" />
      <div v-if="typeList[0].active" class="file-name">
        {{ selectedStatFile.name | truncate }}
      </div>
      <button
        class="btn btn-md btn-secondary"
        title="Выбрать файл"
        v-if="typeList[0].active"
        @click="selectFile">
        Выбрать файл
      </button>
    </div>
    <div v-if="selectedStatFile.id" @disabled="!filters.players" class="line">
      <div class="file-name players-select" @click="showSelection('schedules')" v-b-modal.selectDisplays>
        {{ textSchedules | truncate2 }}
        <div class="dropdown-icon">
          <i class="mi mi-keyboard-arrow-down mi-24"></i>
        </div>
      </div>
      <div class="file-name players-select" @click="showSelection('players')" v-b-modal.selectDisplays>
        {{ textPlayers | truncate2 }}
        <div class="dropdown-icon">
          <i class="mi mi-keyboard-arrow-down mi-24"></i>
        </div>
      </div>
      <div class="file-name players-select" @click="showSelection('templates')" v-b-modal.selectDisplays>
        {{ textTemplates | truncate2 }}
        <div class="dropdown-icon">
          <i class="mi mi-keyboard-arrow-down mi-24"></i>
        </div>
      </div>
    </div>
    <div v-if="empty">
      Нет данных для отображения
    </div>
    <div v-else>
      <div class="legend">Всего показов</div>
      <canvas ref="myChart" width="400" height="100"></canvas>
    </div>
    <ModalSelectStatMedia @updateChart="fetchFilters"/>
    <ModalDisplaysSearch v-if="filters.players" @updateChart="updateFilters" :mode="mode" :displays="modifyedFilters"/>
  </div>
</template>

<script>
  import Chart from 'chart.js'
  import Dropdown from '../common/DropdownCustom'
  import Validator from '../../../helpers/validator'
  import ValidationError from '../../../helpers/validation-error'
  import InputDate from '../common/InputDateShort'
  import ModalDisplaysSearch from './../modals/ModalStatSearch'
  import moment from 'moment'
  import {
    getShows,
    getFilters
  } from '../../../api/statistics'
  import ModalSelectStatMedia from '../modals/ModalSelectStatMedia'

  export default {
    name: 'statistics-shows',
    components: {
      InputDate,
      Dropdown,
      ModalSelectStatMedia,
      ModalDisplaysSearch
    },
    filters: {
      truncate (value) {
        value += ''
        const maxNameLength = 30
        if (value.length > maxNameLength) {
          return value.substr(0, maxNameLength) + ' ...'
        }
        if (value === 'undefined') {
          return ''
        } else {
          return value
        }
      },
      truncate2 (value) {
        value += ''
        const maxNameLength = 23
        if (value.length > maxNameLength) {
          return value.substr(0, maxNameLength) + ' ...'
        }
        if (value === 'undefined') {
          return ''
        } else {
          return value
        }
      }
    },
    watch: {
      errors (v) {
        console.log(v)
      },
      start (v) {
        this.makeChart()
      },
      end (v) {
        this.makeChart()
      }
    },
    data () {
      return {
        mode: 'players',
        typeList: [
          {
            id: 1,
            text: 'Файл',
            active: true
          },
          {
            id: 2,
            text: 'Элемент шаблона',
            active: false
          }
        ],
        myChart: null,
        page: 'Shows',
        start: '"2018-08-22"',
        end: '"2018-08-28"',
        errors: {},
        mytension: 0,
        datepickers: {},
        chartData: {
          labels: [],
          data: []
        },
        empty: true,
        filters: {},
        maxVal: 0
      }
    },
    created () {
      this.errors = new ValidationError()
    },
    mounted () {
      this.start = '"' + moment().subtract(4, 'days').format('YYYY-MM-DD') + '"'
      this.end = '"' + moment().format('YYYY-MM-DD') + '"'
      // this.fetchData()
    },
    beforeDestroy () {
      this.$store.commit('SELECT_STAT_FILE', {})
    },
    computed: {
      modifyedFilters () {
        return this.filters[this.mode].filter(el => el.show)
      },
      textPlayers () {
        var array = this.$store.getters.selectedStatDisplays
        if (array.length === 0) return 'Выберите плееры'
        if (array.length === 1) return array[0].name
        if (array.length > 1) return 'Выбрано плееров: ' + array.length
      },
      textSchedules () {
        var array = this.$store.getters.selectedStatSchedules
        if (array.length === 0) return 'Выберите расписания'
        if (array.length === 1) return array[0].name
        if (array.length > 1) return 'Выбрано расписаний: ' + array.length
      },
      textTemplates () {
        var array = this.$store.getters.selectedStatTemplates
        if (array.length === 0) return 'Выберите шаблоны'
        if (array.length === 1) return array[0].name
        if (array.length > 1) return 'Выбрано шаблонов: ' + array.length
      },
      selectedPlayers () {
        return this.$store.getters.selectedStatDisplays
      },
      selectedSchedules () {
        return this.$store.getters.selectedStatSchedules
      },
      selectedStatFile () {
        return this.$store.getters.selectedStatFile
      },
      selectedTemplates () {
        return this.$store.getters.selectedStatTemplates
      }
    },
    methods: {
      updateFilters () {
        console.log('updating selecting')
        for (let h in this.filters) {
          this.filters[h].forEach((el) => {
            el.show = true
          })
        }
        if (this.selectedSchedules[0]) {
          let schedulesArr = []
          let tempatesArr = []
          this.selectedSchedules.forEach((el) => {
            schedulesArr.push(el.id)
          })
          this.filters.playlists.forEach((el) => {
            if (schedulesArr.includes(el.schedule_id)) {
              tempatesArr.push(el.template_id)
            }
          })
          this.filters.players.forEach((ell) => {
            if (!schedulesArr.includes(ell.schedule)) {
              ell.show = false
            }
          })
          this.filters.templates.forEach((ell) => {
            if (!tempatesArr.includes(ell.id)) {
              ell.show = false
            }
          })
        }
        if (this.selectedPlayers[0]) {
          let schedulesArr = []
          let tempatesArr = []
          this.selectedPlayers.forEach((el) => {
            schedulesArr.push(el.schedule)
          })
          this.filters.playlists.forEach((el) => {
            if (schedulesArr.includes(el.schedule_id)) {
              tempatesArr.push(el.template_id)
            }
          })
          this.filters.schedules.forEach((ell) => {
            if (!schedulesArr.includes(ell.id)) {
              ell.show = false
            }
          })
          this.filters.templates.forEach((ell) => {
            if (!tempatesArr.includes(ell.id)) {
              ell.show = false
            }
          })
        }
        if (this.selectedTemplates[0]) {
          let schedulesArr = []
          let tempatesArr = []
          this.selectedTemplates.forEach((el) => {
            tempatesArr.push(el.id)
          })
          this.filters.playlists.forEach((el) => {
            if (tempatesArr.includes(el.template_id)) {
              schedulesArr.push(el.schedule_id)
            }
          })
          this.filters.schedules.forEach((ell) => {
            if (!schedulesArr.includes(ell.id)) {
              ell.show = false
            }
          })
          this.filters.players.forEach((ell) => {
            if (!schedulesArr.includes(ell.schedule)) {
              ell.show = false
            }
          })
        }
        this.fetchData()
      },
      showSelection (v) {
        this.mode = v
        this.$store.commit('TOGGLE_STAT_SEARCH', true)
      },
      fetchFilters () {
        return getFilters(this.selectedStatFile.id).then(response => {
          const data = response.data
          if (!data) return
          this.filters = data
          for (let h in this.filters) {
            this.filters[h].forEach((el) => {
              el.show = true
            })
          }
          console.log(data)
          this.fetchData()
        }).catch(error => {
          console.log(error)
        })
      },
      selectFile () {
        this.$store.commit('TOGGLE_SELECT_STAT_MEDIA', true)
      },
      updateType () {

      },
      resetChart () {
        this.chartData = {
          labels: [],
          data: []
        }
        this.myChart.destroy()
      },
      fetchData () {
        if (this.myChart) this.resetChart()
        if (this.typeList[0].active) {
          if (!this.selectedStatFile.id) {
            this.empty = true
            return
          }
        }
        var options = {}
        if (this.selectedStatFile) {
          options['file'] = this.selectedStatFile.id
        }
        if (this.selectedPlayers[0]) {
          var arrPlayers = []
          this.selectedPlayers.forEach((el) => {
            arrPlayers.push(el.id)
          })
          options['players'] = arrPlayers
        }
        if (this.selectedSchedules[0]) {
          var arrSchedules = []
          this.selectedSchedules.forEach((el) => {
            arrSchedules.push(el.id)
          })
          options['schedules'] = arrSchedules
        }
        if (this.selectedTemplates[0]) {
          var arrTemplates = []
          this.selectedTemplates.forEach((el) => {
            arrTemplates.push(el.id)
          })
          options['templates'] = arrTemplates
        }
        options['start'] = moment(this.start.slice(1, -1)).format('YYYY-MM-DD')
        options['end'] = moment(this.end.slice(1, -1)).format('YYYY-MM-DD')
        return getShows(options).then(response => {
          const data = response.data
          if (!data) return
          console.log(data)
          this.maxVal = 0
          var arrays = {}
          const start = options['start']
          const end = options['end']
          var j = 0
          var filler = () => {
            var dater = moment(start).add(j, 'days').format('YYYY-MM-DD').toString()
            console.log(dater)
            arrays[dater] = 0
            if (dater !== end) {
              if (j < 300) {
                j++
                filler()
              }
            }
          }
          filler()

          data.forEach(element => {
            arrays[element.date.split(' ')[0]] = arrays[element.date.split(' ')[0]] + element.num
            if (this.maxVal < arrays[element.date.split(' ')[0]]) this.maxVal = arrays[element.date.split(' ')[0]]
          })
          Object.keys(arrays).forEach(i => {
            this.chartData.labels.push(i)
            this.chartData.data.push(arrays[i])
          })
          if (!data[0]) {
            this.empty = true
          } else {
            this.empty = false
          }
          console.log(this.empty)
          this.$nextTick(() => {
            this.makeChart()
          })
        }).catch(error => {
          console.log(error)
        })
      },
      closeAnotherDatepicher (context) {
        this.datepickers[context._uid] = context
        for (let uid in this.datepickers) {
          if (this.datepickers.hasOwnProperty(uid)) {
            const d = this.datepickers[uid]
            if (context._uid !== +uid) d.closeDatepicker()
          }
        }
      },
      validateStartDate (value) {
        this.start = value
        this.errors.pop('dateRange')
        if (!Validator.isBefore(value, this.end)) {
          this.errors.push('dateRange', 'Дата начала должна предшествовать дате окончания')
          this.empty = true
        } else {
          this.empty = false
          this.fetchData()
        }
      },
      validateEndDate (value) {
        this.end = value
        this.errors.pop('dateRange')
        if (!Validator.isBefore(this.start, value)) {
          this.errors.push('dateRange', 'Дата начала должна предшествовать дате окончания')
          this.empty = true
        } else {
          this.empty = false
          this.fetchData()
        }
      },
      makeChart () {
        if (this.errors.has('dateRange')) return
        if (this.empty) return
        var ctx = this.$refs.myChart
        if (this.maxVal > 10) {
          this.myChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: this.chartData.labels,
              datasets: [{
                data: this.chartData.data,
                lineTension: 0,
                pointBackgroundColor: '#00b0b7',
                pointRadius: 0.1,
                fill: false,
                borderColor: '#00b0b7',
                borderWidth: 2
              }]
            },
            options: {
              legend: {
                display: false
              },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          })
        } else {
          this.myChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: this.chartData.labels,
              datasets: [{
                data: this.chartData.data,
                lineTension: 0,
                pointBackgroundColor: '#00b0b7',
                pointRadius: 0.1,
                fill: false,
                borderColor: '#00b0b7',
                borderWidth: 2
              }]
            },
            options: {
              legend: {
                display: false
              },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    stepSize: 1
                  }
                }]
              }
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .legend {
    margin-bottom: 10px; 
  }
  .legend::before{
    float: left;
    margin-top: 5px;
    margin-right: 5px;
    content: '';
    width: 10px;
    height: 10px;
    display: block;
    background: #00b0b7;
    border-radius: 5px;
  }
  .typeSelect {
    width: 160px;
    margin: 0!important;
    margin-right: 10px!important;
    display: inline-block;
  }
  .container {
    margin-top: 1em;
  }
  .date-range {
    float: right;
    width: 325px;
    height:100px;
  }
  .date-range .text-center {
    padding-top: 10px;
  }
  .line {
    height: 70px;
  }
  .file-name {
    float: left;
    height: 40px;
    margin-top: 5px;
    width: 300px;
    margin-right: 10px;
    border-bottom: 1px solid #bdbdbd !important;
    padding: 9px 0px!important;
  }
  .dropdown-icon {
    float: right;
  }
  .players-select {
    width: 200px;
    cursor: pointer;
  }
</style>