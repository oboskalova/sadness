<template>
  <div class="wrap">
    <svg class="icon" fill="#BDBDBD" viewBox="1 2 21 21" width="18" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <datepicker
      class="input"
      language="ru"
      :value="dateValue"
      @input="updateDate"
      @opened="openedHandler"
      @closed="active = false">
    </datepicker>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'input-date',
  props: ['date', 'opened'],
  components: { Datepicker },
  computed: {
    dateValue: {
      get () {
        return JSON.parse(this.$props.date)
      },
      set (value) {
        this.$emit('update:date', value)
      }
    }
  },
  methods: {
    updateDate (newValue) {
      this.dateValue = JSON.stringify(new Date(newValue))
    },
    openedHandler () {
      const fn = this.$props.opened
      this.active = true
      if (typeof fn === 'function') fn(this)
    },
    toggleDatepicker () {
      let click = new Event('click')
      let input = this.$children[0].$el.querySelector('input')
      input.dispatchEvent(click)
    },
    closeDatepicker () {
      if (this.active) {
        this.toggleDatepicker()
        this.active = false
      }
    }
  },
  data () {
    return {
      active: false
    }
  }
}
</script>

<style scoped>
  .wrap {
    width: 180px;
    margin: 6px 0;
    position: relative;
  }
  .input {
    width: 100%;
    height: 32px;
    border: 1px solid rgba(189, 189, 189, 1);
    border-radius: 3px;
    outline: none;
    display: block;
    cursor: pointer;
  }
  .icon {
    top: 50%;
    right: 9px;
    position: absolute;
    transform: translateY(-50%);
    display: block;
    cursor: pointer;
  }
</style>