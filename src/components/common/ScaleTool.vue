<template>
  <div class="scale">
    <button class="scale-button" @click="zoomOut">&ndash;</button>
    <vue-slider ref="slider" v-model="zoomer" v-bind="options" v-on:callback="getValue"></vue-slider>
    <button class="scale-button pluser" @click="zoomIn">+</button>
    {{ zoomFormatted }}
    <button v-if="mode" class="scale-button fit" @click="fit" title="По размеру экрана"><i class="mi mi-fullscreen"></i></button>
    <button v-if="mode && attached" class="scale-button fit" @click="attach(false)" title="Открепить панель"><i class="mi mi-bookmark"></i></button>
    <button v-if="mode && !attached" class="scale-button fit" @click="attach(true)" title="Закрепить панель"><i class="mi mi-bookmark-border"></i></button>
    <!--<input class="scale-input" :value="zoomFormatted" readonly>-->
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component'

export default {
  name: 'scale-tool',
  props: ['initialScale', 'onZoomIn', 'onZoomOut', 'mode'],
  components: {
    vueSlider
  },
  computed: {
    // zoomFormatted () {
      // const zoom = this.zoomValues[this.index]
      // return `${Math.floor(zoom * 100)}%`
    // }
    attached () {
      return this.$store.getters.attached
    },
    zoomFormatted () {
      return `${parseInt(this.zoomer)}%`
    }
  },
  created () {
    console.log(this.$props.initialScale)
    if (this.$props.initialScale) {
      const initialScale = this.$props.initialScale
      if (initialScale) {
        this.zoomer = initialScale * 100
      }
    } else {
      this.zoomer = 100
    }
  },
  mounted () {
    document.addEventListener('keydown', this.captureDefaultPageZooming)
    this.$root.$on('setZoom', this.setZoom)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.captureDefaultPageZooming)
  },
  methods: {
    fit () {
      this.setScale()
      this.$nextTick(() => {
        setTimeout(() => { this.setScale() }, 300)
      })
    },
    attach (flag) {
      this.$store.commit('SET_ATTACH_PANEL', flag)
    },
    setScale () {
      var container = document.getElementsByClassName('player')[0]
      container.style.overflow = 'hidden'
      console.log(container.clientWidth, container.clientHeight)
      const props = this.$store.getters.props
      var scaleX = container.clientWidth / props.width
      var scaleY = container.clientHeight / props.height
      console.log(scaleX, scaleY)
      var curScale = 0
      if (scaleX > scaleY) {
        curScale = scaleY
      } else {
        curScale = scaleX
      }
      const onZoomIn = this.$props.onZoomIn
      const oldZoom = this.oldZoom
      const zz = curScale
      console.log('fit to' + zz)
      if (zz) {
        const newZoom = zz
        this.zoomer = zz * 100
        console.log(newZoom)
        if (typeof onZoomIn === 'function') {
          console.log('changing')
          onZoomIn.call(this, oldZoom, newZoom)
        }
        this.oldZoom = newZoom
      }
    },
    setZoom () {
      if (this.$props.initialScale) {
        setTimeout(() => {
          const onZoomIn = this.$props.onZoomIn
          const oldZoom = this.oldZoom
          const zz = window.localStorage.getItem('Zoom' + this.$route.params.id)
          console.log('zomr' + zz)
          if (zz) {
            const newZoom = zz
            this.zoomer = zz * 100
            console.log(newZoom)
            if (typeof onZoomIn === 'function') {
              console.log('changing')
              onZoomIn.call(this, oldZoom, newZoom)
            }
            this.oldZoom = newZoom
          }
        }, 500)
      }
    },
    getValue () {
      if (this.$props.mode) {
        var container = document.getElementsByClassName('player')[0]
        container.style.overflow = 'auto'
      }
      const onZoomIn = this.$props.onZoomIn
      const oldZoom = this.oldZoom
      const newZoom = this.$refs.slider.getValue() * 0.01
      if (typeof onZoomIn === 'function') {
        onZoomIn.call(this, oldZoom, newZoom)
      }
      this.oldZoom = newZoom
    },
    zoomIn () {
      if (this.$props.mode) {
        var container = document.getElementsByClassName('player')[0]
        container.style.overflow = 'auto'
      }
      const onZoomIn = this.$props.onZoomIn
      /* if (this.index < this.zoomValues.length - 1) {
        const oldZoom = this.zoomValues[this.index]
        const newZoom = this.zoomValues[++this.index]
        if (typeof onZoomIn === 'function') {
          onZoomIn.call(this, oldZoom, newZoom)
        }
      } */
      if (this.zoomer < 200) {
        const oldZoom = this.oldZoom
        this.zoomer = Math.floor(this.zoomer / 10) * 10 + 10
        const newZoom = this.zoomer * 0.01
        console.log(newZoom)
        if (typeof onZoomIn === 'function') {
          onZoomIn.call(this, oldZoom, newZoom)
        }
        this.oldZoom = newZoom
      }
    },
    zoomOut () {
      if (this.$props.mode) {
        var container = document.getElementsByClassName('player')[0]
        container.style.overflow = 'auto'
      }
      const onZoomOut = this.$props.onZoomOut
      /* if (this.index > 0) {
        const oldZoom = this.zoomValues[this.index]
        const newZoom = this.zoomValues[--this.index]
        if (typeof onZoomOut === 'function') {
          onZoomOut.call(this, oldZoom, newZoom)
        }
      } */
      if (this.zoomer > 10) {
        const oldZoom = this.oldZoom
        if (this.zoomer % 10 > 0) {
          this.zoomer = Math.floor(this.zoomer / 10) * 10
        } else {
          this.zoomer = Math.floor(this.zoomer / 10) * 10 - 10
        }
        const newZoom = this.zoomer * 0.01
        console.log(newZoom)
        if (typeof onZoomOut === 'function') {
          onZoomOut.call(this, oldZoom, newZoom)
        }
        this.oldZoom = newZoom
      }
    },
    captureDefaultPageZooming (event) {
      if (event.ctrlKey && event.keyCode === 189) {
        this.zoomOut()
        event.preventDefault()
      }
      if (event.ctrlKey && event.keyCode === 187) {
        this.zoomIn()
        event.preventDefault()
      }
    }
  },
  data () {
    return {
      index: 7,
      zoomValues: [ 0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5 ],
      zoomer: 33,
      oldZoom: 0.33,
      options: {
        width: 100,
        min: 1,
        max: 200,
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
  .scale {
    height: 37px;
    margin-right: 15px;
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
    margin-right: 6px;
  }
  .vue-slider-component {
    display: inline-block;
    vertical-align: middle;
    margin-top: -4px;
  }
  .disable {
    color: #008f94;
  }
  .pluser {
    margin-right: 15px;
  }
  .fit i{
    top: 4px;
    margin-left: 5px;
  }
</style>