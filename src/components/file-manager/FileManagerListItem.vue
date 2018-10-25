<template>
  <div class="row no-gutters align-items-center justify-content-center row--divided"
    :class="{ 'row--dragging': dragging, 'row--active': active, 'row--choosed': choosed }"
    :draggable="''"
    @click="toggle($event)"
    @dblclick="dblclickHandler"
    @dragstart="dragStartHandler"
    @dragend="dragEndHandler"
    @dragover="dragOverHandler"
    @dragenter="dragEnterHandler">
    <div class="col col-1">
      <img class="image" :src="thumbnail"/>
    </div>
    <div class="col col-5">{{ obj.name }}</div>
    <div class="col col-2">
      <i class="icon" :class="iconClass"></i>
    </div>
    <div class="col col-2">{{ obj.size | formatSize }}</div>
    <div class="col col-2">{{ obj.updated_at | formatDate }}</div>
  </div>
</template>

<script>
  import moment from 'moment'
  import { moveDriveObjects } from '../../../api/file-manager'

  export default {
    name: 'file-manager-list-item',
    props: ['obj'],
    computed: {
      iconClass () {
        switch (this.obj.type) {
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
        if (this.obj.thumbnail_src) return this.obj.thumbnail_src
        return '/static/img/' + (this.isFolder ? 'folder' : 'def') + '.png'
      },
      isFolder () {
        return this.obj.type === 0
      },
      active () {
        return this.$store.getters.destCatalogueId === this.obj.id
      },
      choosed () {
        return this.obj.isChoosed
      },
      dragging () {
        return this.obj.isDragging
      },
      canBeActivated () {
        return !this.obj.isDragging && this.obj.type === 0
      },
      movingMode () {
        return this.$store.getters.movingMode
      }
    },
    filters: {
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
    },
    created () {
      let img = document.createElement('img')
      img.onerror = event => {
        this.obj.thumbnail_src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9ItCh0LvQvtC5XzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjQgMjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojOUM5QzlCO30KPC9zdHlsZT4KPHBhdGggaWQ9IlhNTElEXzQxMl8iIGNsYXNzPSJzdDAiIGQ9Ik03LjgsMS45QzcuNywxLjksNy42LDIsNy41LDIuMUw0LjIsNS43QzQuMSw1LjgsNC4xLDUuOCw0LjEsNS45aDMuN1YxLjl6IE0xOS4xLDEuOEg5LjJ2NS42CglIMy45djEzLjNjMCwwLjYsMC41LDEuMiwxLjIsMS4yaDE0YzAuNiwwLDEuMi0wLjUsMS4yLTEuMlYzQzIwLjMsMi4zLDE5LjcsMS44LDE5LjEsMS44eiIvPgo8L3N2Zz4K'
      }
      img.src = this.thumbnail
    },
    methods: {
      move: function (targetCatalogue) {
        const ids = this.$store.getters.choosedObjects
        moveDriveObjects(ids, targetCatalogue).then(response => {
          this.$store.commit('DELETE_CATALOGUE_OBJECTS')
        })
      },
      toggle: function (e) {
        console.log('toggle', e)
        if (!this.movingMode) {
          let isCtrl = e.ctrlKey
          let isShift = e.shiftKey
          this.$store.commit('SMART_TOGGLE_CATALOGUE_OBJECT', {
            id: this.obj.id,
            isCtrl: isCtrl,
            isShift: isShift
          })
        }
      },
      choose: function () {
        if (!this.choosed) this.toggle()
      },
      dblclickHandler: function () {
        console.log('dbCkick')
        this.$store.commit('CHANGE_REQUEST_TYPE', this.isFolder)
        this.$router.push('/files/' + this.obj.id)
      },
      dragStartHandler: function (event) {
        this.choose()
        this.$store.commit('ASSIGN_DRAGGING_OBJECTS')
      },
      dragEndHandler: function () {
        this.$store.commit('DENY_DRAGGING_OBJECTS')
        this.move(this.$store.getters.destCatalogueId)
        this.$store.dispatch('updateDestCatalogue', -1)
        this.$store.dispatch('updateDriveTree')
      },
      dragEnterHandler: function () {
        const id = this.canBeActivated ? this.obj.id : -1
        this.$store.dispatch('updateDestCatalogue', id)
      },
      dragOverHandler: function (event) {
        if (event.preventDefault) event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
        return false
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
  .icon-video {
    background: url(/static/img/icons/video.svg);
  }
  .icon-audio {
    background: url(/static/img/icons/audio.svg);
  }
</style>