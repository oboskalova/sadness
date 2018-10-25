<template>
  <div
    class="list-item no-gutters"
    :class="{'active': choosed}"
    @click="choose">
    <div class="col col-3">{{ obj.name }}</div>
    <div class="col col-2">{{ obj.space | formatOrg }}</div>
    <div class="col col-3">{{ obj.admin | formatAdmin }}</div>
    <div class="col col-2">{{ obj.lock | formatLock }}</div>
    <div class="col col-2">
      <span class="date-time">
        {{ obj.updated_at | formatDate }}
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
    targetOrg () {
      return this.$store.getters.targetOrg
    },
    choosed () {
      if (this.targetOrg) {
        return this.targetOrg.id === this.obj.id
      } else {
        return false
      }
    }
  },
  filters: {
    formatOrg (v) {
      return (v.mounted / 1000000000).toFixed(2) + '/' + v.whole / 1000000000
    },
    formatLock (v) {
      if (v) {
        return 'Да'
      } else {
        return 'Нет'
      }
    },
    formatAdmin (v) {
      if (v) {
        return v.name
      } else {
        return ''
      }
    },
    formatDate (value) {
      if (value) {
        const date = moment.utc(value).format()
        if (date === 'Invalid Date') return value
        return moment(date).format('DD.MM.YYYY HH:mm')
      }
    }
  },
  methods: {
    choose () {
      this.$store.commit('TOGGLE_ORG_OBJECT', this.obj)
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
