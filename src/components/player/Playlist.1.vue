<template>
  <div class="playlist">
    <Media :options="activeElement" :id="this.$props.id" :next="next" :containerStyle="containerStyle"/>
  </div>
</template>

<script>
import Media from './Media'
import { cloneDeep } from 'lodash'
import { defaultTimeline } from '../../../helpers/defaults'

export default {
  name: 'playlist',
  props: ['list', 'random', 'id', 'containerStyle'],
  components: { Media },
  data () {
    return {
      next: null,
      timeId: null,
      nextElement: -1,
      activeElement: {},
      todayPlaylist: [],
      startOf: [],
      endOf: [],
      endOfTheCurrentTick: null,
      lastShownOrder: -1
    }
  },
  created () {
    this.activeElement.timeline = cloneDeep(defaultTimeline)
    this.activeElement.timeline.playUntilDone = false
    this.activeElement.timeline.duration = 0
    this.$props.list.forEach(e => {
      if (typeof e.timeline === 'string') {
        e.timeline = JSON.parse(e.timeline)
      }
    })
    this.makePlaylistHandler()
  },
  mounted () {
    // this.$root.$on('makeplaylist', this.makePlaylistHandler)
  },
  beforeDestroy () {
    console.log('стопэ')
    this.stopPlaying()
  },
  methods: {
    makePlaylistHandler () {
      this.stopPlaying()
      this.makeTodaysPlaylist()
      this.countStartsAndEnds()
      this.startPlaying()
    },
    makeTodaysPlaylist () {
      let today = new Date()
      let list = this.$props.list.filter(e => {
        const timeline = e.timeline
        return timeline ? this.needToPlay(today, timeline) : false
      })
      list.sort((a, b) => {
        let aStart = new Date(JSON.parse(a.timeline.timeline.start))
        let bStart = new Date(JSON.parse(b.timeline.timeline.start))
        aStart = this.setZero(aStart, ['monthDay', 'month', 'years'])
        bStart = this.setZero(bStart, ['monthDay', 'month', 'years'])
        if (a.timeline.timeline.allDay) {
          aStart = this.setZero(aStart, [
            'milliseconds',
            'seconds',
            'minutes',
            'hours'
          ])
        }
        if (b.timeline.timeline.allDay) {
          bStart = this.setZero(bStart, [
            'milliseconds',
            'seconds',
            'minutes',
            'hours'
          ])
        }
        return aStart - bStart
      })
      this.todayPlaylist = list
      console.log('list', list)
      this.lastShown = list.length - 1
    },
    startPlaying () {
      let now = new Date()
      let next = this.getNextTick(now)
      console.log(next)
      if (next) this.nextElement = next.element
      this.endOfTheCurrentTick = now
      this.startNextTickAfter(0)
    },
    stopPlaying () {
      clearTimeout(this.timeId)
    },
    getElementMayPlayNow () {
      let list = []
      const now = new Date()
      this.todayPlaylist.forEach((e, i) => {
        if ((now - this.startOf[i] > 0) && (this.endOf[i] - now > 0)) {
          list.push({ index: i, order: e.order })
        }
      })
      console.log(list)
      list.sort((a, b) => {
        return a.order - b.order
      })
      if (list.length > 0) {
        if (this.random) {
          return list[Math.floor(list.length * Math.random())].index
        } else {
          this.lastShownOrder = (this.lastShownOrder + 1) % list.length
          return list[this.lastShownOrder].index
        }
      }
      return -1
    },
    getNextTick (date) {
      date = new Date(date)
      /* for (let i = 0; i < this.todayPlaylist.length; ++i) {
        if (date < this.startOf[i]) {
          return {
            element: i,
            timeOut: this.startOf[i] - date
          }
        }
      } */
      let alternativeElement = this.getElementMayPlayNow()
      if (alternativeElement !== -1) {
        return {
          element: alternativeElement,
          timeOut: date - this.startOf[alternativeElement]
        }
      }
    },
    startNextTickAfter (ms) {
      this.stopPlaying()
      this.timeId = setTimeout(() => {
        if (!this.todayPlaylist.length) return
        const e = this.todayPlaylist[this.nextElement]
        if (e.type) {
          this.$emit('filler', false)
        } else {
          this.$emit('filler', true)
        }
        const t = this.getNextTick(this.endOfTheCurrentTick)
        console.log('out', t)
        const d = 1000 * e.timeline.duration
        this.activeElement = e
        var o = e.timeline.playUntilDone ? t.timeOut : d
        var date = new Date()
        var end = this.endOf[this.nextElement] - date
        // console.log('end', end)
        if (e.timeline.playUntilDone) {
          if (e.duration) {
            o = e.duration
          }
          if (o > end) {
            o = end
          }
        }
        this.endOfTheCurrentTick = +new Date() + o
        this.nextElement = t.element
        this.next = this.todayPlaylist[this.nextElement]
        // console.log('next elem', this.next)
        // console.log('now', e.name)
        // console.log('next', t.element)
        // console.log('next ms', o)
        this.startNextTickAfter(o)
      }, ms)
    },
    countStartsAndEnds () {
      const today = new Date()
      this.startOf = this.todayPlaylist.map(e => {
        const t = e.timeline
        let s = new Date(JSON.parse(t.timeline.start))
        s.setDate(today.getDate())
        s.setMonth(today.getMonth())
        s.setFullYear(today.getFullYear())
        if (t.timeline.allDay) {
          s = this.setZero(s, [
            'milliseconds',
            'seconds',
            'minutes',
            'hours'
          ])
        }
        return s
      })
      this.endOf = this.todayPlaylist.map(e => {
        const t = e.timeline
        let s = new Date(JSON.parse(t.timeline.end))
        s.setDate(today.getDate())
        s.setMonth(today.getMonth())
        s.setFullYear(today.getFullYear())
        if (t.timeline.allDay) {
          s.setDate(today.getDate() + 1)
          s = this.setZero(s, [
            'milliseconds',
            'seconds',
            'minutes',
            'hours'
          ])
        }
        return s
      })
      // console.log(this.endOf, this.startOf)
    },
    needToPlay (date, timeline) {
      date = new Date(date)
      const start = JSON.parse(timeline.timeline.start)
      const end = JSON.parse(timeline.timeline.end)
      const rt = timeline.timeline.recurrenceType.toLowerCase()
      const rs = timeline.recurrence[rt]
      let d = this.setZero(date, [
        'milliseconds',
        'seconds',
        'minutes',
        'hours'
      ])
      let s = this.setZero(start, [
        'milliseconds',
        'seconds',
        'minutes',
        'hours'
      ])
      if ((date < new Date(start)) && (date > new Date(end))) return false
      switch (rt) {
        case 'daily':
          const rf = +rs.recurrenceFrequency
          if (rf < -1) return false
          return ((d - s) / 86400000) % rf === 0
        case 'weekly':
          const day = [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday'
          ][date.getDay()]
          if (rs[day]) {
            const rf = +rs.recurrenceFrequency
            if (rf < -1) return false
            d = this.setZero(d, ['weekDay'])
            s = this.setZero(s, ['weekDay'])
            return ((d - s) / (7 * 86400000)) % rf === 0
          }
          return false
        case 'monthly':
          d = this.setZero(d, ['monthDay'])
          s = this.setZero(s, ['monthDay'])
          if (rs.recurrenceAbsolute) {
            const dm = +rs.absolute.recurrenceDayOfMonth
            const rf = +rs.absolute.recurrenceFrequency
            if (dm === date.getDate()) {
              if (rf === 0) return true
              return (12 * (new Date(d - s).getFullYear() - 1970) + new Date(d - s).getMonth()) % rf === 0
            }
            return false
          } else {
            const dw = (1 + rs.relative.recurrenceDayOfWeek) % 7
            const wm = +rs.relative.recurrenceWeekOfMonth
            const rf = +rs.relative.recurrenceFrequency
            if ((wm === Math.floor(date.getDate() / 7)) && (dw === date.getDay())) {
              if (rf === 0) return true
              return (12 * (new Date(d - s).getFullYear() - 1970) + new Date(d - s).getMonth()) % rf === 0
            }
            return false
          }
        case 'yearly':
          if (rs.recurrenceAbsolute) {
            const dm = +rs.absolute.recurrenceDayOfMonth
            const my = +rs.absolute.recurrenceMonthOfYear
            return (dm === date.getDate()) && (my === date.getMonth())
          } else {
            const dw = (1 + rs.relative.recurrenceDayOfWeek) % 7
            const wm = +rs.relative.recurrenceWeekOfMonth
            const my = +rs.relative.recurrenceMonthOfYear
            return (wm === Math.floor(date.getDate() / 7)) &&
              (dw === date.getDay()) &&
              (my === date.getMonth())
          }
      }
    },
    setZero (date, settings = []) {
      let d = new Date(date)
      settings.forEach(e => {
        const method = `set${e[0].toUpperCase() + e.substr(1)}`
        if (typeof d[method] === 'function') {
          d[method](0)
        } else if (e === 'weekDay') {
          d.setDate(d.getDate() - d.getDay() + 1)
        } else if (e === 'monthDay') {
          d.setDate(1)
        } else if (e === 'years') {
          d.setFullYear(1970)
        }
      })
      return d
    }
  }
}
</script>

<style scoped>
  .playlist {
    width: 100%;
    height: 100%;
    display: block;
    overflow: hidden;
    position: relative;
  }
</style>
