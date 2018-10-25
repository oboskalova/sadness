<template>
  <div class="row no-gutters">
    <div class="col col-auto separated" v-if="movingMode">
      <button
        class="header-btn"
        title="Переместить сюда"
        @click="moveObjects">
        <i class="icon-insert-here"></i>
      </button>
      <button
        class="header-btn"
        title="Отменить перемещение"
        @click="cancelMoving">
        <i class="mi mi-clear"></i>
      </button>
    </div>
    <div v-else>
      <button
        class="header-btn"
        title="Начать перемещение"
        :disabled="!areThereSelectedObjects || cantEdit"
        @click="startMoving">
        <i class="icon-folder-arrow"></i>
      </button>
    </div>
    <div class="col col-auto">
      <button
        class="header-btn"
        title="Удалить"
        :disabled="!allowDeleting || cantEdit"
        v-b-modal.confirm-delete>
        <i class="mi mi-delete"></i>
      </button>
      <button
        class="header-btn"
        title="Переименовать"
        :disabled="!allowEditing || cantEdit"
        v-b-modal.rename>
        <i class="mi mi-edit"></i>
      </button>
      <button
        class="header-btn"
        title="Загрузить файл"
        :disabled="movingMode || cantEdit"
        v-b-modal.upload>
        <i class="mi mi-file-upload"></i>
      </button>
      <button
        class="header-btn"
        title="Скачать файл"
        :disabled="!allowDeleting || cantEdit"
        @click="download">
        <i class="mi mi-file-download"></i>
      </button>
      <button
        class="header-btn"
        title="Создать папку"
        :disabled="movingMode || cantEdit"
        v-b-modal.newfolder>
        <i class="mi mi-add"></i>
      </button>
    </div>
  </div>
</template>

<script>
  import { moveDriveObjects, downloadObject } from '../../../api/file-manager'
  import RulesChecker from '../../../helpers/rulesChecker'

  export default {
    name: 'the-header-files-right-tools',
    computed: {
      choosedObjectsSrc () {
        return this.$store.getters.firstSelected.id
      },
      choosedObjects () {
        return this.$store.getters.choosedObjects
      },
      catalogue () {
        const isSearching = this.$store.getters.searchingMode
        return isSearching
          ? this.$store.getters.searchResults
          : this.$store.getters.fileManagerCatalogue
      },
      areThereSelectedObjects () {
        return this.$store.getters.numberOfChoosedObjects !== 0
      },
      allowDeleting () {
        return !this.movingMode && this.$store.getters.numberOfChoosedObjects !== 0
      },
      allowEditing () {
        return !this.movingMode && this.$store.getters.numberOfChoosedObjects === 1
      },
      currentCatalogueId () {
        return this.$route.params.id
      },
      movingMode () {
        return this.$store.getters.movingMode
      },
      movingObjects () {
        return this.$store.getters.movingObjects
      }
    },
    created () {
      this.checkRule()
    },
    data () {
      return {
        cantEdit: false
      }
    },
    methods: {
      checkRule () {
        if (this.$store.getters.passport.id && this.$store.getters.userGroup.length > 0) {
          this.cantEdit = !RulesChecker.canUserDo('files', null, this.$store.getters)
        } else {
          console.log('make a timer')
          setTimeout(() => { this.checkRule() }, 200)
        }
      },
      download () {
        var loadList = []
        var count = 0
        this.choosedObjects.forEach(element => {
          var file = this.catalogue.find(e => e.id === element)
          console.log(file)
          if (file.type !== 0) {
            loadList.push(element)
          }
        })
        console.log(loadList)
        function downloadIt () {
          if (loadList.length > count) {
            downloadObject(loadList[count])
            setTimeout(() => {
              console.log('try to download')
              downloadIt()
            }, 1000)
            count = count + 1
          }
        }
        setTimeout(() => {
          console.log('try to download')
          downloadIt()
        }, 1000)
      },
      moveObjects: function () {
        const ids = this.movingObjects
        const target = this.currentCatalogueId
        moveDriveObjects(ids, target).then(response => {
          this.$store.dispatch('reloadCatalogue', target)
          this.$store.dispatch('updateDriveTree')
          this.$store.commit('FINISH_MOVING')
        })
      },
      startMoving () {
        this.$store.commit('START_MOVING')
        this.$store.commit('ASSIGN_DRAGGING_OBJECTS')
      },
      cancelMoving: function () {
        this.$store.commit('FINISH_MOVING')
        this.$store.commit('REMOVE_SELECTION')
      }
    }
  }
</script>

<style scoped>
  .separated {
    margin-right: 15px;
    border-right: 1px solid #fff;
  }
  .icon-folder-arrow,
  .icon-insert-here {
    display: block;
    transition: background 150ms ease-in-out;
  }
  .icon-folder-arrow {
    width: 30px;
    height: 20px;
    margin: 0 2px;
    margin-top: 1px;
    background: url(/static/img/icons/folder-arrow-green.svg) no-repeat;
    background-size: contain;
  }
  .icon-insert-here {
    width: 25px;
    height: 25px;
    margin: 0 auto;
    background: url(/static/img/icons/move.svg) no-repeat;
    background-size: contain;
  }
  .header-btn:not([disabled]) > .icon-folder-arrow {
    background: url(/static/img/icons/folder-arrow.svg) no-repeat;
    background-size: contain;
  }
</style>