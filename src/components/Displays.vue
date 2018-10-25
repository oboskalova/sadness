<template>
  <div v-if="canSee">
    <div class="content row no-gutters">
      <main class="main col" @click.self="removeSelection">
        <div class="file-manager container" @click.self="removeSelection">
          <DisplayList
            :catalogue="catalogue"
            :isLoading="isLoading"/>
          <b-modal centered
            id="anotherEmail"
            ref="anotherEmail"
            title="Укажите почту для получения инструкций" 
            cancel-title="Отмена"
            :hide-footer="isChanging"
            @ok="sendMessage">
            <p>Email</p>
            <b-form-input
              ref="name"
              type="email"
              :disabled="isChanging"
              v-model="newEmail" />
            <img
              v-if="isChanging"
              src="/static/img/spinner.gif"
              class="loader">
          </b-modal>
          <b-modal centered
            id="createDisplay"
            ref="createDisplay"
            title="Создать новый плеер" 
            cancel-title="Отмена"
            :hide-footer="isChanging"
            @ok="createDisplay"
            @shown="resetDisplay()">
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <a class="nav-link" href="#" :class="{ 'active': activeTab === 0 }" @click="toggleTo(0)">Свойства</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" :class="{ 'active': activeTab === 1 }" @click="toggleTo(1)">Теги</a>
              </li>
            </ul>
            <div v-show="!activeTab">
              <p class="label">Название плеера</p>
              <input
                ref="name"
                type="text"
                :disabled="isChanging"
                v-model="newName" />
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
            <img
              v-if="isChanging"
              src="/static/img/spinner.gif"
              class="loader">
          </b-modal>
          <b-modal centered
            id="aboutDisplay"
            ref="aboutDisplay"
            title="Создать новый плеер" 
            hide-footer>
            <p>Вы добавили плеер с названием '{{ newDisplay.name }}'. Активируйте новый плеер, согласно следующим шагам:</p>
            <p><span class="badge badge-success">Шаг 1</span> Загрузите и установите Cubic Player на Вашем устройстве</p>
            <div class="row download">
              <div class="col-md-6">
                <div class="getApp">
                  <a href="https://visionapi.cubicservice.ru/api/v0.1/download/androidVision"><i class="mi mi-get-app"></i> Скачать на Android</a>
                </div>                
              </div>
              <div class="col-md-6">
                <div class="getApp">
                  <a href="https://visionapi.cubicservice.ru/api/v0.1/download/windowsVision"><i class="mi mi-get-app"></i> Скачать на Windows</a>
                </div>                
              </div>
            </div>
            <p><span class="badge badge-success">Шаг 2</span> Открыв Cubic Player, введите указаный пинкод
             на устройстве для завершения установки</p>
            <input v-model="newDisplay.pincode"
              readonly
              type="text" 
              @focus="$event.target.select()"
              class="pincode">
            <p>После активации плеер сможет показывать Ваши презентации.</p>
            <p>Данные инструкции также отправлены на Ваш email.</p>
            <button type="button" class="btn btn-secondary btn-md" v-b-modal.anotherEmail>Отправить на другой email</button>
          </b-modal>
          
        </div>
      </main>
    </div>
    <b-modal centered
      id="delete-display"
      ref="delete-display"
      title="Подтверждение удаления" 
      cancel-title="Отмена"
      :hide-footer="isChanging"
      @ok="deleteDisplay">
      Вы действительно хотите удалить плеер?
      <img
        v-if="isChanging"
        src="/static/img/spinner.gif"
        class="loader">
    </b-modal>
  </div>
  <div v-else>
    У вас нет прав на просмотр содержимого страницы
  </div>
</template>

<script>
  import DisplayList from './displays/DisplayList'
  import RulesChecker from '../../helpers/rulesChecker'
  import {
    getDisplayObjects,
    createDisplayObject,
    removeDisplayObject,
    sendMessage
  } from '../../api/display-manager'

  export default {
    name: 'display-manager',
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
      isLoading () {
        return this.$store.getters.playerLoading
      },
      catalogue () {
        const isSearching = this.$store.getters.searchingDisplays
        return isSearching
          ? this.$store.getters.searchDisplayResults
          : this.$store.getters.displays
      },
      choosedObjects () {
        return this.$store.getters.choosedObjects
      },
      targetObject () {
        return this.$store.getters.firstSelected
      },
      selectedDisplay () {
        return this.$store.getters.targetDisplayId
      }
    },
    watch: {
      canSee (v) {
        if (v) this.fetchData()
      }
    },
    created () {
      this.checkRule()
    },
    methods: {
      checkRule () {
        if (this.$store.getters.passport.id && this.$store.getters.userGroup.length > 0) {
          this.canSee = RulesChecker.canUserDo('', 'players', this.$store.getters)
        } else {
          console.log('make a timer')
          setTimeout(() => { this.checkRule() }, 200)
        }
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
      },
      toggleTo (val) {
        this.activeTab = val
      },
      removeSelection () {
        this.$store.commit('REMOVE_DISPLAY_SELECTION')
      },
      createDisplay () {
        this.isChanging = true
        const obj = {}
        obj.name = this.newName
        obj.tags = JSON.stringify(this.tagsArray)
        obj.megaTags = this.tagsArray
        obj.megaTags.push(this.newName)
        obj.megaTags = JSON.stringify(obj.megaTags.sort())
        return createDisplayObject(obj).then(response => {
          const data = response.data
          if (!data) return
          this.$store.commit('PUSH_DISPLAY', data)
          this.newDisplay = data
          this.isChanging = false
          this.$refs.aboutDisplay.show()
        }).catch(error => {
          console.log(error)
          this.isChanging = false
        })
      },
      sendMessage () {
        this.isChanging = true
        console.log(this.newEmail, this.newDisplay)
        return sendMessage(this.newEmail, this.newDisplay.id).then(response => {
          const data = response.data
          console.log(data)
          if (!data) return
          this.isChanging = false
        }).catch(error => {
          console.log(error)
          this.isChanging = false
        })
      },
      resetDisplay () {
        this.newName = 'Новый плеер'
        this.newTags = ''
        this.tagsArray = []
        this.newDisplay = {}
      },
      fetchData: function () {
        this.$store.commit('TOOGLE_PLAYER_LOADING', true)
        return getDisplayObjects().then(response => {
          const data = response.data
          if (!data) return
          this.updateCatalogue(data)
          this.$store.commit('TOOGLE_PLAYER_LOADING', false)
          this.$root.sockets.sendData('checkStatus')
        }).catch(error => {
          console.log(error)
          this.$store.commit('TOOGLE_PLAYER_LOADING', false)
        })
      },
      updateCatalogue: function (data) {
        this.$store.dispatch('uploadDisplays', data)
      },
      deleteDisplay () {
        return removeDisplayObject(this.selectedDisplay).then(response => {
          this.$store.commit('REMOVE_DISPLAY', this.selectedDisplay)
          this.removeSelection()
        }).catch(error => {
          console.log(error)
          this.isChanging = false
        })
      }
    },
    components: {
      DisplayList
    },
    data () {
      return {
        activeTab: 0,
        canSee: false,
        newName: 'Новый плеер',
        newTags: '',
        tagsArray: [],
        newEmail: '',
        newDisplay: {
          pincode: 'asddsfdsf'
        },
        isChanging: false
      }
    }
  }
</script>

<style scoped>
#app input[type=text][readonly="readonly"].pincode {
  text-align: center;
  font-size: 36px!important;
  box-sizing: border-box!important;
  margin-bottom: 15px;
  border-bottom: 1px solid #000!important;
}
#app input[type=text][readonly="readonly"].pincode:focus {
  border-bottom: 1px solid #4aafb7!important;
}
#aboutDisplay p {
  font-size: 15px!important;
}
.getApp {
  border:1px solid #ccc;
  padding: 21px 5px;
  font-size: 17px;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 15px;
}
.getApp i{
  top: 3px;
}
ul.nav{
  margin-bottom: 10px;
}
.input{
  margin-bottom: 1.2rem;
}
.label {
  margin-bottom: 0;
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
.nav-link {
  color: #00b0b7;
}
</style>