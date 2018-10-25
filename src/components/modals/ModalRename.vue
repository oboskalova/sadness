<template>
  <b-modal centered
    v-model="active"
    @show="openModal"
    @hide="closeModal"
    title="Переименование" 
    ok-title="Сохранить"
    cancel-title="Отмена"
    :hide-footer="isChanging"
    @cancel="clear"
    @ok="changeItem">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link" href="#" :class="{ 'active': activeTab === 0 }" @click="toggleTo(0)">Свойства</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" :class="{ 'active': activeTab === 1 }" @click="toggleTo(1)">Теги</a>
      </li>
    </ul>
    <div v-show="!activeTab">
      <p class="label">Новое название</p>
      <input
        class="input"
        ref="name"
        type="text"
        :disabled="isChanging"
        v-model="newName">
      <p v-if="isPlayer" class="label">Расписание</p>
      <div v-if="isPlayer" class="borderer">
        <p v-if="!schedule" class="scheduler" @click="editor"><span>Назначить новое расписание</span></p>
        <p v-if="schedule" class="scheduler"><span @click="goTo">{{ schedule.name}}  </span> <i title="Изменить" class="mi mi-edit" @click="editor"></i></p>
      </div>
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
</template>

<script>
import { editDisplayObject } from '../../../api/display-manager'
import { editScheduleObject } from '../../../api/schedule-manager'

export default {
  name: 'modal-rename',
  computed: {
    active: {
      get () {
        var path = this.$route.path
        if (path === '/players' && this.$store.getters.targetDisplayId) {
          const elem = this.$store.getters.displays.find(e => e.id === this.$store.getters.targetDisplayId)
          this.newName = elem.name
          this.tagsArray = elem.tagsArray
          this.schedule = elem.schedule
          this.id = this.$store.getters.targetDisplayId
        }
        if (path === '/schedules' && this.$store.getters.targetScheduleId) {
          const elem = this.$store.getters.schedules.find(e => e.id === this.$store.getters.targetScheduleId)
          this.newName = elem.name
          this.tagsArray = elem.tagsArray
        }
        return this.$store.getters.renameItem
      },
      set (value) {
        this.$store.commit('TOGGLE_RENAME', value)
      }
    },
    isPlayer () {
      return this.$route.path === '/players'
    }
  },
  methods: {
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
    goTo () {
      this.$router.push('/schedules/' + this.id + '?p=1')
    },
    editor () {
      this.$emit('assign', this.id)
    },
    changeItem () {
      var path = this.$route.path
      let obj = {}
      obj.tags = JSON.stringify(this.tagsArray)
      var older = []
      older = older.concat(this.tagsArray)
      obj.megaTags = older
      obj.megaTags.push(this.newName)
      obj.megaTags = JSON.stringify(obj.megaTags.sort())
      if (path === '/players') {
        obj.name = this.newName
        obj.id = this.$store.getters.targetDisplayId
        return editDisplayObject(obj).then(response => {
          const data = response.data
          if (!data) return
          // this.$store.commit('RENAME_DISPLAY_ITEM', obj)
          this.$root.$emit('resetQQuery')
          this.clear()
          this.isLoading = false
        }).catch(error => {
          console.log(error)
          this.isLoading = false
        })
      }
      if (path === '/schedules') {
        obj.name = this.newName
        obj.id = this.$store.getters.targetScheduleId
        return editScheduleObject(obj).then(response => {
          const data = response.data
          if (!data) return
          // this.$store.commit('RENAME_SCHEDULE_ITEM', obj)
          this.$root.$emit('resetQQuery')
          this.clear()
          this.isLoading = false
        }).catch(error => {
          console.log(error)
          this.isLoading = false
        })
      }
    },
    clear () {
      this.newName = ''
      this.newTags = ''
      this.tagsArray = []
      this.schedule = null
      this.id = 0
    },
    openModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', true)
    },
    closeModal () {
      this.$store.commit('SET_MODAL_IS_OPEN', false)
    }
  },
  data () {
    return {
      activeTab: 0,
      newTags: '',
      tagsArray: [],
      newName: '',
      id: 0,
      schedule: null,
      isChanging: false
    }
  }
}
</script>

<style scoped>
.scheduler{
  color: #00b0b7;
  cursor: pointer;
}
.scheduler span:hover, .scheduler i:hover{
  color: #ff4080;
}
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
  overflow-y: auto;
}
.header {
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
.label {
  margin-bottom: 0;
}
.input {
  margin-bottom: 1.2rem;
}
.borderer {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #bdbdbd;
  border-radius: 0;
  outline: none;
  height: 2.1rem;
  width: 100%;
  font-size: 1rem;
  box-sizing: content-box;
}
.borderer p{
  padding-top: 4px;
}
.borderer span {
  margin-right: 5px;
}
.mi-edit{
  font-size: 19px;
  top: 3px;
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
ul.nav{
  margin-bottom: 10px;
}
</style>