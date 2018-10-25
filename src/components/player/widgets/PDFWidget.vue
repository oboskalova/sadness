<template>
	<div>
		<div class="PresentationWidget">
			<div class="text-content">
        <img
          v-for="(page, index) in pages"
          :key="index"
					:scale="scale"
					:class="{ 'pdf-page-fade': isFade, 'pdf-page-visible': index === currentPage}"
					class="pdf-page"
          v-show="currentPage === index || currentPage + 1 === index" 
          :src="path + page">
			</div>
		</div>
	</div>
</template>

<script>
// import { baseUrl } from '../../../../api/config'

export default {
  name: 'PDFWidget',
  props: ['file', 'content'],
  data: () => ({
    pages: [],
    currentPage: 0,
    isFade: false
  }),
  beforeDestroy () {
    clearInterval(this.timer)
  },
  created () {
    this.path = this.$store.getters.storagePath
    this.fetchPDF()
  },
  watch: {
    file () {
      this.fetchPDF()
    }
  },
  mounted () {
    const { effectType, intervalTime } = this.content

    let timeToTick = null
    switch (effectType) {
      case 'fade':
        this.isFade = true
        timeToTick = parseInt(intervalTime) + 1
        break
      default:
        timeToTick = parseInt(intervalTime)
    }

    this.timeToTick = timeToTick
  },
  methods: {
    fetchPDF () {
      this.pages = JSON.parse(this.file.additions)
      this.setInterval()
    },
    setInterval () {
      if (this.timer) return
      this.timer = setInterval(() => {
        this.nextSlide()
      }, this.timeToTick * 1000)
    },
    nextSlide () {
      if (this.currentPage + 2 < this.pages.length) {
        this.currentPage++
      } else {
        this.currentPage = 0
      }
    }
  },
  computed: {
    scale () {
      return 1
    }
  }
}
</script>

<style scoped>
  .text-content {
    width: 100%;
		height: 100%;
		position: relative;
    padding: 0;
	}
  .PresentationWidget {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
  }
  .pdf-page {
    opacity: 0;
    object-fit: cover;
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .pdf-page-visible {
    opacity: 1;
  }
  .pdf-page-fade {
    transition: 0.5s;
  }
</style>