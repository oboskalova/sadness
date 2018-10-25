<template>
    <b-modal
      v-model="active"
      @show="openModal"
      @hide="closeModal"
      no-close-on-backdrop
      size="lg"
      :title="modalTitle"
      class="modalTwitter modal-inner-scroller"
      hide-footer>
      <div class="container">
        <div class="row row-op">
          <div class="col">
            <label class="label-bold">Название:</label>
            <input type="text" v-model="name" placeholder="Введите название"/>
          </div>
        </div>
        <div class="row row-op">
          <div class="col">
            <label class="label-bold">Публичный аккаунт в Twitter:</label><br>
            <span class="input-group-addon">@</span>
            <input class="handle-input" type="text" v-model="handle" placeholder="Введите аккаунт"/>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <label class="label-bold">Обновить данные через:</label>
            <select v-model="reloadTime" class="form-control" style="height: calc(2.25rem + 4px);">
              <option value="0">не обновлять</option>
              <option value="15">15 минут</option>
              <option value="30">30 минут</option>
              <option value="60">60 минут</option>
            </select>
          </div>
          <div class="offset-md-1 col-md-3">
            <label class="label-bold" style="margin-bottom: 5px;">Смена твиттов через:</label><br>
            <input class="input-time" type="number" v-model="nextTime" min="0" step="0.5"/>
            <span class="input-sec">сек</span>
          </div>
          <div class="col-md-3" style="text-align: center;">
            <label class="label-bold">Количество твиттов:</label><br>
            <input style="max-width: 60px;" type="number" v-model="tweetsCount" min="1" max="100" step="1"/>
          </div> 
        </div>
        <div class="row">
           <div class="col">
            <b-form-group label="Выбор отображаемых данных:">
              <b-form-checkbox v-model="isDate">
                Показывать дату
              </b-form-checkbox>
              <b-form-checkbox v-model="isComments">
                Показывать комментарии
              </b-form-checkbox>
              <b-form-checkbox v-model="isRetweets">
                Показывать ретвиты
              </b-form-checkbox>
              <b-form-checkbox v-model="isLikes">
                Показывать лайки
              </b-form-checkbox>
            </b-form-group>
             <b-form-group style="margin-top: -15px;">
              <b-form-checkbox v-model="isAvatar">
                Показывать аватарку
              </b-form-checkbox>
              <b-form-checkbox v-model="isImages">
                Показывать изображения 
              </b-form-checkbox>
            </b-form-group>
           </div>
        </div>
        <div class="row row-op">
          <twitter class="tweet" :content="tweetContent" :options="{}"></twitter>
        </div>
        <div class="row" >
          <div class="col">
            <b-form-checkbox v-model="offlineHide">
              Скрывать виджет при отсутствии интернета
            </b-form-checkbox>
          </div>
        </div>
      </div>
      <div class="row row-footer justify-content-end">
        <button
          :disabled="!isCanCreate"
          class="btn btn-primary"
          @click="isModify?changePlaylistItem():createPlaylistItem()">Сохранить</button>
        <button
          class="btn btn-secondary"
          @click="active = false">Отмена</button>
      </div>
  </b-modal>
</template>

<script>
import ModalWidgetHelper from './_ModalWidgetHelper.js'
import twitter from '../../widgets/components/Twitter'
import Twitter from '../../widgets/helpers/Twitter'

export default {
  components: {twitter},
  data () {
    return {
      modalWidgetHelper: null,
      widgetType: 8,
      id: null,
      name: '',
      // widget data
      handle: '',
      tweetsCount: 10,
      reloadTime: 0,
      allowScroll: true,
      offlineHide: false,
      nextTime: 5,
      isDate: true,
      isComments: true,
      isRetweets: true,
      isLikes: true,
      isAvatar: true,
      isImages: false,
      tweetList: []
    }
  },
  computed: {
    modalTitle () {
      if (this.isModify) return 'Изменение Twitter'
      else return 'Создание Twitter'
    },
    modalWidgetContent: {
      get () {
        return this.$store.getters.modalWidgetContent
      },
      set (val) {
        this.$store.commit('SET_MODAL_WIDGET_CONTENT', val)
      }
    },
    modalWidgetType: {
      get () {
        return this.$store.getters.modalWidgetType
      },
      set (val) {
        this.$store.commit('SET_MODAL_WIDGET_TYPE', val)
      }
    },
    active: {
      get () {
        return this.modalWidgetType === this.widgetType
      },
      set (val) {
        if (val) this.modalWidgetType = this.widgetType
        else this.modalWidgetType = null
      }
    },
    isModify: {
      get () {
        const modalWidgetContent = this.modalWidgetContent
        return modalWidgetContent && modalWidgetContent.type === this.widgetType
      }
    },
    container () {
      return this.$store.getters.coreActiveContainer
    },
    allMedias () {
      const cId = this.container.id
      return this.$store.getters.coreWidgets[cId] || []
    },
    numberOfWidgets () {
      return ModalWidgetHelper.numberOfWidgets(this.allMedias, this.widgetType)
    },
    isCanCreate: function () {
      return this.name && this.handle
    },
    tweetContent: function () {
      let dateStr = new Date().toDateString()
      return {
        isDate: this.isDate,
        isComments: this.isComments,
        isRetweets: this.isRetweets,
        isLikes: this.isLikes,
        isAvatar: this.isAvatar,
        isImages: this.isImages,
        tweetList: [{
          commCount: 1,
          rettCount: 3,
          likesCount: 17,
          text: 'Здесь отображается твит пользователя',
          image: 'data:image/png;base64,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',
          displayName: 'Twitter Widget',
          screenName: 'TwitterWidget',
          date: dateStr.substring(4, dateStr.length),
          profileImage: 'data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZGF0YS1wcmVmaXg9ImZhcyIgZGF0YS1pY29uPSJ1c2VyLWNpcmNsZSIgY2xhc3M9InN2Zy1pbmxpbmUtLWZhIGZhLXVzZXItY2lyY2xlIGZhLXctMTYiIHJvbGU9ImltZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNDk2IDUxMiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMjQ4IDhDMTExIDggMCAxMTkgMCAyNTZzMTExIDI0OCAyNDggMjQ4IDI0OC0xMTEgMjQ4LTI0OFMzODUgOCAyNDggOHptMCA5NmM0OC42IDAgODggMzkuNCA4OCA4OHMtMzkuNCA4OC04OCA4OC04OC0zOS40LTg4LTg4IDM5LjQtODggODgtODh6bTAgMzQ0Yy01OC43IDAtMTExLjMtMjYuNi0xNDYuNS02OC4yIDE4LjgtMzUuNCA1NS42LTU5LjggOTguNS01OS44IDIuNCAwIDQuOC40IDcuMSAxLjEgMTMgNC4yIDI2LjYgNi45IDQwLjkgNi45IDE0LjMgMCAyOC0yLjcgNDAuOS02LjkgMi4zLS43IDQuNy0xLjEgNy4xLTEuMSA0Mi45IDAgNzkuNyAyNC40IDk4LjUgNTkuOEMzNTkuMyA0MjEuNCAzMDYuNyA0NDggMjQ4IDQ0OHoiPjwvcGF0aD48L3N2Zz4='
        }]
      }
    }
  },
  methods: {
    createWidgetItem: function () {
      let tweetsItem = {
        type: this.widgetType,
        handle: this.handle,
        tweetsCount: this.tweetsCount,
        reloadTime: this.reloadTime,
        allowScroll: this.allowScroll,
        offlineHide: this.offlineHide,
        nextTime: this.nextTime,
        isDate: this.isDate,
        isComments: this.isComments,
        isRetweets: this.isRetweets,
        isLikes: this.isLikes,
        isAvatar: this.isAvatar,
        isImages: this.isImages,
        tweetList: Twitter.getTweets(this.tweetsCount)
      }
      return JSON.stringify(tweetsItem)
    },
    setAllDataByDefault () {
      this.id = null
      this.name = 'tweets' + this.numberOfWidgets
      this.handle = ''
      this.tweetsCount = 10
      this.reloadTime = 0
      this.allowScroll = true
      this.offlineHide = false
      this.nextTime = 5
      this.isDate = true
      this.isComments = true
      this.isRetweets = true
      this.isLikes = true
      this.isAvatar = true
      this.isImages = false
    },
    setWidgetContent () {
      if (this.isModify) {
        // изменение
        const content = this.modalWidgetContent
        this.id = content.id
        this.name = content.name
        this.handle = content.handle
        this.tweetsCount = content.tweetsCount
        this.reloadTime = content.reloadTime
        this.allowScroll = content.allowScroll
        this.offlineHide = content.offlineHide
        this.nextTime = content.nextTime
        this.isDate = content.isDate
        this.isComments = content.isComments
        this.isRetweets = content.isRetweets
        this.isLikes = content.isLikes
        this.isAvatar = content.isAvatar
        this.isImages = content.isImages
      } else this.setAllDataByDefault()
      this.modalWidgetHelper = new ModalWidgetHelper(this.$store, this.createWidgetItem,
        {wName: this.name, wId: this.id})
    },
    openModal () {
      this.setWidgetContent()
    },
    closeModal () {
      this.setAllDataByDefault()
    },
    createPlaylistItem () {
      this.modalWidgetHelper.createPlaylistItem({wName: this.name}, () => {
        this.active = false
      })
    },
    changePlaylistItem () {
      this.modalWidgetHelper.changePlaylistItem({wName: this.name, wId: this.id}, () => {
        this.active = false
      })
    }
  }
}
</script>

<style scoped>
  .modalTwitter .row-op {
    margin-bottom: 20px;
  }
  .modalTwitter .handle-input {
    width: calc(95% - 5px);
  }
  .modalTwitter .input-group-addon {
      margin-top: 5px;
      margin-right: 5px;
      padding: 6px 12px;
      font-size: 18px;
      font-weight: 800;
      line-height: 1;
      color: #5b5b5b;
      text-align: center;
      background-color: #d5d5d5;
      border: 1px solid #dad7d4;
      border-radius: 5px !important;
      width: 5%;
      white-space: nowrap;
      vertical-align: middle;
      float: left;
  }
  .label-bold {
    font-weight: 600;
    margin-bottom: 0px;
  }
  .col-form-legend {
    font-weight: 600;
  }
  .modalTwitter .check-padd .custom-control-indicator {
    margin-top: 8px;
  }
  .tweet {
    margin-left: 18%;
    margin-right: 18%;
  }
  .input-time {
    max-width: 60px;
    height: 30px !important;
    text-align: center;
    border: 1px solid #dad7d4 !important;
    border-radius: 4px 0px 0px 4px !important;
    padding-right: 2px !important;
  }
  .input-sec {
    margin-left: -4px;
    padding: 8px 6px 7px;
    font-weight: 400;
    line-height: 1;
    color: #5b5b5b;
    text-align: center;
    background-color: #d5d5d5;
    border: 1px solid #dad7d4;
    border-radius: 0px 4px 4px 0px;
  }
</style>
