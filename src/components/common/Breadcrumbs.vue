<template>
  <div>
    <ul class="breadcrumbs">
      <li
        v-for="link in list"
        class="breadcrumbs-item">
        <a
          class="breadcrumbs-link"
          @click.prevent="clickHandler(link.href)">
          {{ link.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'breadcrumbs',
  props: ['list', 'action'],
  methods: {
    clickHandler (href) {
      if (typeof this.action === 'function') {
        this.action(href)
      } else {
        this.$router.push(href)
      }
    }
  }
}
</script>

<style scoped>
  .breadcrumbs {
    padding: 0.5rem 1.25rem;
    background: rgba(245,245,245,1);
  }
  .breadcrumbs-item {
    display: inline-block;
  }
  .breadcrumbs-item:before {
    content: '/';
    display: inline-block;
  }
  .breadcrumbs-link {
    padding: 0.25rem 0.5rem;
    display: inline-block;
    color: #00b0b7 !important;
  }
  .breadcrumbs-link:hover {
    color: #ff4080 !important;
  }
</style>