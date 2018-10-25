<template>
  <div class="color-picker">
    <div 
      v-if="active && color"
      class="cleaner" />
    <input
      class="color-picker--input" 
      type="text"
      :value="colorHEX"
      readonly>
    <div
      class="color-picker--wrap"
      v-click-outside="closeColorPicker">
      <span
        class="color-picker--span"
        :style="styleObject"
        @click="toggleColorPicker" />
      <Chrome
        v-if="active && color"
        class="color-picker--core"
        :value="color"
        @input="updateColor" />
    </div>
  </div>
</template>

<script>
import { Chrome } from 'vue-color'

export default {
  name: 'input-color',
  props: ['color', 'disabled'],
  components: { Chrome },
  watch: {
    container (v) {
      this.firstTick = true
    },
    color (v = '') {
      this.colorHEX = this.toHex(v)
      this.colorRGBA = v
    }
  },
  created () {
    this.colorHEX = this.toHex(this.color)
    this.colorRGBA = this.color
  },
  computed: {
    container () {
      return this.$store.getters.coreActiveContainer
    },
    styleObject () {
      return {
        background: this.colorRGBA
      }
    }
  },
  data () {
    return {
      active: false,
      colorHEX: '',
      colorRGBA: '',
      firstTick: true
    }
  },
  methods: {
    toggleColorPicker () {
      if (this.disabled) {
        this.active = !this.active
      }
    },
    closeColorPicker () {
      if (this.active) {
        this.active = false
        this.$emit('change', this.colorRGBA)
      }
    },
    updateColor (value) {
      var rgba = value.rgba || {}
      if (this.firstTick) {
        if (rgba.a === 0) {
          rgba.a = 1
        }
        this.firstTick = false
      }
      const format = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`
      this.$emit('update:color', format)
    },
    toHex (value = '') {
      if (!/rgba\(\d+,\d+,\d+,(\d\.)?\d+\)/.test(value)) return ''
      const parts = value.substring(value.indexOf('(')).split(',')
      const r = (+parts[0].substring(1)).toString(16)
      const g = (+parts[1]).toString(16)
      const b = (+parts[2]).toString(16)
      return ('#' + this.fullByZero(r) + this.fullByZero(g) + this.fullByZero(b))
    },
    fullByZero (value) {
      value = value + ''
      if (value.length < 2) {
        value = '0' + value
      }
      return value
    }
  }
}
</script>

<style scoped>
.cleaner {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
  background: rgba(255,255,255,0);
}
.color-picker {
  position: relative;
}
.color-picker--input {
  width: 100%;
  min-width: 75px;
  margin-bottom: 1.05rem;
  border: none;
  border-bottom: 1px solid #d9d9d9;
  background-color: white;
  outline: none;
  color: #333;
}
.color-picker--wrap {
  left: unset;
  top: 0;
  right: 0;
  display: inline-block;
  vertical-align: middle;
  transform: translateX(100%);
  position: absolute;
  z-index: 1;
}
.color-picker--span {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 7px;
  border-radius: 5px;
  display: block;
  cursor: pointer;
  position: relative;
  box-shadow: 0 0 2px rgba(0,0,0,0.5) inset;
}
.color-picker--core {
  right: 0;
  bottom: 50px;
  position: absolute;
}
#app .color-picker--input[type=text][readonly="readonly"] {
  padding-left: 0;
  padding-right: 0;
}
</style>