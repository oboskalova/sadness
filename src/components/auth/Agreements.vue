<template>
  <div v-show="isShow" class="container-fluid agreements-container">
    <div class="row agreements-row">
      <div class="col agreements-col">
        <user-agreement v-if="isFirstAgreement" :isNext="isShowCheckBoxes" @onNext="userNext" @onPrev="userPrev"></user-agreement>
        <privacy-agreement v-else :isNext="isShowCheckBoxes" @onNext="privacyNext" @onPrev="privacyPrev"></privacy-agreement>
      </div>
    </div>
  </div>
</template>

<script>
import UserAgreement from './UserAgreement'
import PrivacyAgreement from './PrivacyAgreement'
import User from '../../../helpers/user'
import UserAPI from '../../../api/user'
import axios from 'axios'
import { baseUrl } from '../../../api/config'

export default {
  name: 'agreements',
  components: {
    'user-agreement': UserAgreement,
    'privacy-agreement': PrivacyAgreement
  },
  data () {
    return {
      isShow: false,
      isShowCheckBoxes: false,
      isAcceptUser: false,
      isAcceptPrivacy: false,
      modalActive: false,
      isFirstAgreement: true
    }
  },
  computed: {
    agreeName () {
      return this.$route.params.name
    }
  },
  watch: {
    agreeName (val) {
      switch (val) {
        case 'user':
          this.isShow = true
          this.isFirstAgreement = true
          break
        case 'privacy':
          this.isShow = true
          this.isFirstAgreement = false
          break
        default:
          this.isShow = false
          break
      }
    }
  },
  created () {
    console.log('created ' + this.$route.params.name)
    let paramsName = this.$route.params.name
    switch (paramsName) {
      case 'user':
        this.isFirstAgreement = true
        break
      case 'privacy':
        this.isFirstAgreement = false
        break
      default:
        paramsName = null
        break
    }
    if (User.isAccepted() && paramsName) this.isShow = true
    else {
      if (User.isAuth()) {
        UserAPI.getPassport(response => {
          console.log('success')
          console.log(response)
          if (!response.accepted) {
            this.isShow = true
            this.isShowCheckBoxes = true
          } else {
            localStorage.setItem('cms-accepted', 'true')
            this.$router.push('/')
          }
        }, err => {
          console.log('error')
          console.log(err)
          // this.$router.push('/auth')
          this.$router.go({ path: '/auth', forse: true })
        })
      } else if (paramsName) {
        this.isShow = true
      }
    }
  },
  methods: {
    userNext () {
      this.isFirstAgreement = false
    },
    userPrev () {
      this.$router.go({ path: '/auth', forse: true })
    },
    privacyNext () {
      this.sendAcceptOnServer()
    },
    privacyPrev () {
      this.isFirstAgreement = true
    },
    sendAcceptOnServer () {
      axios.post(baseUrl + '/users/accept')
        .then(res => {
          localStorage.setItem('cms-accepted', 'true')
          this.$router.push('/')
        })
        .catch(err => {
          console.error(err)
          this.$router.go({ path: '/auth', forse: true })
        })
    }
  }
}
</script>

<style scoped>
  .agreements-row {
   height: 100vh;
  }
  .agreements-col {
    padding-top: 20px;
  }
</style>

