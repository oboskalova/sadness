<template>
  <b-container ref="container" fluid class="p-0">
    <b-row v-for="row in rows" :key="row.key" :style="rowStyle">
      <b-col class="p-0" v-for="post in row" :key="post.key" :style="colStyle">
        <b-img fluid :src="post.link" :style="imgStyle"/>
      </b-col>
    </b-row> 
    <b-img v-if="content.isNextTime" fluid :src="bigPost.link" :style="bigImgStyle"/>
    <div v-if="content.isNextTime" :style="bigTextStyle">{{bigPost.text}}</div>
    <b-img v-if="content.isNextTime" rounded :style="bigAvatarStyle" :src="bigPost.profileImg"/>
    <div v-if="content.isNextTime" :style="userStatusStyle">{{bigPost.username}}</div>
  </b-container>
</template>

<script>
import Instagram from '../helpers/Instagram'

export default {
  name: 'insta-cards',
  props: ['content', 'options'],
  created () {
    this.onCreated()
  },
  beforeDestroy () {
    clearInterval(this.nextTimerId)
    clearInterval(this.refreshTimerId)
  },
  data () {
    return {
      rows: [],
      bigPostInd: 0,
      refreshTimerId: null,
      nextTimerId: null,
      instagram: new Instagram(),
      postList: []
    }
  },
  methods: {
    refreshPosts () {
      let apiMedia = this.content.isHashtag ? this.instagram.apiTagMedia : this.instagram.apiSelfMedia
      apiMedia = apiMedia.bind(this.instagram)
      let params = { token: this.content.instaToken, hashtag: this.content.hashtag }
      apiMedia(params)
        .then((postList) => {
          this.postList = postList
          this.rowsInit()
          this.startNext()
        })
        .catch(err => console.log(err))
    },
    onCreated () {
      this.refreshPosts()
      clearInterval(this.refreshTimerId)
      if (this.refreshTime) {
        this.refreshTimerId = setInterval(() => {
          this.refreshPosts()
        }, this.refreshTime)
      }
    },
    rowsInit () {
      let postsHoriz = Number(this.content.postsHoriz)
      let postsVertic = Number(this.content.postsVertic)
      let postList = this.postList
      let rows = []
      let row = []
      for (let ind = 0; ind < postList.length; ind++) {
        if (rows.length >= postsVertic) break
        let curPost = postList[ind]
        row.push(curPost)
        if (row.length >= postsHoriz) {
          rows.push(row.slice())
          row = []
        }
      }
      this.rows = rows
      console.log('rows', this.rows)
    },
    startNext () {
      if (this.content.isNextTime && this.content.nextTime) {
        this.nextTimerId = setInterval(() => {
          this.bigPostInd += 1
          if (this.bigPostInd >= this.bigPostLength) {
            this.bigPostInd = 0
          }
        }, this.content.nextTime * 1000)
      }
    }
  },
  computed: {
    colStyle () {
      return {
        width: '100%',
        height: '100%'
      }
    },
    rowStyle () {
      let postsVertic = Number(this.content.postsVertic)
      return {
        width: '100%',
        height: `${100 / postsVertic}%`,
        marginLeft: '0px',
        marginRight: '0px'
      }
    },
    imgStyle () {
      return {
        height: `${this.options.height / this.content.postsVertic}px`,
        width: '100%',
        pointerEvents: 'none',
        filter: `brightness(${this.content.isNextTime ? '0.55' : '1'})`
      }
    },
    bigImgStyle () {
      return {
        width: '100%',
        height: '100%',
        transform: 'scale(0.44)',
        transformOrigin: '0 0',
        position: 'absolute',
        top: '28%',
        left: '10%',
        filter: 'brightness(1.2)'
      }
    },
    bigTextStyle () {
      return {
        position: 'absolute',
        top: '28%',
        left: '54%',
        padding: '0.5% 10% 0% 2%',
        fontSize: `${12 * this.options.width / 620}px`,
        color: '#ffffff',
        fontFamily: 'Roboto, Helvetica, Arial, Tahoma, sans-serif',
        overflow: 'hidden',
        height: `${this.options.height * 0.33}px`,
        visibility: `${(this.options.height * 0.08 * 5) < this.options.width ? 'visible' : 'hidden'}`
      }
    },
    bigAvatarStyle () {
      return {
        position: 'absolute',
        top: `calc(29% + ${this.options.height * 0.35}px)`,
        left: '56%',
        width: `${this.options.height * 0.08}px`,
        height: `${this.options.height * 0.08}px`,
        borderRadius: '5px',
        visibility: `${(this.options.height * 0.08 * 5) < this.options.width ? 'visible' : 'hidden'}`
      }
    },
    userStatusStyle () {
      return {
        position: 'absolute',
        top: `calc(29% + ${this.options.height * 0.35}px)`,
        left: `calc(58% + ${this.options.height * 0.08}px)`,
        fontSize: `${12 * this.options.width / 620}px`,
        color: '#ffffff',
        fontFamily: 'Roboto, Helvetica, Arial, Tahoma, sans-serif',
        visibility: `${(this.options.height * 0.08 * 5) < this.options.width ? 'visible' : 'hidden'}`
      }
    },
    bigPostLength () {
      let postsHoriz = Number(this.content.postsHoriz)
      let postsVertic = Number(this.rows.length)
      return postsHoriz * postsVertic
    },
    bigPost () {
      return this.postList[this.bigPostInd]
    },
    refreshTime () {
      let res = Number(this.content.refresh * 60 * 1000)
      return res > 0 ? res : 0
    }
  }
}
</script>

<style scoped>
</style>
