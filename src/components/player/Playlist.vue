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
      activeIndex: -1,
      activeElement: {},
      todayPlaylist: [],
      startOf: [],
      endOf: [],
      possible: -1,
      endOfTheCurrentTick: null,
      lastShownOrder: -1,
      started: null,
      duration: null,
      rebuild: true
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
    this.$root.$on('tick', this.tick)
    this.$root.$on('rebuild', this.makePlaylistHandler)
    // window.addEventListener('tick', () => { if (!this.rebuild) this.tick() })
    // window.addEventListener('rebuild', () => { this.makePlaylistHandler() })
  },
  beforeDestroy () {
    console.log('стопэ')
    this.$root.$off('tick', this.tick)
    this.$root.$off('rebuild', this.makePlaylistHandler)
    // window.removeEventListener('tick', () => { if (!this.rebuild) this.tick() })
    // window.removeEventListener('rebuild', () => { this.makePlaylistHandler() })
  },
  methods: {
    tick () {
      if (this.rebuild) return
      var notPlay = true
      var today = new Date()
      if (this.todayPlaylist.length === 0) return
      this.todayPlaylist.forEach((el, i) => {
        let need = this.needToPlay(today, el.timeline)
        // console.log(el.id, need)
        let start = this.startOf[i]
        let end = this.endOf[i]
        // console.log('to play ' + el.id + ' ', need)
        if (need && today > start && today < end) {
          notPlay = false
        }
        if (!this.started && need && today > start && today < end) {
          this.activeElement = el
          this.activeIndex = i
          this.started = new Date()
          if (el.timeline.playUntilDone) {
            if (el.duration) {
              this.duration = el.duration
            } else {
              this.duration = null
            }
          } else {
            this.duration = 1000 * el.timeline.duration
          }
          this.findNext(i)
          if (this.possible === -1) {
            this.findNext(-1)
          }
          console.log('сям')
          this.nextElement = this.possible
          this.next = this.todayPlaylist[this.nextElement]
        } else {
          if (i === this.nextElement && need && today > start && today < end) {
            if ((today - this.started) > this.duration) {
              if (!this.duration) {
                var step = 0
                if ((i - 1) >= 0) {
                  step = i - 1
                } else {
                  step = this.todayPlaylist.length - 1
                }
                console.log('step', step)
                if (today >= this.endOf[step]) {
                  this.activeElement = el
                  this.activeIndex = i
                  this.started = new Date()
                  if (el.timeline.playUntilDone) {
                    if (el.duration) {
                      this.duration = el.duration
                    } else {
                      this.duration = null
                    }
                  } else {
                    this.duration = 1000 * el.timeline.duration
                  }
                  this.findNext(i)
                  if (this.possible === -1) {
                    this.findNext(-1)
                  }
                  console.log('там')
                  this.nextElement = this.possible
                  this.next = this.todayPlaylist[this.nextElement]
                }
              } else {
                this.activeElement = el
                this.started = new Date()
                if (el.timeline.playUntilDone) {
                  if (el.duration) {
                    this.duration = el.duration
                  } else {
                    this.duration = null
                  }
                } else {
                  this.duration = 1000 * el.timeline.duration
                }
                this.findNext(i)
                if (this.possible === -1) {
                  this.findNext(-1)
                }
                console.log('тут')
                this.nextElement = this.possible
                this.next = this.todayPlaylist[this.nextElement]
              }
            }
          } else {
            if (i === this.nextElement) {
              if (!need || today <= start || today >= end) {
                console.log('фиксим')
                this.findNext(i)
                if (this.possible === -1) {
                  this.findNext(-1)
                }
                this.nextElement = this.possible
                this.next = this.todayPlaylist[this.nextElement]
              }
            }
          }
        }
      })
      console.log('next', this.nextElement)
      if (notPlay) {
        this.activeElement = {}
        console.log('diee')
      }
    },
    findNext (ii) {
      var today = new Date()
      let next = -1
      this.todayPlaylist.forEach((el, i) => {
        let need = this.needToPlay(today, el.timeline)
        let start = this.startOf[i]
        let end = this.endOf[i]
        if (ii === -1) {
          if (need && today > start && today < end && next === -1) {
            next = i
          }
          console.log('from start to', next)
        } else {
          if (need && today > start && today < end && i > ii && next === -1) {
            next = i
          }
        }
      })
      this.possible = next
    },
    makePlaylistHandler () {
      this.rebuild = true
      // this.stopPlaying()
      this.makeTodaysPlaylist()
      this.countStartsAndEnds()
      // this.startPlaying()
      this.rebuild = false
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
      list.sort((a, b) => {
        return a.order - b.order
      })
      this.todayPlaylist = list
      console.log('list', list)
      this.lastShown = list.length - 1
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
      if ((date < new Date(start)) || (date > new Date(end))) return false
      switch (rt) {
        case 'daily':
          const rf = +rs.recurrenceFrequency
          if (rf < -1) return false
          return (((d - s) / 86400000) + 1) % rf === 0
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
            return (((d - s) / (7 * 86400000)) + 1) % rf === 0
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
              return (12 * (new Date(d - s).getFullYear() - 1970) + new Date(d).getMonth() - new Date(s).getMonth() + 1) % rf === 0
            }
            return false
          } else {
            const dw = (1 + rs.relative.recurrenceDayOfWeek) % 7
            const wm = +rs.relative.recurrenceWeekOfMonth
            const rf = +rs.relative.recurrenceFrequency
            if ((wm === Math.floor(date.getDate() / 7)) && (dw === date.getDay())) {
              if (rf === 0) return true
              return (12 * (new Date(d - s).getFullYear() - 1970) + new Date(d).getMonth() - new Date(s).getMonth() + 1) % rf === 0
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
