<template>
  <div class="FontsLoader">
    <b-modal 
      v-if="isVisible"
      id="FontsModal" 
      ref="FontsModal"
      @hide="clearModal"
      centered 
      no-close-on-backdrop
      title="Загрузка шрифта">

      <div class="FontsLoader-data">
        <p>Название шрифта</p>
        <input ref="FontsLoaderTitleInput" type="text" v-model="name">
      </div>

      <input 
        type="file" 
        id="FontsLoader-input"
        class="FontsLoader-input"
        ref="FontsLoaderInput"
        @change="addFont">

      <label
        id="FontsLoader-label"
        class="FontsLoader-label"
        for="FontsLoader-input"
        ref="FontsLoaderLabel">
        Перетащите файл шрифта сюда или выберите файл с диска
        <button type="button" class="btn FontsLoader-btn-pink">Обзор файлов</button>
        
        <div class="FontsLoader-label__spinner" v-show="isSpinnerVisible" @click.stop.prevent>
          <div class="loader"></div>
        </div>
        <div class="FontsLoader-label__example" v-show="isExampleVisible">
          Аа
        </div>
      </label>

      <div class="FontsLoader-data__error">
        {{ error }}
      </div>

      <div slot="modal-footer" class="w-100">
        <button
          class="btn btn-cancel float-right"
          @click="hideModal">Отмена</button>
				<button
          class="btn btn-pink float-right"
					@click="isModify ? saveFont() : sendFont()">Сохранить</button>
			</div>
    </b-modal>
  </div>
</template>

<script>
  import { validateFont } from '../../../helpers/fonts'

  export default {
    name: 'FontsLoader',
    props: {
      isVisible: Boolean,
      settings: Object
    },
    data: () => ({
      isSpinnerVisible: false,
      error: ''
    }),
    computed: {
      name: {
        get () {
          return this.settings.name
        },
        set (value) {
          this.$emit('changeName', value)
        }
      },
      url: {
        get () {
          return this.settings.url
        },
        set (value) {
          this.$emit('changeUrl', value)
        }
      },
      isExampleVisible: {
        get () {
          return this.settings.isExampleVisible
        },
        set (value) {
          this.$emit('changeIsExampleVisible', value)
        }
      },
      isModify: {
        get () {
          return this.settings.isModify
        },
        set (value) {
          this.$emit('changeIsModify', value)
        }
      },
      family: {
        get () {
          return this.settings.family
        },
        set (value) {
          this.$emit('changeFamily', value)
        }
      }
    },
    mounted () {
      const label = this.$refs.FontsLoaderLabel;

      ['dragenter', 'dragover', 'drop'].forEach(eventName => {
        label.addEventListener(
          eventName,
          e => {
            e.preventDefault()
            e.stopPropagation()
          },
          false
        )
      })

      label.addEventListener('drop', this.dropFont)
    },
    methods: {
      dropFont (e) {
        const input = this.$refs.FontsLoaderInput
        input.files = e.dataTransfer.files
      },
      async addFont (e) {
        const input = e.target
        if (!input.files[0] && this.previousFile) {
          input.files = this.previousFile
        } else {
          this.previousFile = input.files
        }

        const previousFont = document.querySelector('#FontsLoaderExampleFont')
        if (previousFont) {
          document.head.removeChild(previousFont)
        }

        this.isExampleVisible = false
        this.isSpinnerVisible = true
        this.error = ''

        const { fontFamily, errorMessage } = await validateFont(input.files[0])
        if (errorMessage) {
          this.error = errorMessage
          input.value = ''
        }

        this.family = fontFamily
        this.isSpinnerVisible = false
        this.isExampleVisible = true
      },
      sendFont () {
        const input = this.$refs.FontsLoaderInput
        if (input.value !== '' && this.name !== '') {
          this.$emit('sendFont', {
            file: input.files[0],
            name: this.name,
            family: this.family
          })
          input.value = ''
          this.hideModal()
          this.clearModal()
        } else if (this.name === '') {
          this.$refs.FontsLoaderTitleInput.focus()
        }
      },
      saveFont () {
        const input = this.$refs.FontsLoaderInput
        const file = input.files[0] || ''
        if ((file || file === '') && this.name !== '') {
          this.$emit('saveFont', {
            file,
            name: this.name,
            family: this.family
          })
          input.value = ''
          this.hideModal()
          this.clearModal()
        } else if (this.name === '') {
          this.$refs.FontsLoaderTitleInput.focus()
        }
      },
      hideModal () {
        this.$refs.FontsModal.hide()
      },
      clearModal () {
        this.isSpinnerVisible = false
        this.isExampleVisible = false
        this.error = ''
        this.name = ''
        this.isModify = false
      }
    }
  }
</script>

<style scoped>
  .row-op {
    margin-bottom: 10px;
  }
  .btn-cancel {
    background-color: #01afb6;
  }
</style>

<style>
  .FontsLoader input[type=file]{
    display: none;
  }
  .FontsLoader label {
    cursor: pointer;
    background-color: #e5e5e5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 56px 0 56px;
    font-size: 14px;
    position: relative;
    text-align: center;
  }
  .FontsLoader label:hover .btn {
    box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);	
  }
  .FontsLoader label .btn {
    pointer-events: none;
    margin-top: 30px;
    background-color: #01afb6;
  }
  .FontsLoader-label__spinner, .FontsLoader-label__example {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .FontsLoader-label__spinner {
    background-color: #e5e5e5;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
  }
  .FontsLoader-label__example {
    width: calc(100% + 1px);
    height: calc(100% + 2px);
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 45px;
    font-family: 'FontsLoaderExampleFont';
    border: 1px solid #e5e5e5;
  }
  .FontsLoader-data {
    position: relative;
    margin-bottom: 20px;
  }
  .FontsLoader-data p {
    margin-bottom: 0px;
  }
  .FontsLoader-data__title{
    font-size: 18px;
    padding: 32px 0 20px;
  }
  .FontsLoader-data__error {
    font-size: 14px;
    color: red;
    font-weight: 400;
    margin: 14px 0 0;
  }

  .FontsLoader .loader,
  .FontsLoader .loader:before,
  .FontsLoader .loader:after {
    border-radius: 50%;
  }
  .FontsLoader .loader {
    color: #00b0b7;
    font-size: 11px;
    text-indent: -99999em;
    margin: 55px auto;
    position: relative;
    width: 10em;
    height: 10em;
    box-shadow: inset 0 0 0 1em;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
  }
  .FontsLoader .loader:before,
  .FontsLoader .loader:after {
    position: absolute;
    content: '';
  }
  .FontsLoader .loader:before {
    width: 5.2em;
    height: 10.2em;
    background: #e5e5e5;
    border-radius: 10.2em 0 0 10.2em;
    top: -0.1em;
    left: -0.1em;
    -webkit-transform-origin: 5.2em 5.1em;
    transform-origin: 5.2em 5.1em;
    -webkit-animation: load2 2s infinite ease 1.5s;
    animation: load2 2s infinite ease 1.5s;
  }
  .FontsLoader .loader:after {
    width: 5.2em;
    height: 10.2em;
    background: #e5e5e5;
    border-radius: 0 10.2em 10.2em 0;
    top: -0.1em;
    left: 5.1em;
    -webkit-transform-origin: 0px 5.1em;
    transform-origin: 0px 5.1em;
    -webkit-animation: load2 2s infinite ease;
    animation: load2 2s infinite ease;
  }
  @-webkit-keyframes load2 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load2 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>
