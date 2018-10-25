<template>
  <div class="container-counted-height">
    <div class="row sorting-row no-gutters">
      <div
        v-for="(item, index) in toolbarItems" 
        :key="index" 
        class="col">
        <button @click="sort(item.key)" class="sort-button">
          {{ item.text }}
          <i class="mi mi-arrow-drop-down" v-if="sortAscending(item.key)"></i>
          <i class="mi mi-arrow-drop-up" v-if="sortDescending(item.key)"></i>
        </button>
      </div>
    </div>
    <img v-if="isLoading" src="/static/img/spinner.gif" class="loader">
    <div v-if="!isLoading">
      <div
        v-for="(font, index) in sortedCatalogue"
        :key="index">
        <FontsListItem :font="font">
          <div class="col font-example"
            :class="font.className">
            Аа
          </div>
          <div class="col">{{ font.name }}</div>
          <div class="col">{{ font.family }}</div>
          <div class="col">{{ font.updated_at }}
            <i 
              @click="$emit('deleteFont', font.id)"
              class="mi mi-delete mi-ml"></i>
            <i 
              v-b-modal.FontsModal
              @click="$emit('modifyFont', font)"
              class="mi mi-edit mi-ml"></i>
          </div>
        </FontsListItem>
      </div>
    </div>
  </div>
</template>

<script>
  import FontsListItem from './FontsListItem'

  export default {
    name: 'fonts-list',
    props: ['catalogue', 'isLoading'],
    components: { FontsListItem },
    data: () => ({
      sortingDirections: {
        view: 0,
        name: 0,
        family: 0,
        updated_at: 0
      },
      sorted: false,
      sortedField: null,
      toolbarItems: [{
        text: 'Вид',
        key: 'view'
      },
      {
        text: 'Название',
        key: 'name'
      },
      {
        text: 'Семейство шрифта',
        key: 'family'
      },
      {
        text: 'Изменен',
        key: 'updated_at'
      }]
    }),
    computed: {
      sortedCatalogue () {
        if (!this.sorted) return this.catalogue
        this.catalogue.forEach(({ name }, index, arr) => {
          arr[index].className = 'q' + name.split(' ').join('').replace('!', '')
        })

        const { sortedField } = this

        const sorted = this.catalogue.sort(
          (a, b) => a[sortedField].localeCompare(b[sortedField]) ? -1 : 1
        )
        sorted.forEach(({ name }) => console.log(name))
        return sorted
      }
    },
    methods: {
      sort (key) {
        this.sorted = true
        this.sortedField = key

        for (const fieldname in this.sortingDirections) {
          if (fieldname !== key) {
            this.sortingDirections[fieldname] = 0
          }
        }

        let direction = this.sortingDirections[key]
        if (direction === -1 || direction === 1) {
          direction = -direction
        }
        if (this.sortingDirections[key] === 0) {
          direction = -1
        }

        this.sortingDirections[key] = direction
      },
      sortAscending (key) {
        return (this.sortingDirections[key] === 1)
      },
      sortDescending (key) {
        return (this.sortingDirections[key] === -1)
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
  .font-example {
    font-size: 22px;
  }
  .mi-ml {
    width: 10px;
    float: right;
    transform: scale(1.5)
  }
  .mi-ml:last-child {
    margin-right: 20px;
  }
</style>