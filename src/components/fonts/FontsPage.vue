<template>
  <div>

    <FontsTable
      @modifyFont="modifyFont"
      @deleteFont="openDeleteModal"
      :fonts="fonts"
      :isLoading="isLoading"/>

    <FontsLoader
      @sendFont="sendFont"
      @saveFont="saveFont"
      @changeName="changeName"
      @changeUrl="changeUrl"
      @changeIsExampleVisible="changeIsExampleVisible"
      @changeIsModify="changeIsModify"
      @changeFamily="changeFamily"
      :settings="{ name, url, isExampleVisible, isModify, family }"
      :isVisible="isFontsLoaderVisible"/>

      <b-modal centered
        v-model="deleteModalIsOpen"
        title="Подтвердите удаление"
        cancel-title="Отмена"
        :hide-footer="isDeleting"
        @ok="deleteFont">
        Вы действительно хотите удалить плеер?
        <img v-if="isDeleting"
          class="loader"
          src="/static/img/spinner.gif">
      </b-modal>

  </div>
</template>

<script>
  import FontsLoader from './FontsLoader'
  import FontsTable from './FontsTable'
  import { getFonts, sendFont, deleteFont, saveFont } from '../../../api/fonts'

  export default {
    name: 'fonts-page',
    components: { FontsLoader, FontsTable },
    data: () => ({
      isFontsLoaderVisible: true,
      isLoading: true,
      fonts: [],
      name: '',
      url: '',
      isExampleVisible: false,
      isModify: false,
      family: '',
      isDeleting: false,
      deleteModalIsOpen: false
    }),
    async created () {
      this.fonts = await getFonts()
      this.isLoading = false
    },
    methods: {
      async sendFont (options) {
        try {
          const result = await sendFont(options)
          this.fonts.push(result)
        } catch (ex) {
          console.log(ex)
        }
      },
      async saveFont (options) {
        try {
          const requestOptions = {
            ...options,
            id: this.id
          }
          if (options.file === '') requestOptions.file = null
          const result = await saveFont(requestOptions)
          const index = this.fonts.findIndex(({ id }) => id === this.id)
          const tmp = [...this.fonts]
          tmp[index] = result
          this.fonts = []
          this.fonts = tmp
        } catch (ex) {
          console.log(ex)
        }
      },
      openDeleteModal (id) {
        this.idToRemove = id
        this.deleteModalIsOpen = true
      },
      async deleteFont () {
        const id = this.idToRemove
        try {
          this.isDeleting = true
          await deleteFont(id)
          const index = this.fonts.findIndex(font => font.id === id)
          let tmp = [...this.fonts]
          tmp.splice(index, 1)
          this.fonts = []
          this.fonts = tmp
        } catch (ex) {
          console.log(ex)
        }
        this.isDeleting = false
      },
      modifyFont ({ name, url, id, family }) {
        this.name = name
        this.url = url
        this.id = id
        this.family = family
        this.isExampleVisible = true
        this.isModify = true

        const className =  'q' + name.split(' ').join('').replace('!', '')
        const previousFont = document.querySelector('#FontsLoaderExampleFont')
        if (previousFont) {
          document.head.removeChild(previousFont)
        }

        const styleElement = document.querySelector('#' + className)
        const styleElementCopy = styleElement.cloneNode(true)
        styleElementCopy.id = 'FontsLoaderExampleFont'
        document.head.appendChild(styleElementCopy)
      },
      changeName (value) {
        this.name = value
      },
      changeUrl (value) {
        this.url = value
      },
      changeIsExampleVisible (value) {
        this.isExampleVisible = value
      },
      changeIsModify (value) {
        this.isModify = value
      },
      changeFamily (value) {
        this.family = value
      }
    }
  }
</script>