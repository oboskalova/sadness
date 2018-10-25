<template>
  <b-modal
    v-model="active"
    @show="reset"
    @hide="closeModal"
    @ok="save"
    ok-title="Сохранить"
    cancel-title="Отмена"
    title="Настройки времени воспроизведения"
    size="lg"      
    centered>
    <div class="container timeliner">
      <b-form-group label="Продолжительность">
        <div class="row no-gutters align-items-center row-separated">
          <div class="col col-4">
            <b-form-checkbox
              class="t-vertical-item"
              v-model="timelineSettings.playUntilDone"
              @change="updateDurationProp">
              Играть до конца
            </b-form-checkbox>
          </div>
          <div v-if="!timelineSettings.playUntilDone" class="col col-auto">
            <b-form-input
              class="t-form-element t-element-small text-center"
              v-model="timelineSettings.duration"
              size="sm">
            </b-form-input>
          </div>
          <div v-if="!timelineSettings.playUntilDone" class="col">секунд</div>
        </div>
      </b-form-group>
      <div class="row no-gutters">
        <div class="col col-4">
          <div>Начало</div>
          <InputDate
            :opened="closeAnotherDatepicher"
            :date="timelineSettings.timeline.start"
            @update:date="validateStartDate" />
        </div>
        <div class="col col-4">
          <div>Окончание</div>
          <InputDate
            :opened="closeAnotherDatepicher"
            :date="timelineSettings.timeline.end"
            @update:date="validateEndDate" />
        </div>
      </div>
      <p class="message" v-if="errors.has('dateRange')">
        {{ errors.message('dateRange') }}
      </p>
      <div class="row no-gutters">
        <b-form-checkbox class="t-vertical-item" v-model="timelineSettings.timeline.allDay">Целый день</b-form-checkbox>
      </div>
      <div v-if="!timelineSettings.timeline.allDay" class="row no-gutters">
        <div class="col col-4">
          <InputTime
            :time="timelineSettings.timeline.start"
            @update:time="updateStartTime" />
        </div>
        <div class="col col-4">
          <InputTime
            :time="timelineSettings.timeline.end"
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
              v-model="timelineSettings.timeline.recurrenceType"
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
        <div v-if="timelineSettings.timeline.recurrenceType === 'Daily'" class="col-12">
          <b-form-group horizontal
            label="Каждый"
            :label-cols="2">
            <div class="row no-gutters align-items-center">
              <div class="col-auto">
                <b-form-input
                  class="t-form-element t-element-small text-center"
                  v-model="timelineSettings.recurrence.daily.recurrenceFrequency"
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
        <div v-else-if="timelineSettings.timeline.recurrenceType === 'Weekly'" class="col-12">
          <b-form-group horizontal
            label="Каждая"
            :label-cols="2">
            <div class="row no-gutters align-items-center">
              <div class="col-auto">
                <b-form-input
                  class="t-form-element t-element-small text-center"
                  v-model="timelineSettings.recurrence.weekly.recurrenceFrequency"
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
              <b-form-checkbox v-model="timelineSettings.recurrence.weekly.monday">
                Понедельник
              </b-form-checkbox>
            </div>
            <div>
              <b-form-checkbox v-model="timelineSettings.recurrence.weekly.tuesday">
                Вторник
              </b-form-checkbox>
            </div>
            <div>
              <b-form-checkbox v-model="timelineSettings.recurrence.weekly.wednesday">
                Среда
              </b-form-checkbox>
            </div>
            <div>
              <b-form-checkbox v-model="timelineSettings.recurrence.weekly.thursday">
                Четверг
              </b-form-checkbox>
            </div>
            <div>
              <b-form-checkbox v-model="timelineSettings.recurrence.weekly.friday">
                Пятница
              </b-form-checkbox>
            </div>
            <div>
              <b-form-checkbox v-model="timelineSettings.recurrence.weekly.saturday">
                Суббота
              </b-form-checkbox>
            </div>
            <div>
              <b-form-checkbox v-model="timelineSettings.recurrence.weekly.sunday">
                Воскресенье
              </b-form-checkbox>
            </div>
          </b-form-group>
        </div>
        <div v-else-if="timelineSettings.timeline.recurrenceType === 'Monthly'">
          <div class="row align-items-center">
            <div class="col">
              <b-form-radio-group v-model="timelineSettings.recurrence.monthly.recurrenceAbsolute" type="radio">
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
                  :disabled="!timelineSettings.recurrence.monthly.recurrenceAbsolute"
                  v-model="timelineSettings.recurrence.monthly.absolute.recurrenceDayOfMonth"
                  @input="validateAbsoluteMonthlyRecurrenceDayOfMonth"></b-form-input>
                <label class="t-form-element t-element-middle">число</label>
                <b-form-input
                  class="t-form-element t-element-small text-center"
                  :disabled="!timelineSettings.recurrence.monthly.recurrenceAbsolute"
                  v-model="timelineSettings.recurrence.monthly.absolute.recurrenceFrequency"
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
                  v-model="timelineSettings.recurrence.monthly.relative.recurrenceWeekOfMonth"
                  :disabled="timelineSettings.recurrence.monthly.recurrenceAbsolute"
                  :options="optionsWeek">
                </b-form-select>
                <b-form-select
                  class="t-form-element"
                  v-model="timelineSettings.recurrence.monthly.relative.recurrenceDayOfWeek"
                  :disabled="timelineSettings.recurrence.monthly.recurrenceAbsolute"
                  :options="optionsDays"
                  @input="updateOptionsWeek">
                </b-form-select>
                <label class="t-form-element t-element-middle">каждый(е)</label>
                <b-form-input
                  class="t-form-element t-element-small text-center"
                  :disabled="timelineSettings.recurrence.monthly.recurrenceAbsolute"
                  v-model="timelineSettings.recurrence.monthly.relative.recurrenceFrequency"
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
        <div v-else-if="timelineSettings.timeline.recurrenceType === 'Yearly'">
          <div class="row align-items-center">
            <div class="col">
              <b-form-radio-group v-model="timelineSettings.recurrence.yearly.recurrenceAbsolute" type="radio">
                <div class="t-vertical-item"><b-form-radio :value="true"></b-form-radio></div>
                <div class="t-vertical-item"><b-form-radio :value="false"></b-form-radio></div>
              </b-form-radio-group>
            </div>
            <div class="col col-auto">
              <b-form-group class="t-horizontal-group">
                <label class="t-form-element t-element-middle">Каждое</label>
                <b-form-input
                  class="t-form-element t-element-small text-center"
                  :disabled="!timelineSettings.recurrence.yearly.recurrenceAbsolute"
                  v-model="timelineSettings.recurrence.yearly.absolute.recurrenceDayOfMonth"
                  @input="validateAbsoluteYearlyRecurrenceDayOfMonth"></b-form-input>
                <b-form-select
                  class="t-form-element"
                  :value="timelineSettings.recurrence.yearly.absolute.recurrenceMonthOfYear"
                  :disabled="!timelineSettings.recurrence.yearly.recurrenceAbsolute"
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
                  v-model="timelineSettings.recurrence.yearly.relative.recurrenceWeekOfMonth"
                  :disabled="timelineSettings.recurrence.yearly.recurrenceAbsolute"
                  :options="optionsWeek">
                </b-form-select>
                <b-form-select
                  class="t-form-element"
                  v-model="timelineSettings.recurrence.yearly.relative.recurrenceDayOfWeek"
                  :disabled="timelineSettings.recurrence.yearly.recurrenceAbsolute"
                  :options="optionsDays"
                  @input="updateOptionsWeek">
                </b-form-select>
                <b-form-select
                  class="t-form-element"
                  v-model="timelineSettings.recurrence.yearly.relative.recurrenceMonthOfYear"
                  :disabled="timelineSettings.recurrence.yearly.recurrenceAbsolute"
                  :options="optionsMonth">
                </b-form-select>
              </b-form-group>
            </div>
          </div>
        </div>
      </div>
    </div>
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
import { cloneDeep } from 'lodash'

export default {
  name: 'modal-timeline-settings',
  props: ['timeline'],
  computed: {
    active: {
      get () {
        return this.$store.getters.timelineSettings
      },
      set (value) {
        this.$store.commit('TOGGLE_TIMELINE_SETTINGS', value)
      }
    }
  },
  components: {
    InputDate,
    InputTime
  },
  created () {
    this.errors = new ValidationError()
  },
  methods: {
    save () {
      this.$emit('changeTimeline', { new: this.timelineSettings, old: this.timelineOldSettings })
    },
    reset () {
      if (typeof this.timeline === 'string') {
        this.timelineSettings = JSON.parse(this.timeline)
        this.timelineOldSettings = JSON.parse(this.timeline)
      } else {
        this.timelineSettings = JSON.parse(JSON.stringify(this.timeline))
        this.timelineOldSettings = JSON.parse(JSON.stringify(this.timeline))
      }
      console.log(this.timelineSettings)
    },
    openModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', true)
      this.reset()
    },
    closeModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', false)
    },
    validateStartDate (value) {
      this.timelineSettings.timeline.start = value
      this.errors.pop('dateRange')
      if (!Validator.isBefore(value, this.timelineSettings.timeline.end)) {
        this.errors.push('dateRange', 'Дата начала должна предшествовать дате окончания')
      }
    },
    validateEndDate (value) {
      this.timelineSettings.timeline.end = value
      this.errors.pop('dateRange')
      if (!Validator.isBefore(this.timelineSettings.timeline.start, value)) {
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
      const month = this.timelineSettings.recurrence.yearly.absolute.recurrenceMonthOfYear
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
      this.timelineSettings.recurrence.yearly.absolute.recurrenceMonthOfYear = value
      this.validateAbsoluteYearlyRecurrenceDayOfMonth(this.timelineSettings.recurrence.yearly.absolute.recurrenceDayOfMonth)
    },
    updateDurationProp () {
      const id = this.changingMediaElementId
      const media = this.$store.getters.mediaElements.find(e => e.id === id)
      if (media) {
        this.timelineSettings.duration = +media.duration || 10
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
      const option = this.timelineSettings.recurrence[value]
      if (value === 'monthly' || value === 'yearly') {
        this.updateOptionsWeek(option.relative.recurrenceDayOfWeek)
      }
    }
  },
  data () {
    return {
      errors: {},
      datepickers: {},
      timelineOldSettings: {},
      optionsWeek: defaultWeekOptions,
      optionsDays: defaultWeekDaysOptions,
      optionsMonth: defaultMonthOptions,
      timelineSettings: cloneDeep(defaultTimeline)
    }
  }
}
</script>

<style scoped>
.t-vertical-item {
  margin: 1rem 0 !important;
}
.t-horizontal-group div {
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
}
.t-form-element {
  max-width: 200px !important;
  min-width: 200px !important;
  margin: 0 !important;
  margin-right: 1rem !important;
  font-size: 14px !important;
  display: inline !important;
  padding: 0;
}
.t-element-small {
  max-width: 60px !important;
  min-width: 60px !important;
}
.t-element-middle {
  max-width: 80px !important;
  min-width: 80px !important;
}
</style>
