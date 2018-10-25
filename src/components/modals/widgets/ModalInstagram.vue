<template>
    <b-modal
      v-model="active"
      @show="openModal"
      @hide="closeModal"
      no-close-on-backdrop
      size="lg"
      :title="modalTitle"
      class="modalInstagram"
      hide-footer>
      <div class="container">
        <div class="row row-down" style="text-align: center; center; background-color: whitesmoke;">
          <div v-if="isToken" class="col">
            Вход успешно выполнен
            <a href="https://www.instagram.com/accounts/login/" target="blank">
              <b-button @click="clearToken" size="md">Выход</b-button>
            </a>
          </div>
          <div v-else-if="local.instagram" class="col">
            Выполните вход для начала работы с виджетом
            <b-button @click="doAuth" size="bg">Авторизация</b-button>
          </div>
        </div>
        <div class="row row-op">
          <div class="col">
            <label class="label-bold">Название:</label>
            <input type="text" v-model="name" placeholder="Введите название"/>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-radio-group v-model="widget.isHashtag">
              <b-form-radio :value="false">
                Показывать посты своего аккаунта
              </b-form-radio>
              <b-form-radio :value="true">
                Показывать посты по хештегу
              </b-form-radio>
            </b-form-radio-group>
          </div>
        </div>
        <div v-show="widget.isHashtag" class="row">
          <div class="col">
            <label class="label-bold">Хештег:</label><br>
            <span class="input-group-addon">#</span>
            <input class="handle-input" type="text" v-model="widget.hashtag" placeholder="Введите хештег"/>
          </div>
        </div>
        <div class="row row-up row-down">
          <div class="col-md-6">
            <label class="label-bold">Обновить через:</label>
            <select v-model="widget.reloadTime" class="form-control" style="height: calc(2.25rem + 4px);">
              <option value="0">не обновлять</option>
              <option value="15">15 минут</option>
              <option value="30">30 минут</option>
              <option value="60">60 минут</option>
            </select>
          </div>
          <div class="col-md-3" style="text-align: center;">
            <label class="label-bold">Постов по горизонтали:</label><br>
            <input class="input-time" style="max-width: 60px; border-radius: 4px !important; margin-top: 4px;" type="number" v-model="widget.postsHoriz" min="1" max="10" step="1"/>
          </div> 
          <div class="col-md-3" style="text-align: center;">
            <label class="label-bold">Постов по вертикали:</label><br>
            <input class="input-time" style="max-width: 60px; border-radius: 4px !important; margin-top: 4px;" type="number" v-model="widget.postsVertic" min="1" max="10" step="1"/>
          </div> 
        </div>
        <div class="row row-down">
          <div class="col">
            <b-form-checkbox v-model="widget.isNextTime">
              Показывать всплывающий пост
            </b-form-checkbox>
          </div>
        </div>
        <div class="row row-down">
          <div class="col">
            <b-form-checkbox v-model="widget.offlineHide">
              Скрывать виджет при отсутствии интернета
            </b-form-checkbox>
          </div>
          <div v-show="widget.isNextTime" class="offset-md-1 col-md-3" style="margin-top: -30px; text-align: center;">
            <label class="label-bold" style="margin-bottom: 5px;">Смена постов через:</label><br>
            <input class="input-time" type="number" v-model="widget.nextTime" min="1" step="1"/>
            <span class="input-sec">сек</span>
          </div>
        </div>
      </div>
      <div class="row row-footer justify-content-end">
        <button
          class="btn btn-primary"
          @click="saveBtnClick">Сохранить</button>
        <button
          class="btn btn-secondary"
          @click="active = false">Отмена</button>
      </div>
  </b-modal>
</template>

<script>
import ModalHelper from './helpers/ModalHelper'
import Instagram from '../../widgets/helpers/Instagram'

const host = location.protocol + '//' + window.location.hostname
const redirectUri = location.port ? `${host}:${location.port}/` : `${host}/`

const widgetDefault = () => {
  return {
    isHashtag: false,
    hashtag: '',
    reloadTime: 0,
    postsHoriz: 1,
    postsVertic: 1,
    offlineHide: false,
    isNextTime: false,
    nextTime: 5,
    postList: [],
    instaToken: null
  }
}

const localDefault = () => {
  return {
    instagram: new Instagram()
  }
}

export default {
  mixins: [ModalHelper.getMixin()],
  created () {
    this.local.instagram = new Instagram()
  },
  data () {
    return {
      widgetType: 9,
      id: null,
      name: this.nameDefault(),
      widget: this.widgetDefault(),
      local: this.localDefault()
    }
  },
  computed: {
    modalTitle () {
      if (this.isModify) return 'Изменение Instagram'
      else return 'Добавление Instagram'
    },
    btnConfirmTitle () {
      if (this.isModify) return 'Сохранить'
      else return 'Сохранить'
    },
    isToken () {
      return this.local.instagram ? this.local.instagram.isToken : false
    }
  },
  methods: {
    // begin ModalHelper use
    nameDefault () {
      return 'insta'
    },
    widgetDefault () {
      return widgetDefault()
    },
    localDefault () {
      return localDefault()
    },
    // end ModalHelper use
    openModal () {
      this.setDataByContent()
      this.widget.instaToken = this.local.instagram.token
    },
    closeModal () {
      this.setDataByDefault()
    },
    apiGetMedia (callback) {
      let apiMedia = this.widget.isHashtag ? this.local.instagram.apiTagMedia : this.local.instagram.apiSelfMedia
      apiMedia = apiMedia.bind(this.local.instagram)
      let params = { token: this.widget.instaToken, hashtag: this.widget.hashtag }
      apiMedia(params)
        .then((postList) => {
          console.log('create postList')
          this.widget.postList = postList
          callback()
        })
        .catch(err => console.log(err))
    },
    saveBtnClick () {
      this.apiGetMedia(() => {
        if (this.isModify) this.changePlaylistItem()
        else this.createPlaylistItem()
      })
    },
    clearToken () {
      this.local.instagram.clearToken()
      this.active = false
    },
    doAuth () {
      this.local.instagram.doAuth(redirectUri)
      this.active = false
    }
  }
}
</script>

<style>
  .row-op {
    margin-bottom: 20px;
  }
  .row-up {
    margin-top: 10px;
  }
  .row-down {
    margin-bottom: 10px;
  }
  .label-bold {
    font-weight: 600;
    margin-bottom: 0px;
  }
  .modalInstagram .handle-input {
    width: calc(95% - 5px);
  }
  .modalInstagram .input-group-addon {
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
