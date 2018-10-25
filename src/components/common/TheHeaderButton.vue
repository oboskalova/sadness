<template>
  <button
    class="header-btn"
    :title="title">
    <i :class="iconClass"></i>
  </button>
</template>

<script>
export default {
  name: 'the-header-button',
  props: ['icon', 'title'],
  computed: {
    iconClass () {
      return `mi mi-${icon}`
    }
  }
}
</script>

<style scoped>
  .header-btn {
    width: 40px;
    height: 40px;
    margin: 0;
    margin-right: 15px;
    border: none;
    background: none;
    cursor: pointer;
    transition: all .15s ease-in-out;
    border-radius: 50%;
    text-align: center;
    display: inline-block;
    vertical-align: middle;
  }
  .header-btn:not([disabled]):hover:active {
    background-color: #ff4080;
  }
  .header-btn:not([disabled]):hover {
    background-color: #00c5cc;
  }
  .header-btn > .mi {
    top: 0;
    margin-left: -1px;
    line-height: 40px;
    font-size: 30px;
    transition: color 150ms ease-in-out;
    color: white;
  }
  .header-btn[disabled] > .mi {
    color: #008f94;
  }
  .header-btn[disabled] {
    cursor: default;
  }
</style>
