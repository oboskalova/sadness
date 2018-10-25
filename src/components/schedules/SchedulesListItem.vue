<template>
  <div
    class="list-item no-gutters"
    :class="{'active': choosed}"
    @click="choose"
    @dblclick="dblclickHandler">
    <div class="col col-9">{{ obj.name }}</div>
    <div class="col col-3">{{ obj.updated_at | formatDate }}</div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'schedule-list-item',
  props: ['obj'],
  computed: {
    targetScheduleId () {
      return this.$store.getters.targetScheduleId
    },
    choosed () {
      return this.targetScheduleId === this.obj.id
    }
  },
  filters: {
    formatDate (value) {
      const date = moment.utc(value).format()
      if (date === 'Invalid Date') return value
      return moment(date).format('DD.MM.YYYY  HH:mm')
    }
  },
  methods: {
    choose () {
      this.$store.commit('TOGGLE_SCHEDULE_OBJECT', this.obj.id)
    },
    dblclickHandler () {
      if (!this.choosed) this.choose()
      this.$router.push('/schedules/' + this.obj.id)
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
.scheduler {
  color: #00b0b7;
}
.scheduler:hover {
  color: #ff4080;
}
.mi-error {
  top: 2px;
}
.mi-check-circle {
  top: 2px;
}
.redText {
  color: red;
}
.greenText {
  color: green;
}
</style>
