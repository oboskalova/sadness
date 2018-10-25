<template>
  <p class="header-input input">
    
  </p>
</template>

<script>

export default {
  name: 'the-header-schedules-left-tools'
}
</script>

<style scoped>
  .header-input {
    width: calc(100% - 52px);
    margin: 0;
    margin-left: 10px;
    margin-top: 5px;
    position: relative;
  }
  .header-input > .mi {
    top: 50%;
    right: 6px;
    width: 25px;
    height: 28px;
    margin-top: -12px;
    font-size: 18px;
    transform: scale(-1, 1);
    display: block;
    position: absolute;
  }
  .header-input-core {
    width: 100%;
    height: 30px;
    padding-left: 1.5em;
    padding-right: 2em;
    color: #ffffff;
    border: 1px solid #ffffff;
    border-radius: 50px;
    background: none;
    outline: none;
  }
</style>