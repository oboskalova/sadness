<template>
  <div class="yandex" :ref="mapID">
    <div class="loading" v-show="!isLoaded">карта загружается...</div>
  </div>
</template>

<script>
export default {

  name: 'yandex-map',

  props: ['containerStyle', 'coords', 'id', 'reloadTime', 'template', 'zoom'],

  data () {
    return {
      delay: 4000,
      isLoaded: false,
      map: null,
      parser: {
        attempts: [1, 3],
        reloads: [1, 10],
        delay: 1000,
        regExp: /\d+ балл(?:ов|а)?/i
      },
      options: {
        center: this.coords,
        controls: [],
        scale: 1,
        zoom: this.zoom
      },
      timers: {
        parser: null,
        resize: null,
        schedule: null,
        timeout: null
      },
      timeout: null,
      trafficControl: null
    }
  },

  computed: {
    miliseconds () {
      return this.reloadTime * 60 * 1000
    },
    mapID () {
      return `yandex-map-${this.id}`
    },
    root () {
      return this.$refs[this.mapID]
    },
    reducedDelay () {
      return this.$store.getters.mapById(this.mapID) * this.delay
    }
  },

  beforeDestroy () {
    this.map.destroy()
    this.$store.commit('REMOVE_MAP', this.mapID)
    clearInterval(this.timers.parser)
    clearInterval(this.timers.resize)
    clearInterval(this.timers.schedule)
    clearTimeout(this.timers.timeout)
  },

  mounted () {
    // eslint-disable-next-line
    ymaps.ready(this.init)
  },

  methods: {
    init () {
      this.$store.commit('ADD_MAP', this.mapID)
      this.setTemplate(this.template)
      this.timers.timeout = setTimeout(() => {
        // eslint-disable-next-line
        this.trafficControl = new ymaps.control.TrafficControl({ options: { size: 'large' }})
        this.options.controls.push(this.trafficControl)
        // eslint-disable-next-line
        this.map = new ymaps.Map(this.root, this.options)
        this.setMapView()
        this.handle()
        this.timers.schedule = setInterval(this.reload, this.miliseconds + this.reducedDelay)
        this.isLoaded = true
      }, this.reducedDelay)
    },
    handle () {
      clearInterval(this.timers.parser)
      this.parser.attempts[0] = 1
      this.parser.reloads[0] = 1
      this.parseText()
        .then(text => this.handleText(text))
        .catch(error => this.handleError(error))
    },
    handleText (text) {
      let state = this.template === 0 || this.template === 1
      this.$emit('setInformer', state, text)
    },
    handleError (error) {
      this.$emit('handleError', error)
    },
    parseText () {
      return new Promise((resolve, reject) => {
        this.timers.parser = setInterval(() => {
          let text = this.root.innerText
          let parsed = text.match(this.parser.regExp)
          if (parsed) {
            clearInterval(this.timers.parser)
            return resolve(parsed[0])
          }
          if (this.parser.attempts[0]++ === this.parser.attempts[1]) {
            this.parser.attempts[0] = 1
            if (this.parser.reloads[0] === this.parser.reloads[1]) {
              this.parser.reloads[0] = 1
              clearInterval(this.timers.parser)
              return reject(new Error('Timeout'))
            }
            this.updateTrafficLayer(1)
            this.parser.reloads[0]++
          }
        }, this.parser.delay)
      })
    },
    reload () {
      console.log(this.mapID, 'updated')
      this.map.destroy()
      /* eslint-disable */
      this.map = new ymaps.Map(this.root, this.options)
      /* eslint-enable */
      this.setMapView()
      this.handle()
    },
    resizeMap () {
      this.map.container.fitToViewport(true)
      this.map.setCenter(this.coords)
    },
    setMapView () {
      this.map.behaviors.disable('scrollZoom')
      this.map.behaviors.disable('drag')
      this.updateTrafficLayer()
      this.root.querySelector('.ymaps-2-1-69-controls__control_toolbar').style.opacity = 0
    },
    setTemplate (value) {
      let informer = this.template === 0 || this.template === 1
      let map = this.template === 1 || this.template === 2
      this.$emit('setInformer', informer)
      this.$emit('setMap', map)
    },
    updateTrafficLayer () {
      this.trafficControl.hideTraffic()
      this.trafficControl.showTraffic()
    }
  },

  watch: {
    containerStyle () {
      if (!this.map) return
      this.resizeMap()
    },
    coords (value) {
      if (!this.map) return
      this.map.setCenter(value)
      this.handle()
    },
    reloadTime () {
      clearInterval(this.timers.schedule)
      this.timers.schedule = setInterval(this.reload, this.miliseconds + this.reducedDelay)
    },
    template (value) {
      this.setTemplate(value)
      this.timers.resize = setTimeout(this.resizeMap, 50)
    },
    zoom () {
      if (!this.map) return
      this.map.setZoom(this.zoom)
    }
  }

}
</script>

<style scoped>
.yandex {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
}
</style>