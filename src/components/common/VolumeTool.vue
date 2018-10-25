<template>
  <div class="scale">
    <img
        v-show="!muter && zoomer > 70"
        src="/static/img/loud.png"
        class="unit loud"
        @click="muteIt(true)">
    <img
        v-show="!muter && zoomer > 40 && zoomer < 71"
        src="/static/img/mid.png"
        class="unit loud"
        @click="muteIt(true)">
    <img
        v-show="!muter && zoomer > 0 && zoomer < 41"
        src="/static/img/low.png"
        class="unit loud"
        @click="muteIt(true)">
    <img
        v-show="muter || zoomer === 0"
        src="/static/img/mute.png"
        class="unit loud"
        @click="muteIt(false)">
    <vue-slider ref="slider" v-model="zoomer" v-bind="options" v-on:callback="getValue"></vue-slider>
    <div class="value"> {{ zoomFormatted }} </div>
    <!--<input class="scale-input" :value="zoomFormatted" readonly>-->
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component'

export default {
  name: 'volume-tool',
  props: ['initialVolume', 'initialMute', 'changeVolume', 'mute'],
  components: {
    vueSlider
  },
  computed: {
    // zoomFormatted () {
      // const zoom = this.zoomValues[this.index]
      // return `${Math.floor(zoom * 100)}%`
    // }
    zoomFormatted () {
      return `${this.zoomer}%`
    }
  },
  created () {
    console.log(this.$props.initialVolume)
    if (this.$props.initialVolume) {
      const initialVolume = this.$props.initialVolume
      if (initialVolume) {
        this.zoomer = initialVolume
      }
    } else {
      this.zoomer = 100
    }
  },
  mounted () {
    this.$root.$on('setVolume', this.setZoom)
  },
  methods: {
    muteIt (state) {
      this.muter = state
      const changeMute = this.$props.mute
      if (typeof changeMute === 'function') {
        changeMute.call(this, this.muter)
      }
    },
    setZoom () {
      if (this.$props.initialVolume) {
        setTimeout(() => {
          this.zoomer = this.$props.initialVolume
          this.muter = this.$props.initialMute
        }, 200)
      }
    },
    getValue () {
      const changeVolume = this.$props.changeVolume
      const newZoom = this.$refs.slider.getValue()
      if (typeof changeVolume === 'function') {
        changeVolume.call(this, newZoom)
      }
      this.oldZoom = newZoom
    }
  },
  data () {
    return {
      zoomer: 100,
      muter: false,
      oldZoom: 100,
      options: {
        width: 110,
        min: 0,
        max: 100,
        height: 2,
        dotSize: 12,
        processStyle: {
          'backgroundColor': 'rgba(1,1,1,0)'
        },
        tooltip: false,
        formatter: (v) => `${v}%`
      }
    }
  }
}
</script>

<style scoped>
  .value {
    float: right;
    width: 40px;
    text-align: right;
  }
  .scale {
    height: 37px;
    margin-right: 15px;
    margin-top: 15px;
  }
  .scale-input,
  .scale-button {
    height: 100%;
    margin-top: -1px;
    display: inline-block;
    color: #ffffff;
  }
  .scale-input {
    width: 97px;
    text-align: center;
    background: #008f94;
    border: none;
    border-radius: 3px;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 0.5px;
  }
  .scale-button {
    width: 10px;
    padding: 0;
    line-height: 40px;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: bold;
    font-size: 18px;
  }
  .vue-slider-component {
    display: inline-block;
    vertical-align: middle;
    margin-top: -4px;
  }
  .pluser {
    margin-right: 15px;
  }
  .mi {
    font-size: 17px;
    top: 2px;
    cursor: pointer;
  }
  .unit {
    width: 25px;
    cursor: pointer;
    margin-top: -3px;
  }
</style>