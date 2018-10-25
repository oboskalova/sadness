<template>
  <div class="wrapper">
    <div class="settings-panel">
      <ul class="list d-flex align-items-center">
        <li class="item align-top">
          <select v-model="options.fontFamily" @change="setFontFamily" class="small-select custom-select">
            <option v-for="f in fontFamilies" :key="f.value" :value="f.value" :style="'font-family:'+f.value">{{f.name}}</option>
          </select>
        </li>

        <li class="item font-size align-top">
          <select v-model="options.fontSize" @change="setFontSize" class="small-select custom-select">
            <option v-for="f in fontSizes" :key="f.value" :value="f.value">{{f.name}}</option>
          </select>
        </li>

        <hr class="divider">

        <li class="item align-top">
          <div class="btColor2"  @click="() => {  this.isVisibleShadowField = true; isTextColorPicker = true; }">
            <i style="margin-right:4px" class="mce-ico mce-i-forecolor"></i>
            <i style="margin-top: 6px" class="mce-caret"></i>
          </div>
          <hr class="underColorFirst" />
          <chrome id="pickerTextColor" v-model="options.pickerTextColor"
            v-show="isTextColorPicker" 
            @input="setTextColor" 
            class="color-picker" />
        </li>
        <li class="item align-top">
          <div class="btColor2" @click="() => {  this.isVisibleShadowField = true; this.isBackgroundColorPicker = true; }">
            <i style="margin-right:4px" class="mce-ico mce-i-backcolor"></i>
            <i style="margin-top: 6px" class="mce-caret"></i>
          </div>
          <hr class="underColorFirst" :style="'background-color:' + options.pickerTextColor" />
          <chrome id="pickerBackgroundColor" v-model="options.pickerBackgroundColor"
            @input="setBackgroundColor"
            v-show="isBackgroundColorPicker" class="color-picker"  />
        </li>

        <hr class="divider">

        <li class="item bt mce-ico mce-i-bold align-top" :class="{'active': options.styles.fontWeight !== ''}" @click="setBoldFontWeight">
        </li>
        <li class="item bt mce-ico mce-i-italic align-top" :class="{'active': options.styles.fontStyle !== ''}" @click="setItalicFontStyle">
        </li>
        <li class="item bt mce-ico mce-i-underline align-top" :class="{'active': options.styles.textDecoration !== ''}" @click="setUnderlineTextDecoration">
        </li>

        <hr class="divider">        
        
        <li class="item bt mce-ico mce-i-alignleft align-top" :class="{'active': options.alignType === 'left'}" @click="setAlignment('left')">
        </li>
        <li class="item bt mce-ico mce-i-aligncenter align-top" :class="{'active': options.alignType === 'center'}" @click="setAlignment('center')">
        </li>
        <li class="item bt mce-ico mce-i-alignright align-top" :class="{'active': options.alignType === 'right'}" @click="setAlignment('right')">
        </li>
        <li class="item bt mce-ico mce-i-alignjustify align-top" :class="{'active': options.alignType === 'justify'}" @click="setAlignment('justify')">
        </li>

        <hr class="divider">        
        <li class="item bt mce-ico mce-i-removeformat align-top" @click="setDefaultSettings"></li>

      </ul>
    </div>

    <div class="shadowField" @click="closeAllMenu" v-if="isVisibleShadowField"></div>
    <div class="content-panel">
      <span :style="contentStyle">{{ content }}</span>
    </div>
  </div>  
</template>

<script>
import { Chrome } from 'vue-color'
const font = require('../../../../lib/font')

export default {
  name: 'TextEditor',
  props: {
    content: {
      default: 'Text'
    },
    inputOptions: {}
  },
  components: {
    Chrome
  },
  computed: {
    contentStyle () {
      this.options.outputStyles = ''
      for (var s in this.options.styles) {
        this.options.outputStyles += this.options.styles[s]
      }
      this.$emit('styles:updated', this.options)
      return this.options.outputStyles
    }
  },
  watch: {
    inputOptions () {
      this.options = this.inputOptions
    }
  },
  data () {
    return {
      isVisibleShadowField: false,
      options: {
        pickerBackgroundColor: '#fff',
        pickerTextColor: '#000',
        alignType: 'left',
        fontSize: '24px',
        fontFamily: 'arial,helvetica,sans-serif',
        outputStyles: '',
        styles: {
          fontWeight: '',
          fontStyle: '',
          textDecoration: '',
          backgroundColor: 'background-color: rgba(0,0,0,0);',
          textColor: 'color: #000;',
          textAlign: 'display: block; text-align: left;',
          fontSize: 'font-size: 24px;',
          fontFamily: 'font-family: arial,helvetica,sans-serif;'
        }
      },
      isBackgroundColorPicker: false,
      isTextColorPicker: false,
      fontSizes: [
        {name: '8px', value: '8px'},
        {name: '9px', value: '9px'},
        {name: '10px', value: '10px'},
        {name: '11px', value: '11px'},
        {name: '12px', value: '12px'},
        {name: '14px', value: '14px'},
        {name: '18px', value: '18px'},
        {name: '24px', value: '24px'},
        {name: '30px', value: '30px'},
        {name: '36px', value: '36px'},
        {name: '48px', value: '48px'},
        {name: '60px', value: '60px'}
      ],
      fontFamilies: [
        {name: 'Roboto', value: 'Roboto'},
        {name: 'Andale Mono', value: 'andale mono,times'},
        {name: 'Arial', value: 'arial,helvetica,sans-serif'},
        {name: 'Arial Black', value: 'arial black,avant garde'},
        {name: 'Book Antiqua', value: 'book antiqua,palatino'},
        {name: 'Comic Sans MS', value: 'comic sans ms,sans-serif'},
        {name: 'Courier New', value: 'courier new,courier'},
        {name: 'Georgia', value: 'georgia,palatino'},
        {name: 'Helvetica', value: 'helvetica'},
        {name: 'Impact', value: 'impact,chicago'},
        {name: 'Tahoma', value: 'tahoma,arial,helvetica,sans-serif'},
        {name: 'Terminal', value: 'terminal,monaco'},
        {name: 'Times New Roman', value: 'times new roman,times'},
        {name: 'Trebuchet MS', value: 'trebuchet ms,geneva'},
        {name: 'Verdana', value: 'verdana,geneva'}
      ]
    }
  },
  async created () {
    let fontsInfo = await font.getFontsInfo()
    // let fontsInfo = this.$store.getters.fontsInfo
    fontsInfo.forEach(info => {
      this.fontFamilies.push({name: info.name, value: info.value})
    })
  },
  mounted () {
    this.$emit('styles:updated', this.options)
  },
  methods: {
    setBoldFontWeight () {
      this.options.styles.fontWeight = this.options.styles.fontWeight === '' ? 'font-weight: bold;' : ''
    },
    setItalicFontStyle () {
      this.options.styles.fontStyle = this.options.styles.fontStyle === '' ? 'font-style: italic;' : ''
    },
    setUnderlineTextDecoration () {
      this.options.styles.textDecoration = this.options.styles.textDecoration === '' ? 'text-decoration: underline;' : ''
    },
    setBackgroundColor (val) {
      this.options.styles.backgroundColor = `background-color: rgb(${val.rgba.r},${val.rgba.g},${val.rgba.b},${val.rgba.a});`
    },
    setTextColor (val) {
      this.options.styles.textColor = `color: ${val.hex};`
    },
    setAlignment (val) {
      this.options.alignType = val
      this.options.styles.textAlign = `display: block; text-align: ${val};`
    },
    setFontSize () {
      this.options.styles.fontSize = `font-size: ${this.options.fontSize};`
    },
    setFontFamily () {
      this.options.styles.fontFamily = `font-family: ${this.options.fontFamily};`
    },
    setDefaultSettings () {
      this.options = {
        pickerBackgroundColor: '#fff',
        pickerTextColor: '#000',
        alignType: 'left',
        fontSize: '24px',
        fontFamily: 'Verdana',
        outputStyles: '',
        styles: {
          fontWeight: '',
          fontStyle: '',
          textDecoration: '',
          backgroundColor: 'background-color: rgba(0,0,0,0);',
          textColor: 'color: #000;',
          textAlign: 'display: block; text-align: left;',
          fontSize: 'font-size: 24px;',
          fontFamily: 'font-family: verdana,geneva;'
        }
      }
    },
    closeAllMenu () {
      this.isTextColorPicker = false
      this.isBackgroundColorPicker = false
      this.isVisibleShadowField = false
    }
  }
}
</script>

<style scoped>
  .align-radio{
    display: none;
  }
  .wrapper{
    width: 100%;
  }
  .settings-panel{
    border: 1px solid rgb(212, 212, 212); 
  }
  .settings-panel > .list{
    list-style-type: none;
    padding: 1px 0px;
    margin: 0;
    line-height: 0;
  }
  .settings-panel > .list > .item{
    display: inline-block;
    max-width: 100px;
    top:0;
    position: relative;
  }
  .content-panel{
    padding: 10px;
    background-color: rgb(240, 240, 240); 
    border-radius: 7px;
    margin-top: 15px; 
    min-height: 50px;
  }
  .active{
    background: grey;
    background: #595959;
    color: white;
  }

  .custom-select{
    border: none;
    background: white;
  }

  .bt {
    width: 28px;
    height: 29px;
    padding-top: 5px;
    text-align: center;
    font-family: "tinymce", Arial;
    cursor: pointer;
  }
  .btColor2 {
    display: inline-block;
    width: 34px;
    height: 29px;
    padding-top: 5px;
    font-family: "tinymce", Arial;
    display: flex;
    justify-content: center;
  }

  .divider{
    transform: rotate(90deg); 
    background: rgb(193,193,193); 
    width: 35px; 
    margin-right: -7px; 
    margin-left: -7px; 
    display: inline-block;
  }
  
  .underColorFirst{
    height: 1.5px;
    width: 18px;
    background-color: black;
    position: absolute;
    left: 2px;
    top: 8px;
    z-index: 1;
  }

  .font-size{
    max-width: 50px !important;
  }

  .color-picker{
    position: absolute;
    z-index: 9999;
  }

  .shadowField {
    width: 100%;
    height: 100%;
    opacity: 0;
    top: 0;
    left: 0;
    border: 1px solid black;
    position: fixed;
    z-index: 999;
  }

</style>