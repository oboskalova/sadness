<template>
  <div class="wrap">
    <input
      class="input"
      :value="hh"
      :placeholder="placeholder"
      @change="changeHours">
    <span class="separator">:</span>
    <input
      class="input"
      :value="mm"
      :placeholder="placeholder"
      @change="changeMinutes">
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'input-date',
  props: ['placeholder', 'time'],
  computed: {
    hh () {
      const date = JSON.parse(this.$props.time)
      return moment(date).format('HH')
    },
    mm () {
      const date = JSON.parse(this.$props.time)
      return moment(date).format('mm')
    }
  },
  methods: {
    changeHours (event) {
      let date = new Date(JSON.parse(this.$props.time))
      const value = +event.target.value
      if ((value >= 0) && (value <= 23)) {
        date.setHours(value)
        this.$emit('update:time', JSON.stringify(date))
      } else {
        event.target.value = this.hh
      }
    },
    changeMinutes (newValue) {
      let date = new Date(JSON.parse(this.$props.time))
      const value = +event.target.value
      if ((value >= 0) && (value <= 59)) {
        date.setMinutes(value)
        this.$emit('update:time', JSON.stringify(date))
      } else {
        event.target.value = this.mm
      }
    }
  }
}
</script>

<style scoped>
  .wrap {
    width: 180px;
    margin-bottom: 22px;
    display: flex;
    align-items: center;
  }
  .input {
    width: 45%;
    height: 32px;
    border: 1px solid rgba(189, 189, 189, 1);
    border-radius: 3px;
    outline: none;
    display: block;
    cursor: default;
    text-align: center;
  }
  .separator {
    width: 10%;
    text-align: center;
  }
</style>