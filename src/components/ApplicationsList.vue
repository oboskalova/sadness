<template>
  <div class="container-counted-height" @click.self="choose(-1)">
    <div class="row sorting-row no-gutters">
      <div 
        v-for="(item, index) in toolbarItems" 
        :key="index" 
        class="col">
        <button class="sort-button">
          {{ item.text }}
        </button>
      </div>
    </div>
    <img v-if="isLoading" src="/static/img/spinner.gif" class="loader">
    <div v-if="!isLoading">
      <div
        v-for="(app, index) in catalogue"
        :key="index"
        class="list-item no-gutters"
        :class="{'active': index === choosedIndex }"
        @click="choose(index)"
        @dblclick="dblclickHandler(app.url)">
        <div class="col">
          <img 
            :src="app.logo"
            class="app-img">
        </div>
        <div class="col">{{ app.OSVersion }}</div>
        <div class="col">{{ app.date }}</div>
        <div class="col">{{ app.appVersion }}</div>
        <div class="col">
          <a
            target="_blank" 
            :href="app.url" 
            class="app-download">
            <img src="/static/img/download-btn.png">
            Скачать
          </a> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'applications-list',
    props: ['catalogue', 'isLoading'],
    data: () => ({
      toolbarItems: [{
        text: 'Платформа'
      },
      {
        text: 'Версия ОС'
      },
      {
        text: 'Дата релиза'
      },
      {
        text: 'Версия'
      },
      {
        text: 'Действия'
      }]
    }),
    computed: {
      choosedIndex () {
        return this.$store.getters.targetScheduleId
      }
    },
    methods: {
      choose (index) {
        this.$store.commit('TOGGLE_SCHEDULE_OBJECT', index)
      },
      dblclickHandler (url) {
        window.open(url)
      }
    }
  }
</script>

<style scoped>
  .sorting-row {
    padding: 0 1.25rem;
    margin-top: 5px;
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
    width: 14px;
    margin-right: 6px;
  }
  .app-img {
    width: 115px;
    height: 30px;
  }
</style>