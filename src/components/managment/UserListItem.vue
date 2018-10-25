<template>
  <div
    class="list-item no-gutters"
    :class="{'active': choosed}"
    @click="choose">
    <div class="col col-4">{{ obj.name }}</div>
    <div class="col col-6">{{ obj.groups_list | formatGroup }}</div>
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
    targetUser () {
      return this.$store.getters.targetUser
    },
    choosed () {
      if (this.targetUser) {
        return this.targetUser.id === this.obj.id
      } else {
        return false
      }
    }
  },
  filters: {
    formatGroup (v) {
      if (v) {
        var list = ''
        v.forEach(val => {
          if (list.length === 0) {
            list = list + val.name
          } else {
            list = list + ', ' + val.name
          }
        })
        return list
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
      this.$store.commit('TOGGLE_USER_OBJECT', this.obj)
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
