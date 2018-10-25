<template>
  <div>

    <div class="container">
      <div class="search-media">
        <div class="search-media-wrap">
          <i class="mi mi-search search-media-icon"></i>
          <input class="search-media-input" v-model="quote">
        </div>
      </div>

      <FontsList
        @modifyFont="modifyFont"
        @deleteFont="deleteFont"
        :catalogue="filteredFonts"
        :isLoading="isLoading"/>
    </div>

  </div>
</template>

<script>
  import FontsList from './FontsList'

  export default {
    name: 'fonts-table',
    props: ['fonts', 'isLoading'],
    components: { FontsList },
    data: () => ({
      quote: ''
    }),
    computed: {
      filteredFonts () {
        if (this.fonts.length === 0) return []
        const quote = this.quote

        const filteredFonts = this.fonts.filter(font => {
          const titleHasQuote = font.name.toLowerCase().indexOf(quote.toLowerCase()) !== -1
          const familyHasQuote = font.family.toLowerCase().indexOf(quote.toLowerCase()) !== -1

          return titleHasQuote || familyHasQuote
        })

        return filteredFonts
      }
    },
    methods: {
      modifyFont (font) {
        this.$emit('modifyFont', font)
      },
      deleteFont (id) {
        this.$emit('deleteFont', id)
      }
    }
  }
</script>

<style scoped>
  .search-media {
    margin-bottom: 1rem;
  }
  .search-media-wrap {
    margin-top: 10px;
    color: rgba(11, 195, 203, 1);
    position: relative;
  }
  .search-media-icon {
    top: 50%;
    left: 11px;
    position: absolute;
    font-size: 18px;
    transform: translateY(-50%);
  }
  .search-media-input {
    width: 100%;
    height: 32px;
    padding: 0 80px 0 38px;
    border: 1px solid rgba(11, 195, 203, 1);
    border-radius: 20px;
    outline: none;
  }
  .search-media-clear {
    top: 50%;
    right: 12px;
    cursor: pointer;
    border: none;
    color: inherit;
    background: none;
    position: absolute;
    transform: translateY(-50%);
  }
  .search-media-files {
    height: 356px;
    margin-top: 16px;
    overflow-y: auto;
  }
  .search-media-breadcrumbs {
    margin-top: 16px;
  }
  .search-media-breadcrumbs .breadcrumbs {
    background: #fff !important;
  }
  .search-media-query {
    margin: 16px 0;
    padding: 0.75rem 1.25rem;
    background: rgba(245,245,245,1);
  }
  .search-media-message {
    padding: 0 1.25rem;
    display: inline-block;
  }
  .search-media-tag {
    margin-top: 1rem;
  }
</style>
