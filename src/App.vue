<template>
  <div id="app">
    <TheHeader v-if="$route.path.indexOf('agreements') === -1" /> 
    <router-view></router-view>
  </div>
</template>

<script>
import TheHeader from './components/common/TheHeader'
import User from '../helpers/user'
import axios from 'axios'
import { baseUrl } from '../api/config'
import SocketAPI from '../api/sockets'
import VueTouchKeyboard from "vue-touch-keyboard";
import style from "vue-touch-keyboard/dist/vue-touch-keyboard.css"; // load default style
export default {
  name: 'app',
  components: {
    TheHeader
  },
  methods: {
    connectSocket () {
      SocketAPI.install(this.$store)
    }
  },
  created () {
    this.$root.sockets = SocketAPI
    if (User.isAuth()) {
      var connect = true
      axios.get(baseUrl + '/isValid')
      .catch(response => {
        User.signOut()
        connect = false
        this.$router.push('/auth')
      })
      if (connect) {
        this.connectSocket()
      }
    }
  }
}
</script>

<style>
@import './assets/css/fonts.css';
@import './assets/css/general.css';
@import './assets/css/scroller.css';
</style>
