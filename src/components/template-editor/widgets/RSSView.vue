<template>
  <div class="content" :style="contentStyleObj" v-show="isShow">
    <div v-for="(page, indexQ) in rssElements"
      v-show="indexQ == activePage || content.mode == 'vertical' || content.mode == 'paging'" class=""
      :key="indexQ" :id="'page'+indexQ" 
      :class="{'fade-rss': content.mode == 'fade'}">
      <div class="row wrapper">
        <div v-for="(item, index) in rssElements[indexQ]" :key="index"
          v-if="content.settings.layoutType == 'layout1'" class="col-12 align-self-stretch">
          <div class="row">
            <div class="col-3" v-if="content.settings.dataSelection.includes('image') && item.imageUrl">
              <img width="100%" :src="item.imageUrl" />
            </div>
            <div class="col-9">
              <span v-if="content.settings.dataSelection.includes('title')" :style="content.settings.headerOptions.outputStyles">
                {{ item.title }}
              </span>
              <p>
                <span v-if="content.settings.dataSelection.includes('timestamp')" class="inline" 
                  :style="content.settings.timestampOptions.outputStyles">
                  {{ new Date(item.pubDate).toLocaleDateString() }}
                </span>
                <span 
                  v-if="content.settings.dataSelection.includes('author') && content.settings.dataSelection.includes('timestamp')">
                  -
                </span>
                <span v-if="content.settings.dataSelection.includes('author')" 
                  :style="content.settings.authorOptions.outputStyles" class="inline">
                  {{ item.author || rss.managingEditor }}
                </span>
              </p>
              <span v-if="content.settings.descriptionType.isFull" :style="content.settings.descriptionOptions.outputStyles">
                {{ item.description + '...' }}
              </span>
              <span v-if="!content.settings.descriptionType.isFull && item.description" :style="content.settings.descriptionOptions.outputStyles">
                {{ item.description.slice(0,content.settings.descriptionType.charactersNumber) + '...' }}
              </span>
            </div>
          </div>
          <div class="divider" :style="styleOptions"></div>
        </div>
  
        <div v-for="(item,index) in rssElements[indexQ]" :key="index"
          v-if="content.settings.layoutType == 'layout2'" class="col-12" :style="styleOptions">
          <div class="row">
            <div class="col-12">
              <span v-if="content.settings.dataSelection.includes('title')" 
                :style="content.settings.headerOptions.outputStyles">
                {{ item.title }}
              </span>
              <span v-if="content.settings.dataSelection.includes('timestamp')" 
                :style="content.settings.timestampOptions.outputStyles" class="inline">
                {{ new Date(item.pubDate).toLocaleDateString() }}
              </span>
              <span v-if="content.settings.dataSelection.includes('author') && content.settings.dataSelection.includes('timestamp')">
                -
              </span>
              <span v-if="content.settings.dataSelection.includes('author')"
                :style="content.settings.authorOptions.outputStyles" class="inline">
                {{ item.author || rss.managingEditor }}
              </span>
            </div>
            <div class="col-3" v-if="content.settings.dataSelection.includes('image') && item.imageUrl" >
              <img width="100%" :src="item.imageUrl" />
            </div>
            <div class="col-9">
              <span v-if="content.settings.descriptionType.isFull" :style="content.settings.descriptionOptions.outputStyles">
                {{ item.description + '...' }}
              </span>
              <span v-if="!content.settings.descriptionType.isFull && item.description" :style="content.settings.descriptionOptions.outputStyles">
                {{ item.description.slice(0,content.settings.descriptionType.charactersNumber) + '...' }}
              </span>
            </div>
          </div>
        </div>
  
        <div v-for="(item,index) in rssElements[indexQ]" :key="index"
          v-if="content.settings.layoutType == 'layout3'" class="col-12" :style="styleOptions">
          <div class="row">
            <div class="col-12">
              <img v-if="content.settings.dataSelection.includes('image')" width="100%" :src="item.imageUrl" />
            </div>
          </div>
        </div>
  
        <div v-for="(item,index) in rssElements[indexQ]" :key="index"
          v-if="content.settings.layoutType == 'layout4'" class="col-12" :style="styleOptions">
          <div class="row d-flex justify-content-center">
            <div class="col-12">
              <img v-if="content.settings.dataSelection.includes('image') && item.imageUrl" width="100%" :src="item.imageUrl" />
              <span v-if="content.settings.dataSelection.includes('title')" 
                :style="content.settings.headerOptions.outputStyles">
                {{ item.title }}
              </span>
              <p>
                <span v-if="content.settings.dataSelection.includes('timestamp')" 
                  :style="content.settings.timestampOptions.outputStyles" class="inline">
                  {{ new Date(item.pubDate).toLocaleDateString() }}
                </span>
                <span 
                  v-if="content.settings.dataSelection.includes('author') && 
                  content.settings.dataSelection.includes('timestamp')"
                  :style="content.settings.headerOptions.outputStyles" class="inline">
                  -
                </span>
                <span v-if="content.settings.dataSelection.includes('author')" 
                  :style="content.settings.authorOptions.outputStyles" class="inline">
                  {{ item.author || rss.managingEditor }}
                </span>
              </p>
              <div>
                <span v-if="content.settings.descriptionType.isFull" :style="content.settings.descriptionOptions.outputStyles">
                  {{ item.description + '...' }}
                </span>
                <span v-if="!content.settings.descriptionType.isFull && item.description" :style="content.settings.descriptionOptions.outputStyles">
                  {{ item.description.slice(0,content.settings.descriptionType.charactersNumber) + '...' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="horizontal-wrapper">
          <div class="horizontal-item" 
          v-for="(item,index) in rssElements[indexQ]" :key="index" 
          v-if="content.settings.layoutType == 'horizontal'" 
          :style="styleOptions">
            <div class="col d-flex align-items-center">
              <div v-if="content.settings.dataSelection.includes('title')" 
                :style="content.settings.headerOptions.outputStyles">
                {{ item.title }}:&nbsp;
              </div>
              <div v-if="content.settings.descriptionType.isFull" :style="content.settings.descriptionOptions.outputStyles">
                {{ item.description + '...' }}
              </div>
              <div v-if="!content.settings.descriptionType.isFull && item.description" :style="content.settings.descriptionOptions.outputStyles">
                {{ item.description.slice(0,content.settings.descriptionType.charactersNumber) + '...' }}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Scroller from '@/components/player/widgets/helpers/Scroller.js'
import snabbt from 'snabbt.js'
import axios from 'axios'
import Connection from '@/components/player/widgets/helpers/Connection'

export default {
  name: 'media-rss-view',
  props: {
    content: {
      default: () => {}
    },
    settings: {
      default: () => {}
    },
    componentType: {
      default: 'view'
    }
  },
  created () {
    this.onCreated()
  },
  mounted () {
    this.onMounted()
  },
  data () {
    return {
      isShow: true,
      activePage: 0,
      scroller: null,
      nextTimerId: null,
      interval: null,
      rss: {
        managingEditor: this.content.settings.managingEditor,
        itemElements: []
      },
      prevLength: 0
    }
  },
  computed: {
    rssElements () {
      if (this.content.settings && this.rss.itemElements) {
        this.onMounted()
        return this.rss.itemElements
      } else {
        return []
      }
    },
    styleOptions () {
      let style = ''

      if (this.content.settings.isSeparatorShown) {
        style += `border-bottom: ${this.content.settings.borderPx}px solid ${this.content.settings.borderColor};`
      } else {
        style = ''
      }

      return style
    },
    scale () {
      return this.$store.getters.scale
    },
    contentStyleObj () {
      const s = this.scale
      const p = this.settings
      let res = {}
      if (p) {
        res.height = `${p.height}px`
        res.width = `${p.width}px`
        res.transform = `scaleX(${s}) scaleY(${s})`
        res.transformOrigin = '0 0'
      }

      res.overflow = 'hidden'
      return res
    },
    refreshTime () {
      let res = Number(this.content.settings.refresh * 60 * 1000)
      return res > 0 ? res : 0
    }
  },
  methods: {
    onCreated () {
      this.getUrlData()
      clearInterval(this.nextTimerId)
      if (this.refreshTime) {
        this.nextTimerId = setInterval(() => {
          this.getUrlData()
        }, this.refreshTime)
      }
    },
    checkConnection () {
      this.connect = new Connection(
        () => {
          if (this.content.settings.offlineHide) this.isShow = true
        },
        () => { if (this.content.settings.offlineHide) this.isShow = false },
        true
      )
      this.connect.startListen()
    },
    onMounted () {
      this.checkConnection()
      let self = this
      this.$nextTick(() => {
        self.isShow = true
        if (self.componentType !== 'player') {
          return
        }

        if (self.content.mode === 'vertical' || self.content.mode === 'paging') {
          self.setScrolling()
        } else if (self.content.mode === 'horizontal') {
          self.setHorizontal()
        } else {
          self.setQueuChanging()
        }
      })
    },
    setScrolling () {
      let contentDiv = this.$el
      if (this.content.mode === 'vertical' || (this.content.mode === 'paging' && !this.scroller && contentDiv)) {
        var self = this
        this.scroller = new Scroller(contentDiv, {
          speed: self.content.speed,
          transition: self.content.transition,
          delay: self.content.delay,
          mode: self.content.effectMode,
          leave: self.content.leave,
          type: self.content.mode
        })

        this.scroller.startPlay()
      } else if (this.content.mode !== 'vertical' || this.content.mode === 'paging') {
        this.scroller = null
      }
    },
    setHorizontal () {
      let contentDiv = this.$el
      if (this.content.mode === 'horizontal') {
        var self = this
        this.scroller = new Scroller(contentDiv, {
          speed: self.content.speed * 2,
          transition: 0,
          delay: self.content.delay,
          mode: 'loop',
          leave: self.content.leave,
          type: self.content.mode
        })

        this.$nextTick(() => {
          this.$el.innerHTML = this.scroller.initHtml()
          this.scroller.startPlay()
        })
      } else if (this.content.mode !== 'horizontal') {
        this.scroller = null
      }
    },
    setQueuChanging () {
      if (this.content.mode === 'fade') {
        this.setFadingEffect()
      } else if (this.content.mode === 'none') {
        this.setNoneEffect()
      }
    },
    setFadingEffect () {
      var contentDiv = this.$el
      let animObj1 = {
        fromOpacity: 0,
        opacity: 1,
        easing: 'linear',
        duration: 1500
      }

      let animObj2 = {
        delay: this.content.delay * 1000,
        easing: 'linear'
      }

      let animObj3 = {
        fromOpacity: 1,
        opacity: 0,
        easing: 'linear',
        duration: 1500,
        allDone: this.onEffectDone
      }

      snabbt.sequence([
        [contentDiv, animObj1],
        [contentDiv, animObj2],
        [contentDiv, animObj3]
      ])
    },
    setNoneEffect () {
      var contentDiv = this.$el

      let animObj1 = {
        delay: this.content.delay * 1000,
        easing: 'linear',
        allDone: this.onEffectDone
      }

      snabbt.sequence([[contentDiv, animObj1]])
    },
    onEffectDone () {
      if (this.activePage < this.rss.itemElements.length - 1) {
        this.activePage += 1
      } else {
        this.activePage = 0
      }

      this.setQueuChanging()
    },
    getUrlData () {
      axios.get('https://visionproxy.cubicservice.ru?url=' + this.content.settings.rssUrl)
        .then((response) => {
          if (!response.data) {
            return
          }
          this.setRssData(response.data)
        })
    },
    setRssData (rssdata) {
      this.rss.itemElements = []
      var parser = new DOMParser()
      var rssDom = parser.parseFromString(rssdata, 'text/xml')

      var arrayToPush = []
      var itemElements = rssDom.getElementsByTagName('item')
      this.rss.managingEditor = rssDom.getElementsByTagName('managingEditor')[0] ? rssDom.getElementsByTagName('managingEditor')[0].innerHTML : ''

      for (var i = 0; i < itemElements.length; i++) {
        if (Number(this.content.settings.maxQueueItems) === i) {
          break
        }

        let valueToPush = {}
        for (var j = 0; j < itemElements[i].childNodes.length; j++) {
          let currentValue = itemElements[i].childNodes[j]
          if (currentValue.nodeName === 'enclosure') {
            let type = this.getAttributeFromValue('type', currentValue)
            if (type === 'image/jpeg' || type === 'image/jpg' || type === 'image/png') {
              valueToPush.imageUrl = this.getAttributeFromValue('url', currentValue)
            }
          }
          if (currentValue.nodeName === 'itunes:image') {
            valueToPush.imageUrl = this.getAttributeFromValue('href', currentValue)
          }
          if (currentValue.nodeName === 'title') {
            valueToPush.title = currentValue.textContent
          }
          if (currentValue.nodeName === 'description') {
            valueToPush.description = currentValue.textContent
          }
          if (currentValue.nodeName === 'pubDate') {
            valueToPush.pubDate = currentValue.textContent
          }
          if (currentValue.nodeName === 'author') {
            valueToPush.author = currentValue.textContent
          }
        }

        if (arrayToPush.length < this.content.settings.itemsToShow) {
          arrayToPush.push(valueToPush)
        }

        let itemsAdded = this.rss.itemElements.length * Number(this.content.settings.itemsToShow)
        let itemsToAdd = this.content.settings.maxQueueItems - itemsAdded
        if (arrayToPush.length === Number(this.content.settings.itemsToShow) ||
          (arrayToPush.length < Number(this.content.settings.itemsToShow) && arrayToPush.length === itemsToAdd)) {
          this.rss.itemElements.push(arrayToPush)
          arrayToPush = []
        }
      }
    },
    getAttributeFromValue (attrName = '', value = {}) {
      for (var attrIndex = 0; attrIndex < value.attributes.length; attrIndex++) {
        let attr = value.attributes[attrIndex]
        if (attr.nodeName === attrName) {
          return attr.nodeValue
        }
      }
    }
  }
}
</script>
<style scoped>
  .content {
    position: relative;
    height: 100%;
  }

  .wrapper {
    height: 100%;
  }

  .wrapper>div {
    margin-top: 10px;
    margin-bottom: 10px;
    position: relative;
  }

  .divider {
    width: 100%;
    margin-top: 20px;
  }
  
  .inline {
    display: inline-block !important;
  }
  
  .horizontal-wrapper {
    white-space: nowrap;
    display: inline-flex;
    width: auto;
  }

  .horizontal-item {
    width: auto; 
    margin-right: 15px; 
    display: inline-flex;
    flex-wrap:nowrap;
  }
</style>