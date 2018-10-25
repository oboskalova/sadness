<template>
  <b-modal centered
    id="selectTemplate"
    ref="selectTemplate"
    size="lg"
    title="Выбрать шаблон" 
    cancel-title="Отмена"
    @show="openModal"
    @hide="closeModal"
    :hide-footer="isChanging"
    @cancel="clearQuery">
    <div class="search-display-wrap">
      <i class="mi mi-search search-display-icon"></i>
      <input
        v-model="query"
        name="query"
        class="search-display-input">
      <button
        v-if="!isEmpty"
        @click="clearQuery"
        class="search-display-clear">
        очистить
      </button>
    </div>
    <div class="row no-gutters header">
      <div class="col col-10">Название шаблона</div>
      <div class="col col-2">Опубликован</div>
    </div>
    <div class="bounded">
      <div
        class="row no-gutters list-item"
        v-for="c in searchRes"
        :key="c.id"
        @click="selectTemplate(c.id, c.name)">
        <div class="col col-10">{{ c.name }}</div>
        <div class="col col-2">
          {{ c.published ? 'да' : 'нет' }}
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
import { getTemplateObjects } from '../../../api/template-editor'

export default {
  name: 'modal-search-displays',
  computed: {
    query: {
      get () {
        return this.$store.getters.searchTemplatesQuery
      },
      set (value) {
        const q = value.trim()
        this.$store.commit('UPDATE_TEMPLATES_SEARCH_QUERY', q)
      }
    },
    isEmpty () {
      // return this.query.length === 0
      return true
    },
    searchRes () {
      return this.$store.getters.editorCatalogue.filter(el => el.name.toLowerCase().indexOf(this.query.toLowerCase()) + 1)
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    openModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', true)
    },
    closeModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', false)
    },
    clearQuery () {
      this.query = ''
    },
    selectTemplate (id, name) {
      this.$store.commit('SELECT_TEMPLATE_DATA', { id, name })
      this.$store.commit('SELECT_TEMPLATE_ITEM', id)
      this.$refs.selectTemplate.hide()
      this.$emit('next')
    },
    fetchData: function () {
      this.isLoading = true
      this.$store.commit('TOGGLE_TEMPLATE_OBJECT', {})
      return getTemplateObjects().then(response => {
        const data = response.data
        if (!data) return
        this.$store.dispatch('uploadTemplates', data)
        this.isLoading = false
        this.changedColor = false
      })
    }
  },
  data () {
    return {
      displaysSelection: [],
      isChanging: false
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
  padding: 4px 0;
  margin-right: 15px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1.5px solid rgba(235,235,235,1);
  align-items: center;
}
.list-item {
  padding: 4px 0;
  cursor: pointer;
}
</style>