<template>
		<PDF
			:style="containerStyle"
			v-if="appHasPdfFile"
			:file="pdfFile"/>
</template>

<script>
import PDFWidget from '../../player/widgets/PDFWidget.vue'
/* eslint-disable */

export default {
  name: 'PDFView',
  components: { PDFWidget },
  props: ['file', 'content'],
  computed: {
    pdfFile () {
      return this.file
    },
    appHasPdfFile () {
      return !!this.file
		},
		contentStyleObj () {
      let res = {}
      const s = this.scale
      const p = this.settings
      res.overflow = "hidden"
      res.width = "auto"
      res.height = `${p.height * s}px`
      console.log(res)
      return res
    }
  }
}
</script>
