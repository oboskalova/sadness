<template>
	<div ref="parser" class="text-content text-parser" v-html="text"></div>
</template>

<script>
import axios from 'axios'
import parserXmlLight from 'xml2json-light'
import JsonTree from './JsonTree/index'

export default {
  name: 'parser',
  props: ['content'],
  data () {
    return {
      nextTimerId: null,
      text: ''
    }
  },
  created () {
    this.onCreated()
  },
  beforeDestroy () {
    if (this && this.nextTimerId) clearInterval(this.nextTimerId)
  },
  computed: {
    scale () {
      return this.$store.getters.scale
    },
    tree () {
      return this.content.tree
    },
    refreshTime () {
      let res = Number(this.content.refresh * 60 * 1000)
      // if (res - 50000 > 0) res -= 50000
      return res > 0 ? res : 0
    }
  },
  methods: {
    onCreated () {
      this.refreshText()
      clearInterval(this.nextTimerId)
      console.log(this.refreshTime)
      if (this.refreshTime) {
        console.log('create timer')
        this.nextTimerId = setInterval(() => {
          this.refreshText()
        }, this.refreshTime)
      }
    },
    getDataByUrl () {
      return new Promise((resolve, reject) => {
        let jsonRes = null
        axios.get('https://visionproxy.cubicservice.ru?url=' + this.content.link)
          .then(res => {
            console.log(res)
            if (res && res.status !== 200) {
              reject(new Error('Parser - Не удалось получить данные'))
            } else {
              try {
                if (this.content.isXml) jsonRes = parserXmlLight.xml2json(res.data)
                else {
                  if (res.data instanceof String) {
                    jsonRes = JSON.parse(res.data)
                  } else if (res.data instanceof Object) {
                    jsonRes = res.data
                  } else throw new Error('Данные невалидны')
                }
                resolve(jsonRes)
              } catch (e) {
                reject(new Error('Parser - Парсинг потерпел неудачу'))
              }
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    async refreshText () {
      console.log('refresh parser test')
      let data = null
      try {
        data = await this.getDataByUrl()
      } catch (e) {
        console.log(e)
      }
      if (data) {
        let checks = JsonTree.checkInfo(this.tree.root)
        this.tree.root = JsonTree.parsedData(data, checks)
        console.log('Parser: данные по ссылке:' + this.content.link + ' получены')
        console.log(data)
        console.log(this.tree.root)
        console.log(this.tree.tokenText)
      } else {
        console.log('Parser: данные по ссылке:' + this.content.link + ' не были получены')
        console.log('Будут использованы данные, полученные впрошлый раз')
      }
      this.text = JsonTree.toText(this.tree)
      console.log(this.text)
    }
  }
}
</script>

<style scoped>
  .text-parser {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>