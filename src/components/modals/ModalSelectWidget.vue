<template>
  <div class="select-widget">
    <b-modal
      @show="openModal"
      @hide="closeModal"
      v-model="active"
      no-close-on-backdrop
      size="lg"
      title="Доступные виджеты"
      hide-footer>
      <div class="container">
        <div class="row row-op">
          <div class="col-md-3">
            <div class="widget">
              <div class="thumbnail text-fon icon-fon" @click="openWidgetModal(4)">
                 <img class="icon" src="/static/img/widgets/text.svg">
              </div>
              <div class="caption widget-bottom">
                Текст
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="widget">
              <div class="thumbnail earth-fon icon-fon" @click="openWidgetModal(5)">
                  <img class="icon earth" src="/static/img/widgets/earth.svg">
              </div>
              <div class="caption widget-bottom">
                WEB Страница
              </div>
            </div>
          </div>
          <div class="col-md-3">
             <div class="widget">
              <div class="thumbnail clock-fon icon-fon" @click="openWidgetModal(6)">
                <img class="icon" src="/static/img/widgets/clock.svg">
              </div>
              <div class="caption widget-bottom">
                Дата и Время
              </div>
             </div>
          </div>
          <div class="col-md-3">
            <div class="widget">
              <div class="thumbnail weather-fon icon-fon" @click="openWidgetModal(7)">
                <img class="icon" src="/static/img/widgets/weather.svg">
              </div>
              <div class="caption widget-bottom">
                Погода
              </div>
            </div>
          </div>
        </div>
       <div class="row row-op">
          <div class="col-md-3">
            <div class="widget">
              <div class="thumbnail twitter-fon icon-fon" @click="openWidgetModal(8)">
                <img class="icon" src="/static/img/widgets/twitter.svg">
              </div>
              <div class="caption widget-bottom">
                <p>Twitter</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="widget">
              <div class="thumbnail insta-fon icon-fon" @click="openWidgetModal(9)">
                <img class="icon" src="/static/img/widgets/insta.svg">
              </div>
              <div class="caption widget-bottom">
                <p>Instagram</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="widget">
              <div class="thumbnail rss-fon icon-fon" @click="openWidgetModal(10)">
                <img class="icon" src="/static/img/widgets/rss.svg">
              </div>
              <div class="caption widget-bottom">
                <p>RSS</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="widget">
              <div class="thumbnail parser-fon icon-fon" @click="openWidgetModal(11)">
                <img class="icon" src="/static/img/widgets/parser.svg">
              </div>
              <div class="caption widget-bottom">
                <p>Данные из JSON, XML</p>
              </div>
            </div>
          </div>
        </div>
       <div class="row row-op">
          <div class="col-md-3">
            <div class="widget">
              <div class="thumbnail powerpoint-fon icon-fon" @click="openWidgetModal(12)">
                <img class="icon" src="/static/img/widgets/powerpoint.svg">
              </div>
              <div class="caption widget-bottom">
                <p>Презентация</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="widget">
              <div class="thumbnail qr-fon icon-fon" @click="openWidgetModal(13)">
                <img class="icon" src="/static/img/widgets/qr.svg">
              </div>
              <div class="caption widget-bottom">
                <p>QR код</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="widget">
              <div class="thumbnail traffic-fon icon-fon" @click="openWidgetModal(14)">
                <img class="icon" src="/static/img/widgets/traffic.svg">
              </div>
              <div class="caption widget-bottom">
                <p>Пробки</p>
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <div class="widget">
              <div class="thumbnail qr-fon icon-fon" @click="openWidgetModal(100)">
                <img class="icon" src="/static/img/widgets/qr.svg">
              </div>
              <div class="caption widget-bottom">
                <p>copy</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row row-footer justify-content-end">
          <button
            class="btn btn-secondary"
            @click="active = false">Отмена</button>
        </div>

      </div>
    </b-modal>
    <ModalCreateText />
    <ModalCreateSite />
    <ModalDateAndTime />
    <ModalWeather />
    <ModalTwitter />
    <ModalInstagram />
    <ModalRSS />
    <ModalParser />
    <ModalCreatePDF />
    <ModalCreateQR />
    <ModalTraffic />
    <ModalTrafficCopy />
    
  </div>
</template>

<script>
  import ModalCreateText from './widgets/ModalCreateText'
  import ModalCreateSite from './widgets/ModalCreateSite'
  import ModalDateAndTime from './widgets/ModalDateAndTime'
  import ModalWeather from './widgets/ModalWeather'
  import ModalTwitter from './widgets/ModalTwitter'
  import ModalInstagram from './widgets/ModalInstagram'
  import ModalRSS from './widgets/ModalRSS'
  import ModalParser from './widgets/ModalParser'
  import ModalCreatePDF from './widgets/ModalCreatePDF'
  import ModalCreateQR from './widgets/ModalCreateQR'
  import ModalTraffic from './widgets/ModalTraffic'
  import ModalTrafficCopy from './widgets/ModalTrafficCopy'
  

  export default {
    name: 'modal-select-widget',
    components: {
      ModalCreateText,
      ModalCreateSite,
      ModalDateAndTime,
      ModalWeather,
      ModalTwitter,
      ModalInstagram,
      ModalRSS,
      ModalParser,
      ModalCreatePDF,
      ModalCreateQR,
      ModalTraffic,
      ModalTrafficCopy
    },
    computed: {
      active: {
        get () {
          return this.$store.getters.selectWidget
        },
        set (value) {
          this.$store.commit('TOGGLE_SELECT_WIDGET', value)
        }
      }
    },
    methods: {
      openWidgetModal (wType) {
        this.$store.commit('SET_MODAL_WIDGET_TYPE', wType)
        this.$store.commit('SET_MODAL_WIDGET_CONTENT', null)
      },
      openModal () {
        this.$store.commit('SET_MODAL_IS_OPEN', true)
      },
      closeModal () {
        this.$store.commit('SET_MODAL_IS_OPEN', false)
      }
    },
    data () {
      return {}
    }
  }
</script>

<style scoped>
  .select-widget .modal-title {
    margin-left: 20px;
    color: #736c6c;
  }
  .select-widget .widget-bottom {
    background-color: white;
    padding: 6px 0px;
    padding-left: 6px;
    font-size: 14px;
    color: #867d7d;
  }
  .select-widget .widget {
    box-shadow: 0px 3px 3px rgba(0,0,0,0.1);
  }
  .select-widget img {
    pointer-events: none;
  }
  .select-widget .thumbnail {
    cursor: pointer;
  }
  .select-widget .row-op {
    margin-bottom: 20px;
  }
  .clock-fon {
    background-image:
      url('/static/img/widgets/clock-fon.svg');
    background-size: cover;
  }
  .text-fon {
    background-image:
      url('/static/img/widgets/text-fon.svg');
  }
  .weather-fon {
    background-image:
      url('/static/img/widgets/weather-fon.svg');
    background-size: cover;
  }
  .icon {
    margin-top: 35px; 
  }
  .icon-fon {
    text-align: center;
    height: 128px;
  }
  .earth {
    width: 65px;
    height: 60px;
  }
  .earth-fon {
    /* background: linear-gradient(to right bottom, #313030, black); */  
    background-image:
      url('/static/img/widgets/earth-fon.svg');
    background-size: cover;
  }
  .twitter-fon {
    background-image:
      url('/static/img/widgets/twitter-fon.svg');
    background-size: cover;
  }
  .rss-fon {
    background-image:
      url('/static/img/widgets/rss-fon.svg');
    background-size: cover;
  }
  .insta-fon {
    background-image:
      url('/static/img/widgets/insta-fon.svg');
    background-size: cover;
  }
  .parser-fon {
    background-image:
      url('/static/img/widgets/parser-fon.svg');
    background-size: cover;
  }
  .powerpoint-fon {
    background-image:
      url('/static/img/widgets/powerpoint-fon.jpg');
    background-size: cover;
  }
  .powerpoint-fon img {
    width: 58px;
  }
  .qr-fon {
    background-image:
      url('/static/img/widgets/qr-fon.jpg');
    background-size: cover;
  }
  .qr-fon img {
    width: 58px;
  }
  .traffic-fon {
    background-image:
      url('/static/img/widgets/traffic-fon.jpg');
    background-size: cover;
  }
  .traffic-fon img {
    width: 58px;
  }
</style>
