<template>
  <div class="auth">
    <div class="auth-inner">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'auth'
}
</script>

<style>
  .auth {
    top: 0;
    width: 100%;
    height: 100vh;
    position: absolute;
    background: #00b0b7;
    z-index: 11111111;
  }
  .auth-inner {
    top: 50%;
    left: 50%;
    width: 460px;
    padding: 2rem 3rem;
    display: block;
    position: absolute;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    background: #ffffff;
    border-radius: 2px;
  }
  .auth-message {}
  .auth-footer {
    width: 100%;
    margin-top: 0.1rem;
    text-align: center;
  }
  .auth-link {
    display: block !important;
  }
  .auth-input {
    width: 100%;
    margin-top: 0.3rem;
    margin-bottom: 0.35rem;
    padding: 0.375rem 0;
    border: none;
    border-bottom: 1px solid #6c757d;
    display: block;
    outline: none;
  }
  .auth-submit {
    margin-top: 1.235rem !important;
    margin-bottom: 0.6rem !important;
  }
</style>
