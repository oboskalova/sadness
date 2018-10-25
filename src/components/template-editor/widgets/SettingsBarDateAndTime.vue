<template>
	<div class="container">
		<div class="shadowField" @click="closeAllMenu" v-if="isVisibleShadowField"></div>
	</div>
	</template>


<script>
	import tinymce from 'vue-tinymce-editor'

	export default {
		components: {
			tinymce
		},
		data() {
			return {
				isVisibleShadowField: false,
				colorss: {
					hex: '#194d33'
				},
				colorPicker: false,
				tinyOptions: {
					language_url: '/static/tiny-mce-ru.js',
					menubar: false,
					branding: false,
					body_class: 'my_class',
					toolbar: [
						'bold italic strikethrough forecolor backcolor | alignleft aligncenter alignright  alignjustify | removeformat code',

					]

				},
				text: 'qwe'
			}
		},
		computed: {

		},
		methods: {

		},
	}

</script>


<style>


</style>
