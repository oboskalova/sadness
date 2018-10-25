<template>
    <div v-if="this.token">Вы прошли авторизацию, можно закрыть эту страницу</div>
    <div v-else>Возникла ошибка, попробуйте снова</div>
</template>

<script>
export default {
  created () {
    console.log('InstaToken Created')
    console.log('window.location.href ' + window.location.href)
    let accessMatch = window.location.href.match(/access_token=(.*)/)
    this.token = accessMatch ? accessMatch[0].replace('access_token=', '') : null
    console.log('token ', this.token)
    localStorage.setItem('instagram_token', this.token)
  },
  data () {
    return {
      token: null
    }
  }
}
</script>
