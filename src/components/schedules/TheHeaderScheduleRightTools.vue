<template>
  <div class="row no-gutters">
  </div>
</template>

<script>
  export default {
    name: 'the-header-displays-right-tools'
  }
</script>

<style scoped>
  .separated {
    margin-right: 15px;
    border-right: 1px solid #fff;
  }
  .icon-folder-arrow,
  .icon-insert-here {
    display: block;
    transition: background 150ms ease-in-out;
  }
  .icon-folder-arrow {
    width: 30px;
    height: 20px;
    margin: 0 2px;
    margin-top: 1px;
    background: url(/static/img/icons/folder-arrow-green.svg) no-repeat;
    background-size: contain;
  }
  .icon-insert-here {
    width: 25px;
    height: 25px;
    margin: 0 auto;
    background: url(/static/img/icons/move.svg) no-repeat;
    background-size: contain;
  }
  .header-btn:not([disabled]) > .icon-folder-arrow {
    background: url(/static/img/icons/folder-arrow.svg) no-repeat;
    background-size: contain;
  }
</style>