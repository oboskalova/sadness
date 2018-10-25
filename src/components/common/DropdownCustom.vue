<template>
  <div class="dropdown">
    <div class="dropdown-value">
      <b-form-input
        :value="text"
        :readonly="true"
        @focus.native="openDropdown">
      </b-form-input>
      <div
        class="dropdown-icon"
        :class="{ active }"
        @click="active = !active">
        <i class="mi mi-keyboard-arrow-down mi-24"></i>
      </div>
    </div>
    <div
      class="dropdown-dropdown"
      v-if="active">
      <div
        class="dropdown-option"
        v-for="e in options"
        v-if="e.id"
        :key="e.id"
        @click="select(e)">
        <span class="dropdown-text">{{ e.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dropdown-custom',
  props: ['type', 'title', 'options'],
  computed: {
    text () {
      const maxLength = 34
      const actives = this.$props.options
        .filter(e => e.active)
        .map(e => e.text)
        .join(', ')
      if (maxLength < actives.length) {
        return actives.slice(0, maxLength - 4) + ' ...'
      }
      return actives
    }
  },
  methods: {
    openDropdown () {
      this.active = true
    },
    select (e) {
      if (this.$props.type === 'radio') {
        this.resetAll()
      }
      e.active = !e.active
      this.active = false
      this.$emit('changed', e)
    },
    resetAll () {
      this.$props.options.forEach(e => {
        e.active = false
      })
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
.dropdown {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}
#app input[type=text][readonly="readonly"] {
  color: #000!important;
  border-bottom: 1px solid #bdbdbd !important;
  font-size: 1rem;
  *padding: 5px 6px!important;
  padding: 5px 0px!important;
}
.dropdown,
.dropdown-value {
  position: relative;
}
.dropdown-title {
  margin: 0;
  font-size: 14px;
  *font-weight: bold;
  *text-transform: uppercase;
}
.dropdown-box {
  width: 16px;
  height: 16px;
  color: white;
  cursor: pointer;
  text-align: center;
  border-radius: .25rem;
  background: #ddd;
}
.dropdown-box.active {
  background: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E") no-repeat;
  background-color: #00b0b7;
  background-size: 50% 50%;
  background-position: center;
}
.radio {
  border-radius: 50%;
}
.radio.active {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23fff'/%3E%3C/svg%3E");
}
.dropdown-text {
  margin-left: 0.3rem;
}
.dropdown-box,
.dropdown-text {
  display: inline-block;
  vertical-align: middle;
}
.dropdown-dropdown {
  width: 100%;
  max-height: 112px;
  margin-top: -1em;
  background: white;
  position: absolute;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  overflow-y: auto;
  z-index: 1;
}
.dropdown-icon {
  top: 50%;
  right: 0;
  height: 24px;
  margin-top: -12px;
  position: absolute;
  transition: transform 100ms ease;
  display: inline-block;
  cursor: pointer;
}
.dropdown-icon.active {
  transform: rotate(180deg);
}
.dropdown-option {
  padding: 0.5rem 1rem;
}
</style>