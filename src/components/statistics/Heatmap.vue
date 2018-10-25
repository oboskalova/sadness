<template>
  <div class="container">
    <div class="date-range">
      <div class="row no-gutters">
        <div class="col col-5">
          <InputDate
            :opened="closeAnotherDatepicher"
            :date="start"
            @update:date="validateStartDate" />
        </div>
        <div class="col col-1 text-center">
          -
        </div>
        <div class="col col-5">
          <InputDate
            :opened="closeAnotherDatepicher"
            :date="end"
            @update:date="validateEndDate" />
        </div>
        <div class="col col-1">
        </div>
      </div>
      <p class="message" v-if="errors.has('dateRange')">
        {{ errors.message('dateRange') }}
      </p>
      <div 
        class="scenes" 
        ref="scenes"
        :class="{ vertical: isScenesVertical }"
        v-if="scenesVisible">
        <div
          v-for="(scene, index) in scenes"
          :key="index"
          :class="{ active: index === activeScene }"
          :ref="'scene' + index"
          @click="selectScene(index)">
          <div
            class="scenes-preview">
            <main class="editor-main">
              <HeatEditorCore :loading="false" :activeScene="scenes[index].id"/>
            </main>
          </div>
          <div class="scenes-title">
            {{ scene.name }}
          </div>
        </div>
      </div>
    </div>

    <h5>Выбор элемента</h5>
    <div class="line">
      <div class="file-name">
        {{ selectedTemplate.name | truncate }}
      </div>
      <button
        class="btn btn-md btn-secondary"
        title="Выбрать файл"
        v-if="typeList[0].active"
        v-b-modal.selectTemplate>
        Выбрать шаблон
      </button>
    </div>

    <div v-if="filters.players.length || filters.schedules.length" @disabled="!filters.players" class="line">
      <div class="file-name players-select" @click="showSelection('schedules')" v-b-modal.selectDisplays>
        {{ textSchedules | truncate2 }}
        <div class="dropdown-icon">
          <i class="mi mi-keyboard-arrow-down mi-24"></i>
        </div>
      </div>
      <div class="file-name players-select" @click="showSelection('players')" v-b-modal.selectDisplays>
        {{ textPlayers | truncate2 }}
        <div class="dropdown-icon">
          <i class="mi mi-keyboard-arrow-down mi-24"></i>
        </div>
      </div>
    </div>

    <div v-if="empty && !isNewTemplate">
      Нет данных для отображения
    </div>

    <div v-if="!empty" class="Heatmap-container" ref="HeatmapContainer">
      <div class="Heatmap-title" v-if="title.length">
        {{ title }}
      </div>
      <div class="Heatmap-wrap" ref="HeatmapWrap">
        <main class="editor-main">
          <EditorCore :loading="false"/>
        </main>
        <canvas
          ref="heatCanvas"
          width="960"
          height="540">
        </canvas>
      </div>
    </div>

    <ModalTemplatesSearch @next="getTemplateInfo"/>
    <ModalSelectStatMedia @updateChart="getFilters"/>
    <ModalDisplaysSearch v-if="filters.players || filters.schedules" @updateChart="updateFilters" :mode="mode" :displays="modifyedFilters"/>
  </div>
</template>

<script>
  /* eslint-disable */
  import Validator from '../../../helpers/validator'
  import ValidationError from '../../../helpers/validation-error'
  import heatmapHelper from '../../../helpers/heatmap.js'
  import InputDate from '../common/InputDateShort'
  import ModalDisplaysSearch from './../modals/ModalStatSearch'
  import ModalTemplatesSearch from './../modals/ModalTemplatesSearch'
  import moment from 'moment'
  import { getHeatFilters, getTaps } from '../../../api/statistics'
  import ModalSelectStatMedia from '../modals/ModalSelectStatMedia'
  import EditorCore from '../template-editor/EditorCore'
  import HeatEditorCore from '../template-editor/HeatEditorCore'
  import { getPublishedTemplateInfo } from '../../../api/statistics'

  export default {
    name: 'statistics-shows',
    components: {
      InputDate,
      ModalSelectStatMedia,
      ModalDisplaysSearch,
      ModalTemplatesSearch,
      EditorCore,
      HeatEditorCore
    },
    filters: {
      truncate (value) {
        value += ''
        const maxNameLength = 30
        if (value.length > maxNameLength) {
          return value.substr(0, maxNameLength) + ' ...'
        }
        if (value === 'undefined') {
          return ''
        } else {
          return value
        }
      },
      truncate2 (value) {
        value += ''
        const maxNameLength = 23
        if (value.length > maxNameLength) {
          return value.substr(0, maxNameLength) + ' ...'
        }
        if (value === 'undefined') {
          return ''
        } else {
          return value
        }
      }
    },
    watch: {
      errors (v) {
        console.log(v)
      },
      id (v) {
        this.makeHeatmap()
      },
      start (v) {
        this.makeHeatmap()
      },
      end (v) {
        this.makeHeatmap()
      }
    },
    data: () => ({
      mode: 'players',
      heatData: undefined,
      scenes: [],
      title: '',
      scenesVisible: false,
      activeScene: 0,
      isScenesVertical: true,
      typeList: [
        {
          id: 1,
          text: 'Файл',
          active: true
        },
        {
          id: 2,
          text: 'Элемент шаблона',
          active: false
        }
      ],
      myChart: null,
      page: 'Shows',
      start: '"2018-08-22"',
      end: '"2018-08-28"',
      errors: {},
      mytension: 0,
      datepickers: {},
      empty: true,
      isNewTemplate: true,
      filters: {
        players: [],
        schedules: []
      },
      maxVal: 0
    }),
    created () {
      heatmapHelper()
      this.errors = new ValidationError()
    },
    mounted () {
      this.start = '"' + moment().subtract(4, 'days').format('YYYY-MM-DD') + '"'
      this.end = '"' + moment().format('YYYY-MM-DD') + '"'
    },
    beforeDestroy () {
      this.$store.commit('SELECT_STAT_FILE', {})
    },
    computed: {
      modifyedFilters () {
        return this.filters[this.mode].filter(el => el.show)
      },
      textPlayers () {
        var array = this.$store.getters.selectedStatDisplays
        if (array.length === 0) return 'Выберите плееры'
        if (array.length === 1) return array[0].name
        if (array.length > 1) return 'Выбрано плееров: ' + array.length
      },
      textSchedules () {
        var array = this.$store.getters.selectedStatSchedules
        if (array.length === 0) return 'Выберите расписания'
        if (array.length === 1) return array[0].name
        if (array.length > 1) return 'Выбрано расписаний: ' + array.length
      },
      textTemplates () {
        var array = this.$store.getters.selectedStatTemplates
        if (array.length === 0) return 'Выберите шаблоны'
        if (array.length === 1) return array[0].name
        if (array.length > 1) return 'Выбрано шаблонов: ' + array.length
      },
      selectedPlayers () {
        return this.$store.getters.selectedStatDisplays
      },
      selectedSchedules () {
        return this.$store.getters.selectedStatSchedules
      },
      selectedTemplate () {
        const template = this.$store.getters.selectedTemplate
        console.log(template)
        if (template) return template
        return {
          name: '',
          id: ''
        }
      },
      selectedTemplates () {
        return this.$store.getters.selectedStatTemplates
      }
    },
    methods: {
      getCoreStyles () {
        let coreWidth = 291
        let coreHeight = 150
        // if (this.isScenesVertical) {
        //   coreWidth = 150
        //   coreHeight = 291
        // }

        return { coreWidth, coreHeight }
      },
      showScenes () {
        this.scenesVisible = true
        this.$store.commit('SET_RESIZE_SCENES_CALLBACK', () => {
          const scenes = [...this.$refs.scenes.children]
          const core = scenes[0].querySelector('.core')
          const { coreWidth, coreHeight } = this.getCoreStyles()

          const scene = scenes[0].querySelector('.core-template')
          const width = parseInt(scene.style.width)
          const height = parseInt(scene.style.height)

          const widthCoefficient = coreWidth / width
          const heightCoefficient = coreHeight / height
          this.coefficient = widthCoefficient < heightCoefficient ? widthCoefficient : heightCoefficient

          scenes.forEach(scene => {
            const template = scene.querySelector('.core-template')
            const templateStyle = template.getAttribute('style')
            template.setAttribute('style', `${templateStyle}; top: 50%; left: 50%; transform: scale(${this.coefficient}) translate(-50%, -50%) !important`)
          })
        })
      },
      updateFilters () {
        console.log('updating selecting')
        for (let h in this.filters) {
          this.filters[h].forEach((el) => {
            el.show = true
          })
        }
        if (this.selectedSchedules[0]) {
          let schedulesArr = []
          let tempatesArr = []
          this.selectedSchedules.forEach((el) => {
            schedulesArr.push(el.id)
          })
          this.filters.players.forEach((ell) => {
            if (!schedulesArr.includes(ell.schedule)) {
              ell.show = false
            }
          })
        }
        if (this.selectedPlayers[0]) {
          let schedulesArr = []
          let tempatesArr = []
          this.selectedPlayers.forEach((el) => {
            schedulesArr.push(el.schedule)
          })
          this.filters.schedules.forEach((ell) => {
            if (!schedulesArr.includes(ell.id)) {
              ell.show = false
            }
          })
        }
        if (this.selectedTemplates[0]) {
          let schedulesArr = []
          let tempatesArr = []
          this.selectedTemplates.forEach((el) => {
            tempatesArr.push(el.id)
          })
          this.filters.schedules.forEach((ell) => {
            if (!schedulesArr.includes(ell.id)) {
              ell.show = false
            }
          })
          this.filters.players.forEach((ell) => {
            if (!schedulesArr.includes(ell.schedule)) {
              ell.show = false
            }
          })
        }
        this.fetchData()
      },
      showSelection (v) {
        this.mode = v
        this.$store.commit('TOGGLE_STAT_SEARCH', true)
      },
      getFilters () {
        return getHeatFilters(this.selectedTemplate.template_id)
          .then(r => r.data)
          .then(r => {
            if (!r) return
            this.filters = r
            for (let h in this.filters) {
              this.filters[h].forEach((el) => {
                el.show = true
              })
            }
            console.log('FILTERS: ', this.filters)
            this.updateFilters()
        })
      },
      selectFile () {
        this.$store.commit('TOGGLE_SELECT_STAT_MEDIA', true)
      },
      resetHeatmap () {
        this.empty = true
        this.scenes = []
        this.heatData = undefined
      },
      fetchData () {
        this.activeScene = 0

        const { template_id } = this.selectedTemplate
        if (!template_id) return
        if (this.myHeatmap) this.resetHeatmap()
        const options = {}
        options['template'] = template_id

        if (this.selectedPlayers[0]) {
          const arrPlayers = []
          this.selectedPlayers.forEach((el) => {
            arrPlayers.push(el.id)
          })
          options['players'] = arrPlayers
        }
        
        if (this.selectedSchedules[0]) {
          const arrSchedules = []
          this.selectedSchedules.forEach((el) => {
            arrSchedules.push(el.id)
          })
          options['schedules'] = arrSchedules
        }

        options['start'] = moment(this.start.slice(1, -1)).format('YYYY-MM-DD')
        options['end'] = moment(this.end.slice(1, -1)).format('YYYY-MM-DD')
        
        console.log('taps request', options)
        return getTaps(options).then(res => {
          this.heatData = res.data
        }).then(() => {
          this.drawHeatmap(0)
        })
      },
      closeAnotherDatepicher (context) {
        this.datepickers[context._uid] = context
        for (let uid in this.datepickers) {
          if (this.datepickers.hasOwnProperty(uid)) {
            const d = this.datepickers[uid]
            if (context._uid !== +uid) d.closeDatepicker()
          }
        }
      },
      validateStartDate (value) {
        this.start = value
        this.errors.pop('dateRange')
        if (!Validator.isBefore(value, this.end)) {
          this.errors.push('dateRange', 'Дата начала должна предшествовать дате окончания')
          this.empty = true
        } else {
          this.empty = false
          this.fetchData()
        }
      },
      validateEndDate (value) {
        this.end = value
        this.errors.pop('dateRange')
        if (!Validator.isBefore(this.start, value)) {
          this.errors.push('dateRange', 'Дата начала должна предшествовать дате окончания')
          this.empty = true
        } else {
          this.empty = false
          this.fetchData()
        }
      },
      async getTemplateInfo () {
        this.isNewTemplate = false
        this.$store.commit('UPDATE_STAT_SELECTED_SCHEDULES', [])
        this.$store.commit('UPDATE_STAT_SELECTED_PLAYERS', [])
        
        this.scenes = null
        const { id, name } = this.$store.getters.selectedTemplateData
        const result = await getPublishedTemplateInfo(id)
        console.log(result.data)  
        try {
          const { width, height } = JSON.parse(result.data.data)
          this.$store.commit('SELECT_TEMPLATE', {
            ...result.data,
            width,
            height,
            name,
            id: result.data.template_id
          })

          if (height > width) {
            this.isScenesVertical = true
          } else {
            this.isScenesVertical = false
          }

          const containers = JSON.parse(result.data.data).containers
          this.scenes = containers
            .filter(container => container.parent_id === 0)
            .sort((a, b) => a.order > b.order)

          this.showScenes()

          this.getFilters()
        } catch (ex) {
          console.log(ex)
          this.empty = true
          this.filters.schedules = []
          this.filters.players = []
          this.$store.commit('SELECT_TEMPLATE', {
            name,
            id: result.data.template_id
          })
        }
      },
      transformList (list = []) {
        let hierarchy = { settings: { id: 0 }, children: [] }
        list.sort((a, b) => (a.parent_id - b.parent_id))
        list.forEach(e => this.insertContainer(e, hierarchy))
        return hierarchy.children
      },
      insertContainer (container = {}, hierarchy = {}) {
        if (hierarchy.settings.id === container.parent_id) {
          if (!Array.isArray(container.playlist)) container.playlist = []
          hierarchy.children.push({ settings: container, children: [] })
        }
        hierarchy.children.forEach(e => this.insertContainer(container, e))
      },
      insertWidget (widget = {}, hierarchy = {}) {
        if (hierarchy.settings.id === widget.container_id) {
          hierarchy.settings.playlist.push(widget)
          return
        }
        hierarchy.children.forEach(e => this.insertWidget(widget, e))
      },
      distributeWidgets (widgets = [], hierarchy) {
        const h = { settings: { id: -1 }, children: hierarchy }
        widgets.forEach(e => this.insertWidget(e, h))
        return hierarchy
      },
      parseHeatData ({ cords }, coefficient) {
        const parsedData = []
        let max = 0
        cords.forEach(({ x, y, count }) => {
          parsedData.push([x * coefficient, y * coefficient, count])
          if (count > max) {
            max = count
          }
        })
        return { parsedData, max }
      },
      changeHeatmap (index, coefficient) {
        const canvas = this.$refs.heatCanvas
        const heat = window.simpleheat(canvas)
        const heatIndex = this.heatData.findIndex(data => {
          return data.scene_id === this.scenes[index].id
        })
        const heatData = this.heatData[heatIndex]

        try {
          const { parsedData, max } = this.parseHeatData(heatData, this.cordsCoefficient)
          heat.data(parsedData)
          heat.radius(25, 50)
          heat.max(max)
          heat.draw(0.2)
        } catch (ex) {
          heat.clear()
          heat.draw()
        }
      },
      getMergedHeatData () {
        const mergedHeatData = []
        
        if (!this.heatData.length) {
          return [{
            cords: [{
              x: -100,
              y: -100,
              count: 1
            }]
          }]
        }

        let scenesMap = new Map()
        this.heatData.forEach((data, index) => {
          data.cords = JSON.parse(data.cords)
          const { scene_id } = data
          if (scenesMap.has(data.scene_id)) {
            mergedHeatData[scenesMap.get(scene_id)].cords.push(...data.cords) 
          } else {
            scenesMap.set(scene_id, index)
            mergedHeatData.push(data)
          }
        })
        scenesMap = null

        mergedHeatData.forEach((data, mergedIndex) => {
          let cordsMap = new Map()
          data.cords.forEach(({ x, y, count }, index) => {
            if (cordsMap.has(`${x}-${y}`)) {
              const mapIndex = cordsMap.get(`${x}-${y}`)
              mergedHeatData[mergedIndex].cords[mapIndex].count += count 
              mergedHeatData[mergedIndex].cords.splice(index, 1)
            } else {
              cordsMap.set(`${x}-${y}`, index)
            }
          })
          cordsMap = null
        })

        console.log(mergedHeatData)

        return mergedHeatData
      },
      drawHeatmap (index) {
        this.empty = false

        this.heatData = this.getMergedHeatData()
        if (!this.heatData || !this.heatData.length) return

        this.title = this.scenes[index].name

        this.$store.commit('CHANGE_SCALE', { oldZoom: 0, newZoom: 0.5 })
        this.$store.commit('CHANGE_LOADING_STATE', true)
        this.$store.dispatch('fetchTemplate', {
          id: this.selectedTemplate.id
        })
        this.$store.dispatch('fetchPassport')
        const containersFetching = this.$store.dispatch('fetchContainersOf', {
          templateId: this.selectedTemplate.id
        })
        const widgetsFetching = this.$store.dispatch('fetchWidgetsOf', {
          templateId: this.selectedTemplate.id
        })
        
        Promise.all([containersFetching, widgetsFetching]).then(() => {
          setTimeout(() => {
            const { container, coefficient, canvas } = this.getDataForResize()

            this.resizeScene(container, coefficient)
            this.cordsCoefficient = this.resizeCanvas(index, coefficient)

            const heat = window.simpleheat(canvas)
            const heatIndex = this.heatData.findIndex(data => {
              return data.scene_id === this.scenes[index].id
            })
            const heatData = this.heatData[heatIndex]

            if (!heatData || heatData && !heatData.cords) return

            const { parsedData, max } = this.parseHeatData(heatData, this.cordsCoefficient)
            heat.data(parsedData)
            heat.radius(25, 50)
            heat.max(max)
            heat.draw(0.2)
          }, 0)
        })
      },
      getDataForResize () {
        const { width: sceneWidth, height: sceneHeight } = this.getWidgetsParams()
        const container = this.$refs.HeatmapWrap
        const width = parseInt(container.offsetWidth)
        const height = parseInt(container.offsetHeight)

        const widthCoefficient = width / sceneWidth
        const heightCoefficient = height / sceneHeight
        const coefficient = widthCoefficient < heightCoefficient ? widthCoefficient : heightCoefficient

        const canvas = this.$refs.heatCanvas

        return { container, coefficient, canvas }
      },
      resizeScene (container, coefficient) {
        const template = container.querySelector('.core-template')
        const newStyle = template.getAttribute('style') + ` transform: translate(-50%, -50%) scale(${coefficient}) !important;`
        template.setAttribute('style', newStyle);
      },
      resizeCanvas (index, coefficient) {
        const canvas = this.$refs.heatCanvas
        const { width, height } = this.getWidgetsParams()
        const { width: screenWidth, height: screenHeight } = this.$store.getters.selectedTemplate
        canvas.setAttribute('width', width + 'px')
        canvas.setAttribute('height', height + 'px')
        canvas.setAttribute('style', ` transform: translate(-50%, -50%) scale(${coefficient}) !important;`)
        
        let cordsCoefficient = width / screenWidth
        if (width < height) {
          cordsCoefficient = height / screenHeight
        }
        return cordsCoefficient
      },
      getWidgetsParams () {
        const container = this.$refs.HeatmapContainer.querySelector('.core-template')
        return { width: parseInt(container.style.width), height: parseInt(container.style.height) }
      },
      selectScene (index) {
        if (this.scenes.length <= 1) return
        this.$store.dispatch('selectContainer', this.scenes[index].id)

        this.activeScene = index
        this.title = this.scenes[index].name

        setTimeout(() => {
          const { container, coefficient } = this.getDataForResize()
          this.resizeScene(container, coefficient)
          this.changeHeatmap(index, coefficient)
        }, 0)
      },
      makeHeatmap () {

      }
    },
  }
</script>

<style scoped>
  .legend {
    margin-bottom: 10px;
  }
  .legend::before{
    float: left;
    margin-top: 5px;
    margin-right: 5px;
    content: '';
    width: 10px;
    height: 10px;
    display: block;
    background: #00b0b7;
    border-radius: 5px;
  }
  .typeSelect {
    width: 160px;
    margin: 0!important;
    margin-right: 10px!important;
    display: inline-block;
  }
  .container {
    margin-top: 1em;
  }
  .date-range {
    float: right;
    width: 325px;
    height:100px;
  }
  .date-range .text-center {
    padding-top: 10px;
  }
  .line {
    height: 70px;
  }
  .file-name {
    float: left;
    height: 40px;
    margin-top: 5px;
    width: 300px;
    margin-right: 10px;
    border-bottom: 1px solid #bdbdbd !important;
    padding: 9px 0px!important;
  }
  .dropdown-icon {
    float: right;
  }
  .players-select {
    width: 200px;
    cursor: pointer;
  }
  .Heatmap-container {
    position: relative;
    max-height: 400px;
    height: 100%;
    width: calc(100% - 345px);
  }
  .Heatmap-wrap {
    position: relative;
    max-height: 370px;
    height: 100%;
  }
  @media screen and (max-width: 1500px) {
    .Heatmap-wrap {
      max-height: 290px;
    }
  }
  .Heatmap-container .editor-main {
    height: 100%;
    pointer-events: none;
    width: 100%;
    position: absolute;
  }
  .Heatmap-container canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .scenes {
    margin-top: 20px;
    overflow: auto;
    cursor: pointer;
    max-height: calc(100vh - 135px);
  }
  .scenes > div {
    padding: 17px 17px 2px;
  }
  .scenes > .active {
    background-color: #ececec;
  }
  .scenes > div:first-child {
    padding-top: 17px;
  }
  .scenes > div:last-child {
    padding-bottom: 17px;
  }
  .scenes-title {
    margin-top: 5px;
    text-align: center;
  }
  .scenes-preview {
    width: 100%;
    height: 150px;
  }
  .scenes.vertical {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .scenes.vertical  > div {
    height: 198px;
    width: 150px;
  }
  .container {
    max-height: calc(100vh - 70px);
    height: 100%;
    overflow: hidden;
  }
  .scenes-preview {
    overflow: hidden;
    position: relative;
  }
  .scenes-preview > div {
    pointer-events: none;
    /* width: 100% !important; */
    /* height: 100% !important; */
    transform: scale(0.15) translate(-285%, -284%);
  }
</style>

<style>
  .Heatmap-container .scroll {
    display: none;
  }
  .Heatmap-container .core-template, .Heatmap-container .core-container {
    box-shadow: none !important;
  }
  .Heatmap-container .core > .core-template {
    background-color: #ececec;
    overflow: hidden;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
  }
  .Heatmap-title {
    width: 100%;
    text-align: center;
    font-size: 18px;
    margin: 5px 0 15px;
  }
  .scenes .scroll {
    display: none;
  }
  .scenes .editor-main {
    height: 100%;
    pointer-events: none;
  }
  .scenes .core > .core-template {
    height: 100%;
    transform-origin: 0 0;
  }

</style>