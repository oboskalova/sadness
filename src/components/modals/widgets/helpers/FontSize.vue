<template>
  <div class="tm-font-size-wrapper">
    <div v-show="!sizesMenu" class="tm-fontSize" @click="inputFocus">{{fontSizeStr}}</div>
    <div v-show="sizesMenu">
      <input class="tm-inputFont" ref="handInput" v-model="fontSize" 
      @keydown="keyDownEvent($event)" @keydown.enter="enterEvent" @change="inputFocus" type="number" min="1" max="100" step="1">
      <li class="tm-block-sizes tm-moreIndex">        
          <p v-for="(size, key) in sizes" :key="key" class="tm-sizesTarget"
            @click="chanheFontSize(size)"> {{size}} </p>
      </li>
    </div>
  </div>
</template>

<script>

import settingsList from '../../../../../helpers/fonts-color-sizes.js'

export default {
  props: ['editor'],
  mounted () {
    let wrapper = document.getElementById('FontSize')
    if (wrapper) wrapper.id = null
    const editor = this.$props.editor
    editor.contentDocument.addEventListener('click', () => { this.sizesMenu = false })

    editor.on('NodeChange', (e) => {
      if (!this.lockNodeChange) {
        this.lockFontSize = true
        this.fontSizeStr = editor.queryCommandValue('fontsize')
        this.fontSize = parseInt(this.fontSizeStr)
      } else this.lockNodeChange = false
    })
  },
  data () {
    return {
      sizes: settingsList.sizes,
      fontSize: 16,
      fontSizeStr: '16px',
      lockNodeChange: false,
      lockFontSize: false,
      sizesMenu: false
    }
  },
  methods: {
    chanheFontSize (size) {
      if (size) {
        this.lockFontSize = true
        this.fontSize = size
        this.inputFocus()
      }
      this.lockNodeChange = true
      this.$props.editor.execCommand('fontSize', false, `${this.fontSize}px`)
    },
    enterEvent () {
      this.chanheFontSize()
      this.sizesMenu = false
    },
    inputFocus () {
      this.sizesMenu = true
      this.$nextTick(() => {
        this.$refs.handInput.focus()
      })
    },
    keyDownEvent (e) {
      this.lockFontSize = true
    }
  },
  watch: {
    fontSize () {
      if (!this.lockFontSize) {
        this.fontSize = parseInt(this.fontSize)
        if (Number.isInteger(this.fontSize)) this.chanheFontSize()
      } else this.lockFontSize = false
    }
  }
}
</script>

<style scoped>
  .tm-block-sizes {
    position: absolute;
    background: white;
    top: 40px;
    left: -15px;
    overflow: auto;
    width: 80px;
    height: 150px;
    border: 1px solid black;
  }

  .tm-moreIndex {
    z-index: 9999999;
  }

  .tm-sizesTarget {
    box-sizing: border-box;
    padding-left: 20px;
    line-height: 30px;
    margin: 0;
  }

  .tm-sizesTarget:hover {
    background: #b3bdba;
    color: white;
  }

  .tm-font-size-wrapper li {
    list-style: none;
  }

  .tm-inputFont {
    width: 50px;
  }

  .tm-fontSize {
    width: 45px;
    height: 21px;
    padding-top: 7px;
    font-size: 15px;  
  }

  .tm-fontSize:hover {
    outline: 1px solid rgb(192, 192, 192);
  }
</style>

