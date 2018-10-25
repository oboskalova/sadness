<template>
  <b-modal centered
    @show="openModal"
    @hide="closeModal"
    v-model="active"
    title="Добавить элемент плейлиста" 
    cancel-title="Отмена"
    size="lg"
    :hide-footer="isChanging"
    @cancel="clearQuery"
    @ok="addItem">    
    <p>Название элемента</p>
    <b-form-input
      ref="name"
      type="text"
      :disabled="isChanging"
      v-model="itemSelection.name" />
    <p>Шаблон: <a href="#">{{ itemSelection.template.name }}</a> </p>
    <b-form-checkbox
      class="t-vertical-item"
      v-model="allday">
        Играть всё время
    </b-form-checkbox>
    <div v-show="!allday" class="timel">
      <b-form-group label="Продолжительность">
        <div class="row no-gutters align-items-center row-separated">
          <div class="col col-4">
            <b-form-checkbox
              class="t-vertical-item"
              v-model="itemSelection.timeline.playUntilDone"
              @change="updateDurationProp">
              Играть до конца
            </b-form-checkbox>
          </div>
          <div v-if="!itemSelection.timeline.playUntilDone" class="col col-auto">
            <b-form-input
              class="t-form-element t-element-small text-center"
              v-model="itemSelection.timeline.duration"
              size="sm">
            </b-form-input>
          </div>
          <div v-if="!itemSelection.timeline.playUntilDone" class="col">секунд</div>
        </div>
      </b-form-group>
      <div class="row no-gutters">
        <div class="col col-4">
          <div>Начало</div>
          <InputDate
            :opened="closeAnotherDatepicher"
            :date="itemSelection.timeline.timeline.start"
            @update:date="validateStartDate" />
        </div>
        <div class="col col-4">
          <div>Окончание</div>
          <InputDate
            :opened="closeAnotherDatepicher"
            :date="itemSelection.timeline.timeline.end"
            @update:date="validateEndDate" />
        </div>
      </div>
      <p class="message" v-if="errors.has('dateRange')">
        {{ errors.message('dateRange') }}
      </p>
      <div class="row no-gutters">
        <b-form-checkbox class="t-vertical-item" v-model="itemSelection.timeline.timeline.allDay">Целый день</b-form-checkbox>
      </div>
      <div v-if="!itemSelection.timeline.timeline.allDay" class="row no-gutters">
        <div class="col col-4">
          <InputTime
            :time="itemSelection.timeline.timeline.start"
            @update:time="updateStartTime" />
        </div>
        <div class="col col-4">
          <InputTime
            :time="itemSelection.timeline.timeline.end"
            @update:time="updateEndTime" />
        </div>
      </div>
      <div class="row no-gutters">
        <div>
          <b-form-group label="Периодичность">
            <b-form-radio-group
              id="Daily"
              type="radio"
              name="recurrenceType"
              class="t-vertical-item"
              v-model="itemSelection.timeline.timeline.recurrenceType"
              @input="updateSyntax">
              <b-form-radio value="Daily">Ежедневно</b-form-radio>
              <b-form-radio value="Weekly">Еженедельно</b-form-radio>
              <b-form-radio value="Monthly">Ежемесячно</b-form-radio>
              <b-form-radio value="Yearly">Ежегодно</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </div>
      </div>
      <div class="row no-gutters">
        <div v-if="itemSelection.timeline.timeline.recurrenceType === 'Daily'" class="col-12">
          <b-form-group horizontal
            label="Каждый"
            :label-cols="2">
            <div class="row no-gutters align-items-center">
              <div class="col-auto">
                <b-form-input
                  class="t-form-element t-element-small text-center"
                  v-model="itemSelection.timeline.recurrence.daily.recurrenceFrequency"
                  @input="validateDailyRecurrenceFrequency"
                  size="sm">
                </b-form-input>
              </div>
              <legend class="col-auto col-form-legend">-й день</legend>
            </div>
          </b-form-group>
          <p class="message" v-if="errors.has('dailyRecurrenceFrequency')">
            {{ errors.message('dailyRecurrenceFrequency') }}
          </p>
        </div>
        <div v-else-if="itemSelection.timeline.timeline.recurrenceType === 'Weekly'" class="col-12">
          <b-form-group horizontal
            label="Каждая"
            :label-cols="2">
            <div class="row no-gutters align-items-center">
              <div class="col-auto">
                <b-form-input
                  class="t-form-element t-element-small text-center"
                  v-model="itemSelection.timeline.recurrence.weekly.recurrenceFrequency"
                  @input="validateWeeklyRecurrenceFrequency"
                  size="sm">
                </b-form-input>
              </div>
              <legend class="col-auto col-form-legend">-я неделя</legend>
            </div>
          </b-form-group>
          <p class="message" v-if="errors.has('weeklyRecurrenceFrequency')">
            {{ errors.message('weeklyRecurrenceFrequency') }}
          </p>
          <b-form-group>
            <div>
              <b-form-checkbox v-model="itemSelection.timeline.recurrence.weekly.monday">
                Понедельник
              </b-form-checkbox>
            </div>
            <div>
              <b-form-checkbox v-model="itemSelection.timeline.recurrence.weekly.tuesday">
                Вторник
              </b-form-checkbox>
            </div>
            <div>
              <b-form-checkbox v-model="itemSelection.timeline.recurrence.weekly.wednesday">
                Среда
              </b-form-checkbox>
            </div>
            <div>
              <b-form-checkbox v-model="itemSelection.timeline.recurrence.weekly.thursday">
                Четверг
              </b-form-checkbox>
            </div>
            <div>
              <b-form-checkbox v-model="itemSelection.timeline.recurrence.weekly.friday">
                Пятница
              </b-form-checkbox>
            </div>
            <div>
              <b-form-checkbox v-model="itemSelection.timeline.recurrence.weekly.saturday">
                Суббота
              </b-form-checkbox>
            </div>
            <div>
              <b-form-checkbox v-model="itemSelection.timeline.recurrence.weekly.sunday">
                Воскресенье
              </b-form-checkbox>
            </div>
          </b-form-group>
        </div>
        <div v-else-if="itemSelection.timeline.timeline.recurrenceType === 'Monthly'">
          <div class="row align-items-center">
            <div class="col">
              <b-form-radio-group v-model="itemSelection.timeline.recurrence.monthly.recurrenceAbsolute" type="radio">
                <div class="t-vertical-item">
                  <b-form-radio :value="true"></b-form-radio>
                </div>
                <div class="t-vertical-item">
                  <b-form-radio :value="false"></b-form-radio>
                </div>
              </b-form-radio-group>
            </div>
            <div class="col col-auto">
              <b-form-group class="t-horizontal-group">
                <label class="t-form-element t-element-middle">Каждое</label>
                <b-form-input
                  class="t-form-element t-element-small text-center"
                  :disabled="!itemSelection.timeline.recurrence.monthly.recurrenceAbsolute"
                  v-model="itemSelection.timeline.recurrence.monthly.absolute.recurrenceDayOfMonth"
                  @input="validateAbsoluteMonthlyRecurrenceDayOfMonth"></b-form-input>
                <label class="t-form-element t-element-middle">число</label>
                <b-form-input
                  class="t-form-element t-element-small text-center"
                  :disabled="!itemSelection.timeline.recurrence.monthly.recurrenceAbsolute"
                  v-model="itemSelection.timeline.recurrence.monthly.absolute.recurrenceFrequency"
                  @input="validateAbsoluteMonthlyRecurrenceFrequency"></b-form-input>
                месяц(а)
              </b-form-group>
              <p class="message" v-if="errors.has('absoluteMonthlyRecurrenceDayOfMonth')">
                {{ errors.message('absoluteMonthlyRecurrenceDayOfMonth') }}
              </p>
              <p class="message" v-if="errors.has('absoluteMonthlyRecurrenceFrequency')">
                {{ errors.message('absoluteMonthlyRecurrenceFrequency') }}
              </p>
              <b-form-group class="t-horizontal-group">
                <b-form-select
                  class="t-form-element"
                  v-model="itemSelection.timeline.recurrence.monthly.relative.recurrenceWeekOfMonth"
                  :disabled="itemSelection.timeline.recurrence.monthly.recurrenceAbsolute"
                  :options="optionsWeek">
                </b-form-select>
                <b-form-select
                  class="t-form-element"
                  v-model="itemSelection.timeline.recurrence.monthly.relative.recurrenceDayOfWeek"
                  :disabled="itemSelection.timeline.recurrence.monthly.recurrenceAbsolute"
                  :options="optionsDays"
                  @input="updateOptionsWeek">
                </b-form-select>
                <label class="t-form-element t-element-middle">каждый(е)</label>
                <b-form-input
                  class="t-form-element t-element-small text-center"
                  :disabled="itemSelection.timeline.recurrence.monthly.recurrenceAbsolute"
                  v-model="itemSelection.timeline.recurrence.monthly.relative.recurrenceFrequency"
                  @input="validateRelativeMonthlyRecurrenceFrequency">
                </b-form-input>
                месяц(а)
              </b-form-group>
              <p class="message" v-if="errors.has('relativeMonthlyRecurrenceFrequency')">
                {{ errors.message('relativeMonthlyRecurrenceFrequency') }}
              </p>
            </div>
          </div>
        </div>
        <div v-else-if="itemSelection.timeline.timeline.recurrenceType === 'Yearly'">
          <div class="row align-items-center">
            <div class="col">
              <b-form-radio-group v-model="itemSelection.timeline.recurrence.yearly.recurrenceAbsolute" type="radio">
                <div class="t-vertical-item"><b-form-radio :value="true"></b-form-radio></div>
                <div class="t-vertical-item"><b-form-radio :value="false"></b-form-radio></div>
              </b-form-radio-group>
            </div>
            <div class="col col-auto">
              <b-form-group class="t-horizontal-group">
                <label class="t-form-element t-element-middle">Каждое</label>
                <b-form-input
                  class="t-form-element t-element-small text-center"
                  :disabled="!itemSelection.timeline.recurrence.yearly.recurrenceAbsolute"
                  v-model="itemSelection.timeline.recurrence.yearly.absolute.recurrenceDayOfMonth"
                  @input="validateAbsoluteYearlyRecurrenceDayOfMonth"></b-form-input>
                <b-form-select
                  class="t-form-element"
                  :value="itemSelection.timeline.recurrence.yearly.absolute.recurrenceMonthOfYear"
                  :disabled="!itemSelection.timeline.recurrence.yearly.recurrenceAbsolute"
                  :options="optionsMonth"
                  @input="validateAbsoluteYearlyRecurrenceMonthOfYear">
                </b-form-select>
              </b-form-group>
              <p class="message" v-if="errors.has('absoluteYearlyRecurrenceDayOfMonth')">
                {{ errors.message('absoluteYearlyRecurrenceDayOfMonth') }}
              </p>
              <b-form-group class="t-horizontal-group">
                <b-form-select
                  class="t-form-element"
                  v-model="itemSelection.timeline.recurrence.yearly.relative.recurrenceWeekOfMonth"
                  :disabled="itemSelection.timeline.recurrence.yearly.recurrenceAbsolute"
                  :options="optionsWeek">
                </b-form-select>
                <b-form-select
                  class="t-form-element"
                  v-model="itemSelection.timeline.recurrence.yearly.relative.recurrenceDayOfWeek"
                  :disabled="itemSelection.timeline.recurrence.yearly.recurrenceAbsolute"
                  :options="optionsDays"
                  @input="updateOptionsWeek">
                </b-form-select>
                <b-form-select
                  class="t-form-element"
                  v-model="itemSelection.timeline.recurrence.yearly.relative.recurrenceMonthOfYear"
                  :disabled="itemSelection.timeline.recurrence.yearly.recurrenceAbsolute"
                  :options="optionsMonth">
                </b-form-select>
              </b-form-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <img
      v-if="isChanging"
      src="/static/img/spinner.gif"
      class="loader">
  </b-modal>
</template>

<script>
import InputDate from '../common/InputDate'
import InputTime from '../common/InputTime'
import Validator from '../../../helpers/validator'
import ValidationError from '../../../helpers/validation-error'
import {
  defaultTimeline,
  defaultWeekOptions,
  defaultWeekDaysOptions,
  defaultMonthOptions
} from '../../../helpers/defaults'
import { getTemplateObjects } from '../../../api/template-editor'
import { cloneDeep } from 'lodash'

export default {
  name: 'modal-search-displays',
  components: {
    InputDate,
    InputTime
  },
  computed: {
    active: {
      get () {
        if (this.$store.getters.currentTemplateId) {
          this.$store.getters.editorCatalogue.forEach(item => {
            if (item.id === this.$store.getters.currentTemplateId) {
              this.itemSelection.template = item
              this.itemSelection.name = item.name
            }
          })
        }
        return this.$store.getters.createPlaylistItem
      },
      set (value) {
        this.$store.commit('TOGGLE_CREATE_PLAYLIST_ITEM', value)
      }
    }
  },
  created () {
    this.fetchData()
    this.errors = new ValidationError()
  },
  methods: {
    openModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', true)
    },
    closeModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', false)
    },
    addItem () {
      const data = {}
      const order = this.$store.getters.currentSchedule.playlist.length
      data.id = Math.floor(Math.random() * (1000 - 1)) + 1
      data.name = this.itemSelection.name
      data.timeline = this.itemSelection.timeline
      data.template = this.itemSelection.template.id
      data.order = order
      this.$store.commit('ADD_PLAYLIST_ITEM', data)
      this.itemSelection = {
        name: '',
        timeline: cloneDeep(defaultTimeline),
        template: {
          name: ''
        },
        order: 0
      }
    },
    changeTimeline (data) {
      this.itemSelection.timeline = data
    },
    clearQuery () {
      this.query = ''
    },
    selectTemplate (id) {
      this.$store.commit('SELECT_TEMPLATE_ITEM', id)
      this.$refs.createPlaylistItem.show()
    },
    fetchData: function () {
      this.isLoading = true
      this.$store.commit('TOGGLE_TEMPLATE_OBJECT', {})
      return getTemplateObjects().then(response => {
        const data = response.data
        if (!data) return
        this.$store.dispatch('uploadTemplates', data)
        this.isLoading = false
        this.changedColor = false
      })
    },
    validateStartDate (value) {
      this.itemSelection.timeline.timeline.start = value
      this.errors.pop('dateRange')
      if (!Validator.isBefore(value, this.itemSelection.timeline.timeline.end)) {
        this.errors.push('dateRange', 'Дата начала должна предшествовать дате окончания')
      }
    },
    validateEndDate (value) {
      this.itemSelection.timeline.timeline.end = value
      this.errors.pop('dateRange')
      if (!Validator.isBefore(this.itemSelection.timeline.timeline.start, value)) {
        this.errors.push('dateRange', 'Дата начала должна предшествовать дате окончания')
      }
    },
    validateDailyRecurrenceFrequency (value) {
      const v = Validator.positiveNumber(value)
      this.errors.pop('dailyRecurrenceFrequency')
      if (!v.status) {
        this.errors.push('dailyRecurrenceFrequency', v.message)
      }
    },
    validateWeeklyRecurrenceFrequency (value) {
      const v = Validator.positiveNumber(value)
      this.errors.pop('weeklyRecurrenceFrequency')
      if (!v.status) {
        this.errors.push('weeklyRecurrenceFrequency', v.message)
      }
    },
    validateAbsoluteMonthlyRecurrenceDayOfMonth (value) {
      const v = Validator.withinMonth(value)
      this.errors.pop('absoluteMonthlyRecurrenceDayOfMonth')
      if (!v.status) {
        this.errors.push('absoluteMonthlyRecurrenceDayOfMonth', v.message)
      }
    },
    validateAbsoluteYearlyRecurrenceDayOfMonth (value) {
      const month = this.itemSelection.timeline.recurrence.yearly.absolute.recurrenceMonthOfYear
      const v = Validator.withinMonth(value, month)
      this.errors.pop('absoluteYearlyRecurrenceDayOfMonth')
      if (!v.status) {
        this.errors.push('absoluteYearlyRecurrenceDayOfMonth', v.message)
      }
    },
    validateAbsoluteMonthlyRecurrenceFrequency (value) {
      const v = Validator.positiveNumber(value)
      this.errors.pop('absoluteMonthlyRecurrenceFrequency')
      if (!v.status) {
        this.errors.push('absoluteMonthlyRecurrenceFrequency', v.message)
      }
    },
    validateRelativeMonthlyRecurrenceFrequency (value) {
      const v = Validator.positiveNumber(value)
      this.errors.pop('relativeMonthlyRecurrenceFrequency')
      if (!v.status) {
        this.errors.push('relativeMonthlyRecurrenceFrequency', v.message)
      }
    },
    validateAbsoluteYearlyRecurrenceMonthOfYear (value) {
      this.itemSelection.timeline.recurrence.yearly.absolute.recurrenceMonthOfYear = value
      this.validateAbsoluteYearlyRecurrenceDayOfMonth(this.itemSelection.timeline.recurrence.yearly.absolute.recurrenceDayOfMonth)
    },
    updateDurationProp () {
      const id = this.changingMediaElementId
      const media = this.$store.getters.mediaElements.find(e => e.id === id)
      if (media) {
        this.itemSelection.timeline.duration = +media.duration || 10
      }
    },
    updateStartTime (value) {
      this.validateStartDate(value)
      this.$store.commit('UPDATE_START_TIME', value)
    },
    updateEndTime (value) {
      this.validateEndDate(value)
      this.$store.commit('UPDATE_END_TIME', value)
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
    updateOptionsWeek (value) {
      const n = [0, 0, 1, 0, 1, 1, 2][value]
      this.optionsWeek.forEach(e => {
        e.text = e.root + e.ending[n]
      })
    },
    updateSyntax (value) {
      value = value.toLowerCase()
      const option = this.itemSelection.timeline.recurrence[value]
      if (value === 'monthly' || value === 'yearly') {
        this.updateOptionsWeek(option.relative.recurrenceDayOfWeek)
      }
    }
  },
  data () {
    return {
      errors: {},
      allday: true,
      datepickers: {},
      optionsWeek: defaultWeekOptions,
      optionsDays: defaultWeekDaysOptions,
      optionsMonth: defaultMonthOptions,
      itemSelection: {
        name: '',
        timeline: cloneDeep(defaultTimeline),
        template: {
          name: ''
        },
        order: 0
      },
      isChanging: false
    }
  }
}
</script>

<style scoped>
.search-display-wrap {
    margin-top: 10px;
    margin-bottom: 10px;
    color: rgba(11, 195, 203, 1);
    position: relative;
}
  .search-display-icon {
    top: 50%;
    left: 11px;
    position: absolute;
    font-size: 18px;
    transform: translateY(-50%);
  }
  .search-display-input {
    width: 100%;
    height: 32px;
    padding: 0 80px 0 38px;
    border: 1px solid rgba(11, 195, 203, 1);
    border-radius: 20px;
    outline: none;
  }
  .search-display-clear {
    top: 50%;
    right: 12px;
    cursor: pointer;
    border: none;
    color: inherit;
    background: none;
    position: absolute;
    transform: translateY(-50%);
  }
  .bounded {
  margin: 1rem 0;
  max-height: 160px;
  overflow-y: auto;
}
.header {
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
input {
  padding: 0;
}
.timel input {
  margin-bottom: 0rem;
}
</style>