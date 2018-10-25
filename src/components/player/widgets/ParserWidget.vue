<template>
  <parser ref="parser" v-if="isShow" class="parser" :content="content"></parser>
  <div v-else-if="!offlineHide" class="error" >Отсутствует соединение с интернетом</div>
</template>

<script>
import Vue from 'vue'
import Connection from './helpers/Connection'
import parser from '../../widgets/components/Parser'

export default {
  name: 'media-iframe',
  props: ['content'],
  components: { parser },
  created () {
    this.isShow = navigator ? navigator.onLine : true
  },
  mounted () {
    this.connect = new Connection(
      () => { this.refresh() },
      () => { this.isShow = false },
      false
    )
    this.connect.startListen()
  },
  beforeDestroy () {
    this.connect.stopListen()
  },
  data () {
    return {
      connect: null,
      isShow: true
    }
  },
  computed: {
    offlineHide () {
      return Boolean(this.content.offlineHide)
    },
    contentProp () {
      return this.content
    }
  },
  methods: {
    refresh () {
      this.isShow = false
      let self = this
      Vue.nextTick(() => {
        self.isShow = navigator ? navigator.onLine : true
      })
    }
  },
  watch: {
    // для правильной смены подряд идущих Media
    contentProp () {
      this.refresh()
    }
  }
}
</script>

<style scoped>
  .error {
    height: 100%;
    text-align: center;
  }
  .parser {
    height: 100%;
  }
</style>
