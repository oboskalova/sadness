<template>
  <div
    class="list-item no-gutters"
    :class="{'active': choosed}"
    @click="choose"
    @dblclick="dblclickHandler">
    <div class="col col-2">{{ obj.name }}</div>
    <div class="col col-2">{{ obj.type }}</div>
    <div class="col col-2">{{ obj.pincode }}</div>
    <div class="col col-2 scheduler">
      <span @click="scheduler">{{ obj.schedule | scheduleValue }} </span>
    </div>
    <div class="col col-2" ><span v-html="rawHtml"></span><img v-if="this.obj.active == 'Loading'" src="/static/img/spinner.gif" class="loader"/></div>
    <div class="col col-2">
      <span class="date-time">
        {{ obj.connected_at | formatDate }}
      </span>
      <span>
        {{ obj.connected_at | formatTime }}
      </span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'display-list-item',
  props: ['obj'],
  computed: {
    rawHtml () {
      if (this.obj.active === 'Offline') {
        return '<span style="color: red">Offline</span> <span class="mi mi-error" style="color: red"></span>'
      }
      if (this.obj.active === 'Online') {
        return '<span style="color: green">Online</span> <span class="mi mi-check-circle" style="color: green"></span>'
      }
      if (this.obj.active === 'Не активирован') {
        return 'Не активирован'
      }
    },
    colorer () {
      if (this.obj.active === 'Offline') {
        return 'col col-2 redText'
      } else {
        if (this.obj.active === 'Online') {
          return 'col col-2 greenText'
        } else {
          return 'col col-2'
        }
      }
    },
    targetDisplayId () {
      return this.$store.getters.targetDisplayId
    },
    choosed () {
      return this.targetDisplayId === this.obj.id
    }
  },
  filters: {
    formatDate (value) {
      if (value) {
        const date = moment.utc(value).format()
        if (date === 'Invalid Date') return value
        return moment(date).format('DD.MM.YYYY')
      }
    },
    formatTime (value) {
      if (value) {
        if (value === null) return null
        const date = moment.utc(value).format()
        if (date === 'Invalid Date') return value
        return moment(date).format('HH:mm')
      }
    },
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
    }
  },
  methods: {
    editor () {
      this.$emit('assign', this.obj.id)
    },
    scheduler () {
      if (this.obj.schedule === null) {
        this.$emit('assign', this.obj.id)
        // this.$router.push('/schedules/new?d=' + this.obj.id)
      } else {
        this.$router.push('/schedules/' + this.obj.schedule.id + '?p=1')
      }
    },
    choose () {
      this.$store.commit('TOGGLE_DISPLAY_OBJECT', this.obj)
    },
    dblclickHandler () {
      if (!this.choosed) this.choose()
      this.$router.push('/players/' + this.obj.id)
    }
  }
}
</script>

<style scoped>
.list-item {
  padding: 0.75rem 1.25rem;
  border-top: 1.5px solid rgba(235,235,235,1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.list-item.active {
  border-color: rgba(245,245,245,1);
  background-color: rgba(245,245,245,1);
}
.list-item.active + .list-item {
  border-color: rgba(245,245,245,1);
}
.scheduler{
  color: #00b0b7;
}
.scheduler span:hover, .scheduler i:hover{
  color: #ff4080;
}
.mi-error {
  top: 2px;
}
.mi-check-circle {
  top: 2px;
}
.date-time {
  margin-right:10px;
}
.col-2 img{
  width: 20px!important;
  float: left!important;
}
</style>
