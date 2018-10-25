<template>
  <div class="row no-gutters files-list-item"
    :class="{ active }">
    <div class="col col-1">
      <img class="image" :src="thumbnail"/>
    </div>
    <div class="col col-5">{{ driveObject.name | truncate }}</div>
    <div class="col col-2">
      <i class="icon" :class="iconClass"></i>
    </div>
    <div class="col col-2">{{ driveObject.size | formatSize }}</div>
    <div class="col col-2">{{ driveObject.updated_at | formatDate }}</div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'file-manager-list-item',
    props: ['driveObject', 'activeId', 'mediaElements'],
    computed: {
      iconClass () {
        switch (this.driveObject.type) {
          case 0:
            return 'icon-folder'
          case 1:
            return 'icon-picture'
          case 2:
            return 'icon-video'
          case 3:
            return 'icon-audio'
          default:
            return ''
        }
      },
      thumbnail () {
        if (this.driveObject.thumbnail_src) return this.driveObject.thumbnail_src
        return '/static/img/' + (this.isFolder ? 'folder' : 'def') + '.png'
      },
      isFolder () {
        return this.driveObject.type === 0
      },
      active () {
        var pos = null
        this.mediaElements.forEach((element, i) => {
          if (element.id === this.driveObject.id) {
            pos = i
          }
        })
        if (pos === null) {
          return false
        } else {
          return true
        }
        // return this.driveObject.id === this.activeId
      }
    },
    filters: {
      truncate (value) {
        if (value.length > 36) {
          return value.slice(0, 22) + ' ... ' + value.slice(-10)
        }
        return value
      },
      formatSize: function (value) {
        if (!value) return '–'
        if (Math.floor(value / 1024) === 0) return `${value.toFixed(1)} Б`
        value /= 1024
        if (Math.floor(value / 1024) === 0) return `${value.toFixed(1)} КБ`
        value /= 1024
        if (Math.floor(value / 1024) === 0) return `${value.toFixed(1)} МБ`
        value /= 1024
        if (Math.floor(value / 1024) === 0) return `${value.toFixed(1)} ГБ`
        value /= 1024
        return `${value.toFixed(1)} ТБ`
      },
      formatDate: function (value) {
        const d = new Date(value)
        if (d === 'Invalid Date') return value
        return moment(d).format('DD.MM.YYYY  HH:mm')
      }
    }
  }
</script>

<style scoped>
  .image {
    width: 46px;
    height: 46px;
    display: block;
  }
  .icon {
    width: 24px;
    height: 24px;
    display: block;
  }
  .icon-folder {
    background: url(/static/img/icons/document.svg);
  }
  .icon-picture {
    background: url(/static/img/icons/picture.svg);
  }
  .icon-audio {
    background: url(/static/img/icons/audio.svg);
  }
  .icon-video {
    background: url(/static/img/icons/video.svg);
  }
  .icon-audio {
    background: url(/static/img/icons/audio.svg);
  }
  .files-list-item {
    padding: 0.75rem 1.25rem;
    align-items: center;
    justify-content: center;
  }
  .files-list-item:not(:last-of-type) {
    border-bottom: 1.5px solid rgba(235,235,235,1);
  }
  .files-list-item.active {
    background: #f5f5f5;
  }
</style>