<template>
  <div class="google" :ref="mapID"></div>
</template>

<script>
export default {

  name: 'google-map',

  props: ['containerStyle', 'coords', 'id', 'reloadTime', 'zoom'],

  data () {
    return {
      timer: null,
      options: {
        center: {
          lat: Number(this.coords[0]),
          lng: Number(this.coords[1])
        },
        disableDefaultUI: true,
        draggable: false,
        zoom: this.zoom,
        zoomControl: false,
        scaleControl: false,
        scrollwheel: false
      },
      selectors: []
    }
  },

  computed: {
    mapID () {
      return `google-map-${this.id}`
    },
    root () {
      return this.$refs[this.mapID]
    }
  },

  beforeDestroy () {
    clearInterval(this.timer)
  },

  created () {
    this.$emit('setInformer', false)
    this.$emit('setMap', true)
  },

  mounted () {
    /* eslint-disable */
    this.map = new google.maps.Map(this.root, this.options)
    this.trafficLayer = new google.maps.TrafficLayer()
    /* eslint-enable */
    this.trafficLayer.setMap(this.map)
    this.hideElements()
    this.resize()
    this.timer = setInterval(this.reload, this.reloadTime * 60 * 1000)
  },

  methods: {
    hideElements () {
      this.selectors.forEach(selector => {
        this.root.querySelector(selector).style.opacity = 0
      })
    },
    reload () {
      this.trafficLayer.setMap(null)
      this.trafficLayer.setMap(this.map)
    },
    resize () {
      // eslint-disable-next-line
      google.maps.event.trigger(this.map, 'resize')
    }
  },

  watch: {
    containerStyle () {
      this.resize()
    },
    coords (value) {
      this.map.setCenter({ lat: Number(value[0]), lng: Number(value[1]) })
    },
    reloadTime () {
      clearInterval(this.timer)
      this.timer = setInterval(this.reload, this.reloadTime * 60 * 1000)
    },
    zoom () {
      this.map.setZoom(this.zoom)
    }
  }

}
</script>

<style scoped>
.google {
  height: 100%;
  width: 100%;
}
</style>