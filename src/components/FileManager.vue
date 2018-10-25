<template>
  <div>
    <div class="content row no-gutters">
      <TheSidebar class="col"/>
      <main class="main col">
        <div class="file-manager container" @click.self="removeSelection">
          <FileManagerList
            :catalogue="catalogue"
            :isLoading="isLoading"/>
          <b-modal centered
            id="confirm-delete"
            ref="confirmDelete"
            title="Подтвердите удаление"
            cancel-title="Отмена"
            :hide-footer="isDeleting"
            @ok="removeCatalogueObjects">
            <p class="text-left">Выделенные объекты будут безвозвратно удалены.<br>Вы действительно хотите удалить выбранные объкты?</p>
            <img v-if="isDeleting"
              class="loader"
              src="/static/img/spinner.gif">
          </b-modal>
          <b-modal centered
            id="rename"
            ref="renameModal"
            :title="'Введите новое имя ' + (isFolder ? 'каталога' : 'файла')" 
            :hide-footer="isChanging"
            cancel-title="Отмена"
            @ok="save"
            @shown="resetName">
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <a class="nav-link" href="#" :class="{ 'active': activeTab === 0 }" @click="toggleTo(0)">Свойства</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" :class="{ 'active': activeTab === 1 }" @click="toggleTo(1)">Теги</a>
              </li>
            </ul>
            <div v-show="!activeTab">
              <p class="label">Название</p>
              <b-form-input
                ref="name"
                type="text"
                v-model="newName"
                :disabled="isChanging" />
            </div>
            <div v-show="activeTab">
              <p class="label">Введите новые теги через пробел и нажмите Enter</p>
              <input
                class="input"
                type="text"
                v-model="newTags"
                v-on:keyup.enter="addTags()">
              <ul class="tag">
                <li class="tag-item" v-for="(item, index) in tagsArray">
                    {{ item }}
                    <i class="mi mi-close" @click="remove(index)"></i>
                </li>
              </ul>
            </div>
            <img v-if="isChanging"
              class="loader"
              src="/static/img/spinner.gif">
          </b-modal>

          <ModalViewMediaFiles :file="openedFile" />

          <b-modal
            id="upload"
            ref="uploadModal"
            v-model="uploadState"
            title="Загрузка файлов"
            hide-footer
            size="lg"
            @hide="displayWarning"
            centered>
            <p>Вы можете загрузить файл размером не более <span class="font-weight-bold">2Гб</span> в любом из допустимых форматов:
              <span class="font-weight-bold initialism">mp4</span>,
              <span class="font-weight-bold initialism">webm</span>,
              <span class="font-weight-bold initialism">png</span>,
              <span class="font-weight-bold initialism">jpeg</span>,
              <span class="font-weight-bold initialism">gif</span>,
              <span class="font-weight-bold initialism">webp</span>,
              <span class="font-weight-bold initialism">mp3</span>,
              <span class="font-weight-bold initialism">wav</span>,
              <span class="font-weight-bold initialism">ppt</span>,
              <span class="font-weight-bold initialism">pptx</span>
            </p>
            <div class="progress-list">
              <div v-for="(file, index) in uploadFiles"
                class="row no-gutters align-items-center"
                :key="file.id">
                <div class="col col-1">{{ index + 1 }}.</div>
                <div class="col col-6">{{ file.name | truncate }}</div>
                <div v-if="!file.done" class="col col-3">
                  <b-progress
                    :value="file.loaded"
                    :max="file.total"
                    variant="info">
                  </b-progress>
                </div>
                <div v-if="!file.done" class="col col-2 text-right">
                  {{ file.percent | percent }}
                </div>
                <div v-if="file.done" class="col col-5 text-right">
                  Загружено
                </div>
              </div>
            </div>
            <div class="row row-footer no-gutters align-items-center justify-content-end">
              <div class="col text-left">{{ uploadMessage }}</div>
              <div class="col col-auto">
                <label class="btn btn-secondary" for="upload-file">
                  <span class="align-middle">Загрузить файлы</span>
                </label>
                <input
                  id="upload-file"
                  class="d-none"
                  type="file"
                  @change="getFilesAndUpload"
                  multiple>
              </div>
              <div class="col col-auto">
                <button class="btn btn-primary"
                  @click="displayWarning">
                  OK
                </button>
              </div>
            </div>
          </b-modal>

          <b-modal
            v-model="warningState"
            title="Предупреждение"
            ok-title="Прервать"
            cancel-title="Продолжить загрузку"
            @ok="cancelUploading"
            @hide="continueUploading"
            @cancel="continueUploading"
            centered>
            Вы уверены, что хотите прервать загрузку файлов ?
          </b-modal>

          <b-modal
            id="newfolder"
            title="Введите имя папки"
            ok-title="Создать"
            cancel-title="Отмена"
            @show="recommendNewFolderName"
            @ok="createCatalogue"
            centered>
            <b-form-input v-model="newFolderName"></b-form-input>
          </b-modal>

          <b-alert
            :variant="alertType"
            :show="dismissCountDown"
            @dismissed="dismissCountdown = 0"
            @dismiss-count-down="countDownChanged"
            dismissible>{{ alertMessage }}
          </b-alert>

        </div>
      </main>
    </div>
  </div>
</template>

<script>
  import 'video.js/dist/video-js.css'
  import RulesChecker from '../../helpers/rulesChecker'
  import axios from 'axios'
  import TheSidebar from './file-manager/TheSidebar'
  import FileManagerList from './file-manager/FileManagerList'
  import ModalViewMediaFiles from './modals/ModalViewMediaFiles'
  import { detectType, contains, generateId } from '../../helpers'
  import {
    getDriveObject,
    createDriveObject,
    updateDriveObject,
    removeDriveObjects,
    getAvailableSpace
  } from '../../api/file-manager'

  export default {
    name: 'file-manager',
    filters: {
      truncate (value) {
        value = value + ''
        if (value.length > 40) {
          return `${value.substr(0, 24)} ... ${value.substr(-16)}`
        }
        return value
      },
      percent (value) {
        return `${value.toFixed(1)}%`
      }
    },
    computed: {
      uploadFiles () {
        return this.$store.getters.uploadFiles
      },
      catalogue () {
        return this.$store.getters.fileManagerCatalogue
        // const isSearching = this.$store.getters.searchingMode
        // return isSearching
          // ? this.$store.getters.searchResults
          // : this.$store.getters.fileManagerCatalogue
      },
      choosedObjects () {
        return this.$store.getters.choosedObjects
      },
      isFolder () {
        if (this.targetObject) {
          return this.targetObject.type === 0
        }
      },
      targetObject () {
        return this.$store.getters.firstSelected
      },
      errorHappened () {
        return this.responseCode >= 400
      },
      alertMessage () {
        return this.$store.getters.alertMessage
      },
      alertType () {
        return this.$store.getters.alertType
      },
      dismissCountDown () {
        return this.$store.getters.dismissCountDown
      },
      driveTree () {
        return this.$store.getters.driveTree
      },
      allFilesUploaded () {
        return this.$store.getters.inProcessFileNumber === 0
      },
      requestedCatalogue () {
        return this.$store.getters.requestedCatalogue
      },
      unavailableNames () {
        return this.$store.getters.namesInCurrentCatalogue
      },
      currentCatalogueId () {
        return this.$route.params.id || this.$store.getters.passport.files
      }
    },
    watch: {
      '$route' (to, from) {
        this.$store.dispatch('stopSearching')
        this.checkRule(to.params.id)
      }
    },
    mounted () {
      const id = this.$route.params.id
      this.checkRule(id)
      getAvailableSpace().then(response => {
        this.freeDriveSpace = response.data.free
      })
    },
    methods: {
      checkRule (id) {
        if (this.$store.getters.passport.id && this.$store.getters.userGroup.length > 0) {
          this.cantEdit = !RulesChecker.canUserDo('files', null, this.$store.getters)
          const id = this.$route.params.id
          if (id) {
            this.fetchData(id)
          } else {
            this.fetchData(this.$store.getters.passport.files)
            // this.$store.commit('SET_PARENT_ID', this.$store.getters.passport.files)
            // console.log('set a folder', this.$store.getters.passport.files)
          }
        } else {
          console.log('make a timer')
          setTimeout(() => { this.checkRule(id) }, 200)
        }
      },
      removeSelection: function () {
        this.$store.commit('REMOVE_SELECTION')
      },
      fetchData: function (id) {
        this.isLoading = this.requestedCatalogue
        return getDriveObject(id).then(response => {
          const data = response.data
          if (!data) return
          if (data.type === 0) this.updateCatalogue(data)
          else this.openFileViewer(data)
          this.isLoading = false
        }).catch(error => {
          const messageType = 'notFound'
          const responseCode = error.response.status
          this.$store.commit('DISPLAY_ALERT', { messageType, responseCode })
          this.isLoading = false
          this.$router.push('/files')
        })
      },
      openFileViewer: function (data) {
        this.openedFile = data
        this.$store.commit('TOGGLE_VIEW_MEDIA_FILES', true)
      },
      updateCatalogue: function (data) {
        this.$store.dispatch('uploadCatalogue', data)
        this.$store.dispatch('updateDriveTree')
      },
      removeCatalogueObjects: function (event) {
        event.preventDefault()
        const isFile = this.choosedObjects.type !== 0
        this.isDeleting = true
        removeDriveObjects(this.choosedObjects).then(response => {
          this.$store.dispatch('updateDriveTree')
          this.$store.commit('DELETE_CATALOGUE_OBJECTS')
          this.$refs.confirmDelete.hide()
          this.isDeleting = false
        }).catch(error => {
          const messageType = 'notDeleted' + (isFile ? 'File' : 'Catalogue')
          const responseCode = error.response.status
          this.$store.commit('DISPLAY_ALERT', { messageType, responseCode })
          this.isLoading = false
        })
      },
      resetName: function () {
        this.newName = this.targetObject.name
        this.tagsArray = this.targetObject.tagsArray
        this.$refs.name.$el.focus()
      },
      save: function (event) {
        event.preventDefault()
        const id = this.targetObject.id
        const name = this.newName
        let obj = {}
        obj.id = id
        obj.name = this.newName
        obj.tags = JSON.stringify(this.tagsArray)
        var older = []
        older = older.concat(this.tagsArray)
        obj.mega_tags = older
        obj.mega_tags.push(this.newName)
        obj.mega_tags = JSON.stringify(obj.mega_tags.sort())
        const isFile = this.targetObject.type !== 0
        this.isChanging = true
        updateDriveObject(id, obj).then(response => {
          this.targetObject.name = name
          this.targetObject.tagsArray = this.tagsArray
          this.$refs.renameModal.hide()
          this.isChanging = false
          this.$store.dispatch('updateDriveTree')
        }).catch(error => {
          const messageType = 'notRenamed' + (isFile ? 'File' : 'Catalogue')
          const responseCode = error.response.status
          this.$store.commit('DISPLAY_ALERT', { messageType, responseCode })
          this.isChanging = false
          this.isLoading = false
        })
      },
      countDownChanged (dismissCountDown) {
        this.$store.commit('SET_COUNT_DOWN', dismissCountDown)
      },
      getFilesAndUpload: function (event) {
        const target = event.target || event.srcElement
        const files = [...(target.files || event.dataTransfer.files)]
        getAvailableSpace().then(response => {
          this.freeDriveSpace = response.data.free
          files.forEach(file => {
            const CancelToken = axios.CancelToken
            const isAcceptable = this.checkFileRequirements(file)
            if (isAcceptable) {
              this.freeDriveSpace = this.freeDriveSpace - file.size
              this.$store.dispatch('uploadFile', {
                id: generateId(),
                file: file,
                name: file.name,
                tags: JSON.stringify([]),
                mega_tags: JSON.stringify([file.name]),
                type: detectType(file.type, file.name),
                source: CancelToken.source(),
                parentId: this.currentCatalogueId
              }).then(this.successLoading).catch(this.failLoading)
            }
            setTimeout(() => { this.uploadMessage = '' }, 5000)
          })
        })
      },
      successLoading (response) {
        document.getElementById('upload-file').value = ''
        this.$store.dispatch('updateCatalogue', response.data)
        this.$store.dispatch('updateDriveTree')
      },
      failLoading (error) {
        if (axios.isCancel(error)) {
          this.$store.commit('DISPLAY_ALERT', {
            type: 'success',
            messageType: 'cancelUploading'
          })
          this.clearUploadsList()
        } else {
          this.$store.commit('DISPLAY_ALERT', {
            messageType: 'notUploadedFile',
            responseCode: error.response.status
          })
        }
      },
      formatFileName (name) {
        if (name.length > 30) {
          return name.substr(0, 18) + ' ... ' + name.substr(-7)
        }
        return name
      },
      getFileType (fileName) {
        return fileName.substr(fileName.lastIndexOf('.') + 1)
      },
      checkFileRequirements (file) {
        const fileName = this.formatFileName(file.name)
        let fileType = file.type
        if (fileType === '') {
          fileType = this.getFileType(fileName)
        }

        if (!contains(this.availableTypes, fileType)) {
          this.uploadMessage = `"${fileName}" имеет недопустимый тип`
          return false
        }
        if (file.size > this.maxFileSize) {
          this.uploadMessage = `Размер файла "${fileName}" больше 2 Гб`
          return false
        }
        if (this.freeDriveSpace < file.size) {
          this.uploadMessage = `Недостаточно места на диске`
          return false
        }
        return true
      },
      clearUploadsList () {
        this.$store.commit('CLEAR_UPLOAD_FILE_LIST')
      },
      continueUploading () {
        if (!this.allFilesUploaded) {
          this.uploadState = true
        }
      },
      cancelUploading () {
        this.uploadState = false
        this.uploadFiles.forEach(e => {
          if (!e.done) e.source.cancel()
        })
        this.clearUploadsList()
      },
      displayWarning () {
        if (!this.allFilesUploaded) this.warningState = true
        else {
          this.uploadState = false
          this.clearUploadsList()
        }
      },
      recommendNewFolderName () {
        this.newFolderName = this.getAvaliableName('New folder')
      },
      createCatalogue () {
        const type = 0
        const name = this.newFolderName
        const parentId = this.currentCatalogueId
        createDriveObject({ parentId, name, type }).then(response => {
          const data = response.data
          this.$store.dispatch('updateCatalogue', data)
          this.$store.dispatch('updateDriveTree')
        }).catch(error => {
          const messageType = 'notCreatedCatalogue'
          const responseCode = error.response.status
          this.$store.commit('DISPLAY_ALERT', { messageType, responseCode })
        })
      },
      getAvaliableName (name = '') {
        let i = 1
        let availableName = name.substring(0)
        while (contains(this.unavailableNames, availableName)) {
          availableName = `${name} (${i})`
          i++
        }
        return availableName
      },
      toggleTo (val) {
        this.activeTab = val
      },
      remove (elem) {
        this.tagsArray.splice(elem, 1)
      },
      addTags () {
        var newTags = this.newTags.split(' ')
        newTags.forEach((el) => {
          if (el.length) {
            var pos = this.tagsArray.find(item => item === el)
            console.log(pos)
            if (pos === undefined) {
              this.tagsArray.push(el)
            }
          }
        })
        this.newTags = ''
      }
    },
    components: {
      TheSidebar,
      FileManagerList,
      ModalViewMediaFiles
    },
    data () {
      return {
        canEdit: false,
        uploadState: false,
        warningState: false,
        newName: '',
        newTags: '',
        activeTab: 0,
        tagsArray: [],
        newFolderName: '',
        openedFile: {},
        isLoading: false,
        isDeleting: false,
        isChanging: false,
        responseCode: -1,
        availableTypes: [
          'image/jpeg',
          'image/pjpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'video/mp4',
          'video/webm',
          'audio/mp3',
          'audio/wav',
          'audio/mpeg',
          'audio/vnd.wave',
          'application/octet-stream',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.ms-powerpoint',
          'ppt',
          'pptx'
        ],
        maxFileSize: 2 * 1024 * 1024 * 1024,
        uploadMessage: '',
        freeDriveSpace: -1
      }
    }
  }
</script>

<style scoped>
  .modal-body .video-js {
    width: auto !important;
  }
  .file-manager {
    padding: 1rem 1.25rem;
    position: relative;
  }
  .file-manager .progress {
    margin: 0 !important;
  }
  .progress-list {
    margin-bottom: 1rem;
  }
  .progress-list > .row {
    margin-bottom: 0.5rem;
  }
  .nav-link {
    color: #00b0b7;
  }
  ul.nav{
    margin-bottom: 10px;
  }
  .tag-item {
    padding: 0.2rem 0.7rem;
    border: none;
    border-radius: 15px;
    background: rgb(0, 178, 183);
    color: #fff;
    outline: none;
    cursor: pointer;
    transition: all 100ms ease;
    display: inline-block;
    margin-right: 3px;
  }
  .tag-item .mi {
    top: 2px;
  }
  .tag {
    margin: 0;
    padding: 0;
    display: block;
    list-style-type: none;
  }
  .label {
    margin-bottom: 0;
  }
  .input {
    margin-bottom: 1.2rem;
  }
</style>