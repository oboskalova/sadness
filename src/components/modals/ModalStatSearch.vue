<template>
  <b-modal centered
    v-model="active"
    size="lg"
    title="Выбрать элементы фильтра" 
    cancel-title="Отмена"
    :hide-footer="isChanging"
    @ok="updateDisplays"
    @cancel="clearQuery"
    @show="openModal"
    @hide="closeModal">
    <div class="search-display-wrap">
      <i class="mi mi-search search-display-icon"></i>
      <input
        v-model="query"
        name="query"
        @input="search"
        class="search-display-input">
      <button
        v-if="!isEmpty"
        @click="clearQuery"
        class="search-display-clear">
        очистить
      </button>
    </div>
    <div class="row no-gutters header">
      <div class="col col-9">Название</div>
      <div class="col col-3">
        <input type="checkbox" id="checkbox" :indeterminate.prop="this.indeterminate" v-model="all" @change="select">
        <label for="checkbox" class="labl">Выбрать</label>
      </div>
    </div>
    <div class="bounded">
      <div
        class="row no-gutters list-item"
        v-for="c in searchRes"
        :key="c.id"
        :show="c.show">
        <div class="col col-9">{{ c.name }}</div>
        <div class="col col-3">
          <b-form-checkbox v-model="c.selected" @change="pick">
            {{ c.selected ? 'да' : 'нет' }}
          </b-form-checkbox>
        </div>
      </div>
    </div>
    <img
      v-if="isChanging"
      src="/static/img/spinner.gif"
      class="loader">
  </b-modal>
</template>

<script>

export default {
  name: 'modal-search-stats',
  props: ['displays', 'mode'],
  computed: {
    query: {
      get () {
        return this.$store.getters.searchDisplayQuery
      },
      set (value) {
        const q = value.trim()
        this.$store.commit('UPDATE_DISPLAY_SEARCH_QUERY', q)
      }
    },
    active: {
      get () {
        return this.$store.getters.statSearch
      },
      set (value) {
        this.$store.commit('TOGGLE_STAT_SEARCH', value)
      }
    },
    isEmpty () {
      // return this.query.length === 0
      return true
    },
    searchRes () {
      return this.displaysSelection.filter(el => el.show)
    },
    selected () {
      if (this.mode === 'schedules') {
        return this.$store.getters.selectedStatSchedules
      }
      if (this.mode === 'players') {
        return this.$store.getters.selectedStatDisplays
      }
      if (this.mode === 'templates') {
        return this.$store.getters.selectedStatTemplates
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    clearQuery () {
      this.query = ''
      this.search()
    },
    search () {
      const query = this.query
      this.displaysSelection.forEach((el) => {
        if (el.name.toLowerCase().indexOf(query.toLowerCase()) + 1) {
          el.show = true
        } else {
          el.show = false
        }
      })
    },
    select () {
      setTimeout(() => {
        this.displaysSelection.forEach((el) => {
          el.selected = this.all
        })
        this.indeterminate = false
      }, 200)
    },
    pick () {
      setTimeout(() => {
        var status = false
        var allCheck = true
        if (this.displaysSelection.length === 0) allCheck = false
        this.displaysSelection.filter(el => el.show).forEach((el) => {
          if (el.selected) {
            if (!status) {
              status = true
            }
          } else {
            allCheck = false
          }
        })
        if (allCheck) {
          this.all = true
          this.indeterminate = false
        } else {
          this.all = false
          this.indeterminate = status
        }
      }, 200)
    },
    updateDisplays () {
      this.$store.commit('UPDATE_STAT_SELECTED_' + this.mode.toUpperCase(), this.displaysSelection.filter(el => el.selected))
      this.$emit('updateChart')
    },
    updateSelection () {
      let rights = Object.create(null)
      console.log(this.displays)
      this.displaysSelection = this.displays.map(e => {
        return {
          id: e.id,
          name: e.name,
          pincode: e.pincode,
          schedule: e.schedule,
          playlist: e.playlist,
          selected: false,
          show: true
        }
      })
      this.selected.forEach(e => {
        rights[e.id] = e
      })
      this.displaysSelection.forEach(e => {
        const r = rights[e.id]
        if (r) {
          e.selected = true
        }
      })
      this.pick()
    },
    fetchData: function () {
      this.updateSelection()
    },
    openModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', true)
      this.updateSelection()
    },
    closeModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', false)
    }
  },
  data () {
    return {
      displaysSelection: [],
      isChanging: false,
      all: false,
      indeterminate: false
    }
  }
}
</script>

<style scoped>
.search-display-wrap {
    margin-top: 10px;
    margin-bottom: 10px;
    color: rgba(11, 195, 203, 1);
    position: relative;
}
  .search-display-icon {
    top: 50%;
    left: 11px;
    position: absolute;
    font-size: 18px;
    transform: translateY(-50%);
  }
  .search-display-input {
    width: 100%;
    height: 32px;
    padding: 0 80px 0 38px;
    border: 1px solid rgba(11, 195, 203, 1);
    border-radius: 20px;
    outline: none;
  }
  .search-display-clear {
    top: 50%;
    right: 12px;
    cursor: pointer;
    border: none;
    color: inherit;
    background: none;
    position: absolute;
    transform: translateY(-50%);
  }
  .bounded {
  margin: 1rem 0;
  max-height: 160px;
  overflow-y: scroll;
}
.header {
  width: calc(100% - 14px);
  padding: 4px 0;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1.5px solid rgba(235,235,235,1);
  align-items: center;
}
.list-item {
  padding: 4px 0;
}
.labl {
  position: absolute;
  top: 5px;
}
#checkbox {
  margin-top: 5px;
  margin-right: 5px;
}
</style>