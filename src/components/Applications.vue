<template>
  <div>
    <div class="content row no-gutters">
      <main class="main col" @click.self="choose(-1)">
        <div class="file-manager container">
          <ApplicationsList 
            :catalogue="catalogue" 
            :isLoading="isLoading" />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import ApplicationsList from './ApplicationsList'
import { getApplications } from '../../api/applications.js'

export default {
  name: 'applications',
  components: { ApplicationsList },
  data: () => ({}),
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
      return this.$store.getters.scheduleLoading
    },
    catalogue () {
      return this.$store.getters.schedules
    },
    choosedObjects () {
      return this.$store.getters.choosedObjects
    },
    selectedSchedule () {
      return this.$store.getters.targetScheduleId
    },
    targetObject () {
      return this.$store.getters.firstSelected
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.$store.commit('TOOGLE_SCHEDULE_LOADING', true)
      return getApplications().then(response => {
        const data = response.data
        console.log(data)
        if (!data) return
        this.updateCatalogue(data)
        this.$store.commit('TOOGLE_SCHEDULE_LOADING', false)
      }).catch(error => {
        console.log(error)
        this.$store.commit('TOOGLE_SCHEDULE_LOADING', false)
      })
    },
    updateCatalogue (data) {
      this.$store.dispatch('uploadSchedules', data)
    },
    choose (index) {
      this.$store.commit('TOGGLE_SCHEDULE_OBJECT', index)
    }
  }
}
</script>
