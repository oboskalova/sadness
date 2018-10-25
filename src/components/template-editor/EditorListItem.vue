<template>
  <div
    class="list-item no-gutters"
    :class="{'active': choosed}"
    @click="choose"
    @dblclick="dblclickHandler">
    <div class="col col-5">
      <i v-if="orient" class="mi mi-crop-landscape" title="Горизонтальный"></i> 
      <i v-else class="mi mi-crop-portrait" title="Вертикальный"></i> 
      {{ obj.name }}
    </div>
    <div class="col col-5">{{ obj.published | publishValue }}</div>
    <div class="col col-2">{{ obj.updated_at | formatDate }}</div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'editor-list-item',
  props: ['obj'],
  computed: {
    targetTemplateId () {
      return this.$store.getters.targetTemplateId
    },
    choosed () {
      return this.targetTemplateId === this.obj.id
    },
    orient () {
      return this.obj.width > this.obj.height
    }
  },
  filters: {
    formatDate (value) {
      const date = moment.utc(value).format()
      if (date === 'Invalid Date') return value
      return moment(date).format('DD.MM.YYYY  HH:mm')
    },
    publishValue (value) {
      return value ? 'Опубликовано' : 'Не опубликовано'
    }
  },
  methods: {
    choose () {
      this.$store.commit('TOGGLE_TEMPLATE_OBJECT', this.obj)
    },
    dblclickHandler () {
      if (!this.choosed) this.choose()
      this.$router.push('/editor/' + this.obj.id)
    }
  }
}
</script>

<style scoped>
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
.mi {
  top: 2px;
  color: #00b2b7;
  margin-right: 3px;
  margin-left: -21px;
}
.mi-crop-portrait {
  color: #ff4080;
}
</style>
