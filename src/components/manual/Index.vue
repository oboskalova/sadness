<template>
  <div>
    <div class="content row no-gutters">
      <main class="main col" @click.self="choose(-1)">
        <div class="file-manager container">
          <div class="container-counted-height" @click.self="choose(-1)">

            <div class="row sorting-row no-gutters">
              <div
                v-for="(title, index) in titles"
                :key="index"
                class="col"
                :class="'col-' + title.size">
                <button class="sort-button">
                  {{ title.value }}
                </button>
              </div>
            </div>

            <div
              v-for="(video, index) in videos"
              :key="index"
              class="list-item no-gutters"
              :class="{'active': index === choosedIndex }"
              @click="choose(index)"
              @dblclick="openFileViewer(video)">
              <div class="col col-2">
                <img
                  @click="openFileViewer(video)"
                  :src="video.thumbnail"
                  class="video-img">
              </div>
              <div class="col col-6">{{ video.description }}</div>
              <div class="col col-2">{{ video.date }}</div>
              <div class="col col-2">
                <div
                  @click="openFileViewer(video)"
                  class="app-download">
                  <img src="/static/img/watch-btn.svg">
                  Смотреть
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>

    <b-modal centered
      v-model="active"
      :title="openedVideo.name"
      size="lg"
      no-close-on-backdrop
      hide-footer>
      <div v-if="active">
        <video-player
          class="video-player-box"
          ref="videoPlayer"
          :options="videoPlayerOptions"
          :playsinline="true">
        </video-player>
      </div>
    </b-modal>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'

export default {
  name: 'manual',
  components: { videoPlayer },
  data: () => ({
    active: false,
    openedVideo: {},
    titles: [
      {
        value: 'Тип материала',
        size: 2
      },
      {
        value: 'Описание',
        size: 6
      },
      {
        value: 'Дата обновления',
        size: 2
      },
      {
        value: 'Действия',
        size: 2
      }
    ],
    videos: [
      {
        description: 'Создание шаблона',
        type: 'video/webm',
        date: '01.01.2018',
        thumbnail: 'https://visionapi.cubicservice.ru/storage/temp/20180912_0521_0328.png',
        src: 'https://visionapi.cubicservice.ru/storage/temp/20180912_0522_3782.webm'
      },
      {
        description: 'Создание расписания',
        type: 'video/webm',
        date: '01.01.2018',
        thumbnail: 'https://visionapi.cubicservice.ru/storage/temp/20180912_0521_7621.png',
        src: 'https://visionapi.cubicservice.ru/storage/temp/20180912_0523_4452.webm'
      },
      {
        description: 'Добавление плеера',
        type: 'video/webm',
        date: '01.01.2018',
        thumbnail: 'https://visionapi.cubicservice.ru/storage/temp/20180912_0521_5134.png',
        src: 'https://visionapi.cubicservice.ru/storage/temp/20180912_0524_4408.webm'
      },
      {
        description: 'Добавление пользователей и права',
        type: 'video/webm',
        date: '01.01.2018',
        thumbnail: 'https://visionapi.cubicservice.ru/storage/temp/20180912_0522_3355.png',
        src: 'https://visionapi.cubicservice.ru/storage/temp/20180912_0525_7346.webm'
      },
      {
        description: 'Использование статистики воспроизведения',
        type: 'video/webm',
        date: '01.01.2018',
        thumbnail: 'https://visionapi.cubicservice.ru/storage/temp/20180912_0522_6352.png',
        src: 'https://visionapi.cubicservice.ru/storage/temp/20180912_0525_8069.webm'
      }
    ]
  }),
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
    choosedIndex () {
      return this.$store.getters.targetScheduleId
    },
    videoPlayerOptions () {
      const type = this.openedVideo.type
      const src = this.openedVideo.src
      return {
        width: '770px',
        autoplay: true,
        muted: false,
        language: 'ru',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{ type, src }]
      }
    },
    targetObject () {
      return this.$store.getters.firstSelected
    }
  },
  methods: {
    openFileViewer: function (data) {
      this.openedVideo = data
      console.log(this.openedVideo)
      this.active = true
    },
    choose (index) {
      this.$store.commit('TOGGLE_SCHEDULE_OBJECT', index)
    }
  }
}
</script>

<style scoped>
  .sorting-row {
    margin-top: 5px;
    padding: 0 1.25rem;
  }
  .back-button,
  .sort-button {
    border: none;
    cursor: pointer;
    outline: none;
    text-decoration: none;
    transition: all .2s ease-in-out;
  }
  .back-button {
    width: 46px;
    height: 100%;
    padding: 0;
    font-size: 1.5rem;
    color: #00b0b7;
    background: url(/static/img/icons/back.svg) no-repeat;
    background-size: 24px;
    background-position: left 3px;
  }
  .sort-button {
    width: 100%;
    margin-bottom: 0.25rem;
    padding: 0.5rem;
    padding-left: 0;
    text-align: left;
    font-size: 14px;
    color: #00b0b7;
    font-weight: bold;
    background: none;
  }
  .back-button:hover,
  .sort-button:hover {
    color: #ff4080;
  }
  .list-item {
    padding: 0.75rem 1.25rem;
    border-top: 1.5px solid rgba(235,235,235,1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .list-item.active {
    border-color: rgba(245,245,245,1);
    background-color: rgba(245,245,245,1);
  }
  .list-item.active + .list-item {
    border-color: rgba(245,245,245,1);
  }
  .scheduler {
    color: #00b0b7;
  }
  .scheduler:hover {
    color: #ff4080;
  }
  .mi-error {
    top: 2px;
  }
  .mi-check-circle {
    top: 2px;
  }
  .redText {
    color: red;
  }
  .greenText {
    color: green;
  }
  .app-download {
    display: flex;
    align-items: center;
    color: #46494c;
    text-decoration: underline;
  }
  .app-download img {
    width: 18px;
    margin-right: 6px;
    opacity: 0.5;
  }
  .app-img {
    width: 115px;
    height: 30px;
  }
  .modal-body .video-js {
    width: auto !important;
  }
  .header {
    text-align: center;
  }
  .name {
    font-size: 20px;
  }
  .image {
    width: 220px;
    height: 150px;
    cursor: pointer;
  }
  .img-wrp {
   padding-left: 10px;
  }
  .num {
    text-align: center;
    font-size: 20px;
  }
  .video-img {
    height: 30px;
  }
</style>


