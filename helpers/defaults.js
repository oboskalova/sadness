export const alertDefaults = {
  type: 'danger',
  messageType: 'unrecognized'
}

export const defaultTemplate = {
  name: 'Новый шаблон',
  width: 1920,
  height: 1080,
  status: false,
  orientation: 0,
  tags: '[]',
  tagsArray: []
}

export const defaultColors = {
  hex: '#194d33',
  hsl: {
    h: 150,
    s: 0.5,
    l: 0.2,
    a: 1
  },
  hsv: {
    h: 150,
    s: 0.66,
    v: 0.30,
    a: 1
  },
  rgba: {
    r: 25,
    g: 77,
    b: 51,
    a: 1
  },
  a: 1
}

var now = new Date()
var date ='-' + (now.getUTCMonth() + 1).toString().replace( /^([0-9])$/, '0$1' ) + '-' + now.getUTCDate().toString().replace( /^([0-9])$/, '0$1' )

export const defaultTimeline = {
  playUntilDone: true,
  duration: 10,
  timeline: {
    allDay: true,
    recurrenceType: 'Daily',
    start: '"'+ now.getFullYear().toString() + date + 'T07:00:00.000Z"',
    end: '"'+ (now.getFullYear() + 10).toString() + date + 'T19:00:00.000Z"'
  },
  recurrence: {
    daily: {
      recurrenceFrequency: 1
    },
    weekly: {
      recurrenceFrequency: 1,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    },
    monthly: {
      recurrenceAbsolute: true,
      absolute: {
        recurrenceDayOfMonth: 1,
        recurrenceFrequency: 1
      },
      relative: {
        recurrenceWeekOfMonth: 0,
        recurrenceDayOfWeek: 0,
        recurrenceFrequency: 1
      }
    },
    yearly: {
      recurrenceAbsolute: true,
      absolute: {
        recurrenceMonthOfYear: 0,
        recurrenceDayOfMonth: 1
      },
      relative: {
        recurrenceWeekOfMonth: 0,
        recurrenceDayOfWeek: 0,
        recurrenceMonthOfYear: 0
      }
    }
  }
}

export const defaultMonthOptions = [
  { value: 0, text: 'Января' },
  { value: 1, text: 'Февраля' },
  { value: 2, text: 'Марта' },
  { value: 3, text: 'Апреля' },
  { value: 4, text: 'Мая' },
  { value: 5, text: 'Июня' },
  { value: 6, text: 'Июля' },
  { value: 7, text: 'Августа' },
  { value: 8, text: 'Сентября' },
  { value: 9, text: 'Октября' },
  { value: 10, text: 'Ноября' },
  { value: 11, text: 'Декабря' }
]

export const defaultWeekDaysOptions = [
  { value: 0, text: 'Понедельник' },
  { value: 1, text: 'Вторник' },
  { value: 2, text: 'Среда' },
  { value: 3, text: 'Четверг' },
  { value: 4, text: 'Пятница' },
  { value: 5, text: 'Суббота' },
  { value: 6, text: 'Воскресенье' }
]

export const defaultWeekOptions = [
  { value: 0, text: '', root: 'Перв', ending: ['ый', 'ая', 'ое'] },
  { value: 1, text: '', root: 'Втор', ending: ['ой', 'ая', 'ое'] },
  { value: 2, text: '', root: 'Трет', ending: ['ий', 'ья', 'ье'] },
  { value: 3, text: '', root: 'Четверт', ending: ['ый', 'ая', 'ое'] },
  { value: 4, text: '', root: 'Последн', ending: ['ий', 'яя', 'ее'] }
]

export const defaultAssignment = {
  id: null,
  user_id: null,
  template_id: null,
  edit_props: false,
  delegate: false,
  containers: []
}

export const defaultAction = {
  click: {
    target: null,
    active: false
  },
  timeout: {
    target: null,
    active: false,
    ms: 0
  }
}
