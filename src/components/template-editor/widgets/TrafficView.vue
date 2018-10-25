<template>
  <div
    class="widget"
    v-show="isShow"
    :style="{ color: content.fontColor, fontFamily: content.font, height: content.height, width: content.width }"
  >
    <div
      class="informer"
      ref="informer"
      :class="{ full: informer.visible && !map.visible }"
      :style="{ fontSize: size }"
      v-show="informer.visible"
    >
      <div class="inner">
        <div class="left" :style="{ height: size, marginRight: leftMargin }" v-show="leftVisible">
          <div class="icon" :style="{ marginRight: iconMargin }">
            <img :src="image.dir + informer.state.icon + image.format">
          </div>
          <div>{{ informer.point }}</div>
        </div>
        <div class="description" v-show="descriptionVisible">
          {{ informer.state.description }}
        </div>
      </div>
    </div>
    <div class="map" :class="{ full: !informer.visible }" v-show="map.visible">
      <component
        :is="content.provider"
        :containerStyle="containerStyle"
        :coords="content.coords"
        :id="settings.id"
        :reloadTime="content.reloadTime"
        :template="content.template"
        :zoom="content.zoom"
        @setInformer="setInformer"
        @setMap="setMap"
        @handleError="handleError"
      ></component>
    </div>
  </div>
</template>

<script>
import Connection from '@/components/player/widgets/helpers/Connection'
import Google from '../../widgets/components/GoogleMap'
import Yandex from '../../widgets/components/YandexMap'

export default {

  name: 'media-traffic-view',

  props: ['content', 'settings', 'containerStyle'],

  components: {
    Google,
    Yandex
  },

  data () {
    return {
      isShow: true,
      descriptionVisible: true,
      leftVisible: true,
      scale: null,
      margin: null,
      timer: null,
      image: {
        format: '.png',
        dir: '/static/img/traffic/'
      },
      informer: {
        point: null,
        text: '',
        state: {
          icon: 'icon',
          description: 'загрузка...'
        },
        visible: true
      },
      map: {
        visible: true
      },
      states: [
        { icon: 'icon-green', description: 'Дороги свободны' },
        { icon: 'icon-green', description: 'Дороги почти свободны' },
        { icon: 'icon-green', description: 'Местами затруднения' },
        { icon: 'icon-yellow', description: 'Местами затруднения' },
        { icon: 'icon-yellow', description: 'Движение плотное' },
        { icon: 'icon-yellow', description: 'Движение затрудненное' },
        { icon: 'icon-red', description: 'Серьёзные пробки' },
        { icon: 'icon-red', description: 'Многокилометровые пробки' },
        { icon: 'icon-red', description: 'Город стоит' },
        { icon: 'icon-red', description: 'Пешком быстрее' }
      ]
    }
  },

  computed: {
    size () {
      return this.scale * 0.05 + 'px'
    },
    leftMargin () {
      return this.margin + 'px'
    },
    iconMargin () {
      return this.margin / 2 + 'px'
    }
  },

  beforeDestroy () {
    clearTimeout(this.timer)
  },

  mounted () {
    this.checkConnection()
    this.setScale()
  },

  methods: {
    checkConnection () {
      this.connect = new Connection(
        () => {
          if (this.content.offlineHide) this.isShow = true
        },
        () => {
          if (this.content.offlineHide) this.isShow = false
        },
        true
      )
      this.connect.startListen()
    },
    setScale () {
      let height = parseInt(this.$refs.informer.offsetHeight)
      let width = parseInt(this.$refs.informer.offsetWidth)
      this.scale = (height > width) ? height : width
      this.margin = width * 0.03
    },
    setInformer (visible, text = '') {
      this.leftVisible = true
      this.informer.visible = visible
      this.informer.text = text
      if (text) {
        this.informer.point = parseInt(text)
        this.informer.state = { ...this.states[this.informer.point - 1] }
      }
    },
    setMap (visible) {
      this.map.visible = visible
    },
    showLoad () {
      this.leftVisible = true
      this.informer.point = null
      this.informer.text = ''
      this.informer.state.icon = 'icon'
      this.informer.state.description = 'загрузка...'
    },
    handleError () {
      this.leftVisible = false
      this.informer.state.description = 'Нет данных'
    }
  },

  watch: {
    'content.coords' () {
      this.showLoad()
    },
    'content.template' () {
      this.timer = setTimeout(this.setScale, 10)
    },
    containerStyle () {
      this.setScale()
    }
  }

}
</script>

<style scoped>
.widget {
  color: #fff;
  height: 100%;
  width: 100%;
}

.informer {
  align-items: center;
  display: flex;
  height: 20%;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
}

.inner {
  align-items: center;
  display: flex;
  height: 50%;
  justify-content: center;
  width: 70%;
}

.inner img {
  object-fit: contain;
  height: 100%;
}

.left {
  align-items: center;
  display: flex;
  height: 100%;
}

.icon {
  display: flex;
  height: 100%;
}

.map {
  height: 80%;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.map::after {
  content: '';
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.full {
  height: 100%;
  width: 100%;
}
</style>