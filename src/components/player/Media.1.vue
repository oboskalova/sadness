<template>
  <component :is="entity" :file="file" :content="content" :mute="options.mute" :next="next" :container="id" :containerStyle="containerStyle"></component>
</template>

<script>
  import MediaImage from './MediaImage'
  import MediaAudio from './MediaAudio'
  import MediaVideo from './MediaVideo'
  import ScrollTextWidget from './widgets/ScrollTextWidget'
  import IframeSiteWidget from './widgets/IframeSiteWidget'
  import {
    getDriveObject
  } from '../../../api/file-manager'
  import DateAndTImeWidget from './widgets/DateAndTImeWidget'
  import WeatherWidget from './widgets/WeatherWidget'
  import TwitterWidget from './widgets/TwitterWidget'
  import InstagramWidget from './widgets/InstagramWidget'
  import RSSWidget from './widgets/RSSWidget'
  import ParserWidget from './widgets/ParserWidget'
  import PDFWidget from './widgets/PDFWidget'

  export default {
    name: 'media',
    props: ['options', 'id', 'next', 'containerStyle'],
    components: {
      MediaImage,
      MediaAudio,
      MediaVideo,
      ScrollTextWidget,
      IframeSiteWidget,
      DateAndTImeWidget,
      WeatherWidget,
      TwitterWidget,
      InstagramWidget,
      RSSWidget,
      ParserWidget,
      PDFWidget
    },
    data () {
      return {
        file: {},
        content: {}
      }
    },
    watch: {
      fileId (id) {
        getDriveObject(id).then(response => {
          this.file = response.data
        })
      }
    },
    computed: {
      entity () {
        console.log(this.options)
        if (this.opContent) {
          this.content = JSON.parse(this.opContent)
          this.content.id = this.$props.id
          switch (this.content.type) {
            case 4:
              return 'ScrollTextWidget'
            case 5:
              return 'IframeSiteWidget'
            case 6:
              return 'DateAndTImeWidget'
            case 7:
              return 'WeatherWidget'
            case 8:
              return 'TwitterWidget'
            case 9:
              return 'InstagramWidget'
            case 10:
              return 'RSSWidget'
            case 11:
              return 'ParserWidget'
            case 12:
              return 'PDFWidget'
            default:
              return ''
          }
        } else {
          const type = this.file.type
          switch (type) {
            case 0:
            case 1:
              return 'MediaImage'
            case 2:
              return 'MediaVideo'
            case 3:
              return 'MediaAudio'
            default:
              return ''
          }
        }
      },
      fileId () {
        return this.$props.options.file_id
      },
      opContent () {
        return this.$props.options.content
      }
    }
  }
</script>
