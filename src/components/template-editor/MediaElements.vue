<template>
  <div class="media-elements">
    <div v-if="!activeContainer.editPlaylist">
      У вас нет прав на редактирование содержимого, обратитесь к администратору
    </div>
    <button
      v-if="activeContainer.editPlaylist"
      class="btn btn-default media-elements-button"
      @click="openMediaModal">
      <span>
        <i class="mi mi-add"></i>
        Добавить медиафайл
      </span>
    </button>
    <button
      v-if="activeContainer.editPlaylist"
      class="btn btn-default media-elements-button"
      @click="openWidgetModal">
      <span>
        <i class="mi mi-add"></i>
        Добавить виджет
      </span>
    </button>
    <draggable
      class="scroller"
      v-if="activeContainer.editPlaylist"
      :list="mediaElements"
      @end="move">
      <MediaElementsItem
        v-for="media in mediaElements"
        :key="media.id"
        :media="media" />
    </draggable>
    <b-form-checkbox
      v-if="activeContainer.editPlaylist"
      class="media-elements-checkbox"
      v-model="flag"
      @change="updateRandomProp">
      В случайном порядке
    </b-form-checkbox>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import MediaElementsItem from './MediaElementsItem'

export default {
  name: 'media-elements',
  props: ['random', 'playlist'],
  watch: {
    random (value) {
      this.flag = value
    }
  },
  components: {
    draggable, MediaElementsItem
  },
  computed: {
    mediaElements: {
      get () {
        return [...this.$props.playlist]
      },
      set (value) {
        this.list = [...value]
      }
    },
    activeContainer () {
      return this.$store.getters.coreActiveContainer
    }
  },
  methods: {
    move () {
      this.$emit('update:playlist', this.mediaElements)
    },
    updateRandomProp (value) {
      this.$emit('update:random', value)
    },
    openMediaModal () {
      this.$store.commit('TOGGLE_SELECT_MEDIA', true)
    },
    openWidgetModal () {
      this.$store.commit('TOGGLE_SELECT_WIDGET', true)
    }
  },
  data () {
    return {
      list: [],
      flag: false
    }
  }
}
</script>

<style scoped>
.scroller {
  padding: 0.5rem;
  margin: -0.5rem;
  overflow-y: auto;
  height: calc(100vh - 270px);
}
.media-elements {
  padding: 0.5rem !important;
}
.media-elements-button {
  margin-bottom: 12px !important;
}
.media-elements-checkbox {
  margin-top: 1em;
  display: flex;
  align-items: center;
}
</style>