<template>
    <div class="list-item no-gutters row" :class="className">
        <slot></slot>
    </div>
</template>
<script>
export default {
  name: 'fonts-list-item',
  props: ['font'],
  mounted () {
    const { name, url } = this.font
    const newTitle = this.className
    if (document.querySelector('#' + newTitle)) return

    const fontStyle = document.createElement('style')
    fontStyle.id = newTitle
    fontStyle.appendChild(document.createTextNode(`
    @font-face {
        font-family: "${newTitle}";\
        src: url("${url}");\
    }
    .${newTitle} .font-example {
        font-family: "${newTitle}";
    }`))

    document.head.appendChild(fontStyle)
  },
  computed: {
    className () {
      if (this.name) return this.name
      return this.name = 'q' + this.font.name.split(' ').join('').replace('!', '')
    }
  }
}
</script>
