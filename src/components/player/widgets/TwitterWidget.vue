<template>
  <div class="twitter" style="height: 100%;">
    <div v-if="isShow" class="timeline-wrapper" :style="wrapperStyleObj">
      <twitter class="tweet" :content="content" :options="options"></twitter>
    </div>
    <div v-else-if="!offlineHide" :style="styleErr">Отсутствует соединение с интернетом</div>
  </div>
</template>

<script>
import Vue from 'vue'
import Connection from './helpers/Connection'
import twitter from '../../widgets/components/Twitter'
import Lib from '../../../lib'

export default {
  name: 'media-twitter',
  props: ['content', 'containerStyle'],
  components: { twitter },
  created () {
    this.isShow = navigator ? navigator.onLine : true
  },
  mounted () {
    // console.log('mounted')
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
      let res = {}
      res.width = '100%'
      res.height = '100%'
      return res
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
        width: Lib.pxStrToNumber(this.containerStyle.width)
      }
    }
  },
  methods: {
    reload () {
      console.log('reload timeline')
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
