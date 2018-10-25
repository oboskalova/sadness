<template>
    <container v-if="content" :is="curWidgetView" v-on:click.native="selectContainer" :containerStyle="containerStyle"
      :content = content :settings="settings" style="z-index: 0;"></container>
</template>

<script>
  import ScrollTextView from './widgets/ScrollTextView'
  import IframeSiteView from './widgets/IframeSiteView'
  import DisplayDateTime from './widgets/DisplayDateTime'
  import WeatherView from './widgets/WeatherView'
  import TwitterView from './widgets/TwitterView'
  import InstagramView from './widgets/InstagramView'
  import RSSView from './widgets/RSSView'
  import ParserView from './widgets/ParserView'
  import PDFView from './widgets/PDFView'
  import QRView from './widgets/QRView'
  import TrafficView from './widgets/TrafficView'

  export default {
    name: 'widget-view-controller',
    props: ['settings', 'containerStyle'],
    components: {
      ScrollTextView,
      IframeSiteView,
      DisplayDateTime,
      WeatherView,
      TwitterView,
      InstagramView,
      RSSView,
      ParserView,
      PDFView,
      QRView,
      TrafficView
    },
    data () {
      return {}
    },
    computed: {
      cId () {
        return this.$props.settings.id
      },
      content () {
        console.log(this.$store.getters.coreWidgets[this.cId])
        const widgets = (this.$store.getters.coreWidgets[this.cId] || []).filter(w => w.show)
        const len = widgets.length
        if (len) {
          let w = widgets[len - 1]
          let content = JSON.parse(w.content)
          return content
        } else return null
      },
      curWidgetView () {
        const type = this.content.type
        switch (type) {
          case 4:
            return 'ScrollTextView'
          case 5:
            return 'IframeSiteView'
          case 6:
            return 'DisplayDateTime'
          case 7:
            return 'WeatherView'
          case 8:
            return 'TwitterView'
          case 9:
            return 'InstagramView'
          case 10:
            return 'RSSView'
          case 11:
            return 'ParserView'
          case 12:
            return 'PDFView'
          case 13:
            return 'QRView'
          case 14:
            return 'TrafficView'
          default:
            return ''
        }
      }
    },
    methods: {
      selectContainer () {
        console.log('change container')
        this.$store.commit('CHANGE_CONTAINER', this.cId)
        this.settings.editable ? this.changeActionType('updatingTypeMove') : this.changeActionType('None')
      },
      changeActionType (type) {
        this.$store.dispatch('updateActionType', type)
      }
    }
  }
</script>
