<template>
  <div v-if="can">
    <div class="content row no-gutters">
      <aside class="aside col stats">
        <div class="aside-stat-tree">
          <ul class="stat-tree">
            <li class="stat-tree-node">
              <a :class="{ 'stat-tree-link link': true, 'active': page === 'Shows' }" @click="changePage('Shows')">
              <span class="link-inner">Показы</span></a>
            </li>
            <li class="stat-tree-node">
              <a :class="{ 'stat-tree-link link': true, 'active': page === 'Heatmap' }" @click="changePage('Heatmap')">
              <span class="link-inner">Тепловые карты</span></a>
            </li>
          </ul>
        </div>
      </aside>
      <main class="main col">
        <component :is="page" />
      </main>
    </div>
  </div>
  <div v-else>
    У вас нет прав на просмотр содержимого страницы
  </div>
</template>

<script>
  import Shows from './Shows'
  import Heatmap from './Heatmap'
  import RulesChecker from '../../../helpers/rulesChecker'

  export default {
    name: 'statistics',
    components: {
      Shows,
      Heatmap
    },
    data () {
      return {
        page: 'Shows',
        can: false
      }
    },
    mounted () {
      this.$store.commit('SELECT_TEMPLATE', {})
      this.checkRule()
    },
    methods: {
      checkRule () {
        if (this.$store.getters.passport.id && this.$store.getters.userGroup.length > 0) {
          console.log('rule check', RulesChecker.canUserDo('statistics', null, this.$store.getters))
          this.can = RulesChecker.canUserDo('statistics', null, this.$store.getters)
        } else {
          console.log('make a timer')
          setTimeout(() => { this.checkRule() }, 200)
        }
      },
      changePage (data) {
        if (data !== 'Heatmap') {
          this.$store.commit('SELECT_TEMPLATE', {})
        }
        this.page = data
      }
    }
  }
</script>

<style scoped>
  .aside-stat-tree {
    margin-top: 1em;
  }
  .stats {
    min-width: 20%;
    max-width: 20%;
    height: 100%;
    color: #ffffff;
    background: #333333;
    position: relative;
    flex: 1;
  }
  .stat-tree {
    margin: 0;
    padding: 0;
    display: block;
    list-style-type: none;
  }
  .stat-tree-link {
    padding: .9rem;
    padding-left: 2.4rem;
    display: block;
    color: #fff;
  }
  .stat-tree-link.active {
    background: #282828;
  }
</style>