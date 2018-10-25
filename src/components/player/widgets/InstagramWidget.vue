<template>
  <div class="instagram" style="height: 100%;">
    <div v-if="isShow" class="instagram-wrapper" :style="wrapperStyleObj">
      <instagram :content="content" :options="options"></instagram>
    </div>
    <div v-else-if="!offlineHide" :style="styleErr">Отсутствует соединение с интернетом</div>
  </div>
</template>

<script>
import Vue from 'vue'
import Connection from './helpers/Connection'
import instagram from '../../widgets/components/Instagram'
import Lib from '../../../lib'

export default {
  name: 'media-twitter',
  props: ['content', 'containerStyle'],
  components: { instagram },
  created () {
    this.isShow = navigator ? navigator.onLine : true
  },
  mounted () {
    if (this.reloadTime > 0) {
      this.reloadTimer = setInterval(() => this.reload(), 60 * this.reloadTime * 1000)
    }
    this.connect = new Connection(
      () => {
        if (this.offlineHide) this.isShow = true
        this.reload()
      },
      () => { if (this.offlineHide) this.isShow = false },
      false
    )
    this.connect.startListen()
  },
  beforeDestroy () {
    clearTimeout(this.reloadTimer)
    if (this.connect) this.connect.stopListen()
  },
  data () {
    return {
      connect: null,
      isShow: true,
      reloadTimer: null
    }
  },
  computed: {
    contentId () {
      return this.content.id
    },
    contentProp () {
      return this.content
    },
    wrapperStyleObj () {
      return {
        width: '100%',
        height: '100%'
      }
    },
    styleErr () {
      return {
        height: '100%',
        marginTop: '20%',
        textAlign: 'center'
      }
    },
    options () {
      return {
        width: Lib.pxStrToNumber(this.containerStyle.width),
        height: Lib.pxStrToNumber(this.containerStyle.height)
      }
    }
  },
  methods: {
    reload () {
      console.log('reload instagram')
      if (navigator && navigator.onLine) {
        this.isShow = false
        let self = this
        Vue.nextTick(() => {
          self.isShow = true
        })
      }
    }
  },
  watch: {
    // для правильной смены подряд идущих Media
    contentProp () {
      this.isShow = navigator ? navigator.onLine : true
      if (this.isShow) this.reload()
    }
  }
}
</script>

<style scoped>
</style>
