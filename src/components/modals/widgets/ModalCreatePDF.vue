<template>
  <b-modal
    v-model="active"
    no-close-on-backdrop
    size="lg"
    @show="setWidgetContent"
    :title="modalTitle">
		<!-- содержимое модального окна -->

		<form 
			class="PresentationModal-body"
			ref="PresentationForm">

			<div
				v-if="spinnerIsVisible" 
				class="PresentationModal-spinner">
				<div class="loader"></div>
			</div>

			<p>Название:</p>
			<input 
				type="text"
				name="Title"
				v-model="name"
				ref="PresentationFormTitle">

			<div class="PresentationModal-file">
				<input 
					type="file" 
					id="PresentationFile"
					class="PresentationFile"
					name="PresentationFile"
					ref="PresentationFileInput"
					@change="showFileName">

				<label
					class="PresentationFile-label"
					ref="PresentationFileLabel"
					@click.prevent.stop="openMediaModal">

					<div
						v-show="fileName" 
						class="PresentationFile-label__name">
						{{ fileName }}
					</div>

					<button 
						class="btn btn-cancel">Выбрать файл</button>
					
					<div class="PresentationFile-label__error">	
						{{ fileError }}
					</div>
				</label>
			</div>

			<div class="PresentationModal-settings">
				<label>
					Эффект
					<select 
						name="PresentationFormSelect"
						ref="PresentationFormSelect">

						<option 
							v-for="option in typeOptions" 
							:key="option.value"
							:value="option.value">
							{{ option.text }}
						</option>
						
					</select>
				</label>

				<label>
					Время отображения слайда
					<input 
						type="number"
						id="PresentationFormTime"
						class="PresentationFormTime"
						name="PresentationFormTime"
						v-model="time"
						min="1"
						ref="PresentationFormTime">
					<span>сек</span>
				</label>

			</div>

		</form>

		<!-- /содержимое модального окна -->
        
      <div slot="modal-footer" class="w-100">
        <button
          class="btn btn-cancel float-right"
          @click="() => { active = false; clearModal()}">Отмена</button>
				<button
          class="btn btn-pink float-right"
					@click="isModify?changePlaylistItem():createPlaylistItem()">{{btnConfirmTitle}}</button>
			</div>
				
  </b-modal>
</template>

<script>
import ModalWidgetHelper from './_ModalWidgetHelper.js'
/* eslint-disable */
export default {
  name: "ModalCreatePDF",
	components: {},
	data: () => ({
		// need data
		modalWidgetHelper: null,
		widgetType: 12,
		//
		spinnerIsVisible: false,
		typeOptions: [
			{ value: 'none', text: 'Нет' },
			{ value: 'fade', text: 'Затухание' }
		],
		name: 'Presentation',
		fileName: '',
		fileError: '',
		time: 5,
		defaultTimeValue: 5
	}),
  computed: {
		container () {
      return this.$store.getters.coreActiveContainer
    },
		allMedias () {
			const cId = this.container.id
      return this.$store.getters.coreWidgets[cId] || []
    },
    numberOfWidgets () {
      return ModalWidgetHelper.numberOfWidgets(this.allMedias, this.widgetType)
    },
		isPresentation () {
			return true
		},
    modalTitle () {
      if (this.isModify) return 'Изменение презентации'
      else return 'Добавление презентации'
    },
    btnConfirmTitle () {
			if (this.isModify) return 'Сохранить'
      else return 'Сохранить'
		},
		isModify: {
      get () {
				const modalWidgetContent = this.modalWidgetContent
				return modalWidgetContent && modalWidgetContent.type === this.widgetType
			}
		},
		modalWidgetContent: {
      get () {
        return this.$store.getters.modalWidgetContent
      },
      set (val) {
        this.$store.commit('SET_MODAL_WIDGET_CONTENT', val)
      }
    },
		modalWidgetType: {
      get () {
        return this.$store.getters.modalWidgetType
      },
      set (val) {
        this.$store.commit('SET_MODAL_WIDGET_TYPE', val)
      }
    },
    active: {
      get () {
        return this.modalWidgetType === this.widgetType
      },
      set (val) {
        if (val) this.modalWidgetType = this.widgetType
        else this.modalWidgetType = null
      }
		},
		content () {
			return this.$store.getters.pdfModalData || {}
		},
		templateId () {
      return this.$store.getters.coreTemplate.id
    },
		_allMedias () {
			const cId = this.container.id
      return this.$store.getters.coreWidgets[cId] || []
		}
	},
	watch: {
		content () {
			console.log('CONTENT CHANGED')
			if (this.content.name) {
				this.showFileName()
			}
		}
	},
  methods: {
		openMediaModal () {
			this.$store.commit('TOGGLE_PDF_SELECTING', true)
      this.$store.commit('TOGGLE_SELECT_MEDIA', true)
		},
    createWidgetItem: function () {
			const { id, name, additions, fileName } = this
      const PDFItem = {
				id, name, additions, fileName,
				type: this.widgetType,
				effectType: this.$refs.PresentationFormSelect.value,
				intervalTime: this.$refs.PresentationFormTime.value,
			}
      return JSON.stringify(PDFItem)
    },
    setAllDataByDefault () {
			this.id = this.container.id
			this.type = this.widgetType
			this.effectType = 'none'
			this.name = 'Presentation' + this.numberOfWidgets
			this.fileName = this.content.name
			this.additions = this.content.additions
    },
    setWidgetContent () {
      // изменение
      if (this.isModify) {
        const content = this.modalWidgetContent
				console.log(content)
				this.id = content.id
				this.type = this.widgetType
				this.time = content.intervalTime
        this.name = content.name
				this.additions = content.additions
				this.fileName = this.fileName || content.fileName
				
				const effectValue = content.effectType

				this.$refs.PresentationFormSelect.value = effectValue
      } else {
        this.setAllDataByDefault()
      }
			this.modalWidgetHelper = new ModalWidgetHelper(this.$store, this.createWidgetItem, 
				{ wName: this.name, wId: this.id })
    },
    createPlaylistItem () {
			const validateResult = this.validatePresentationModal()
			if(validateResult) {
				this.modalWidgetHelper.createPlaylistItem({ wName: this.name, fId: this.content.id }, () => { this.active = false })
				this.clearModal()
			}	
    },
    changePlaylistItem () {
      this.modalWidgetHelper.changePlaylistItem({wName: this.name, wId: this.id, fId: this.content.id}, () => { this.active = false })
			this.clearModal()
    },
		showFileName () {
			const pdf = this.$store.getters.pdfModalData
			const fileName = pdf.name
			const types = ['pptx', 'ppt']
			const fileType = fileName.split('.').pop()
			
			this.fileName = fileName
			console.log('FILENAME: ', fileName)
			if (types.includes(fileType)) {
				this.fileError = ''
			} else {
				this.fileError = 'Допустима загрузка только для файлов .ppt, .pptx'
				fileInput.value = ''
			}
		},
		validatePresentationModal () {
			let validateResult = true

			const inputs = [
				this.$refs.PresentationFormTitle,
				this.$refs.PresentationFormTime
			]
			inputs.some(input => {
				if(input.value.trim() === '') {
					input.focus()
					validateResult = false
				}
			})

			const pdf = this.$store.getters.pdfModalData
			if(!pdf.id) {
				this.fileError = 'Выберите файл!'
				validateResult = false
			}

			return validateResult
		},
		clearModal () {
			this.$store.commit('SET_PDF_MODAL_DATA', {})
			this.fileError = ''
			this.fileName = ''
			this.time = this.defaultTimeValue
			this.$refs.PresentationFormSelect.value = 'none'
		}
  }
}

</script>


<style scoped>
.row-op {
  margin-bottom: 10px;
}
.btn-cancel {
	background-color: #01afb6;
}
</style>

<style>
.PresentationModal-body {
	padding: 0 10px;
	font-weight: 400;
}
.PresentationModal-body p {
	font-size: 14px;
	margin-bottom: 5px;
}

.PresentationModal-settings {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40px;
}

.PresentationModal-settings label {
	font-size: 14px;
	font-weight: 600;
	display: flex;
	align-items: center;
	margin-right: 13px;
	position: relative;
	color: #202020;
	margin-bottom: 0;
}

.PresentationModal-settings > label:last-child {
	margin-right: 0;
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.PresentationModal-settings > label:last-child input {
	margin-left: 30px;
}

.PresentationModal-settings label select {
	margin-left: 75px;
}

.PresentationModal-settings select {
	border: 1px solid #a8a8a8;
	padding: 3px 2px;
	margin-top: 3px;
	height: 30px !important;
	font-size: 14px;
	min-width: 128px;
	border-radius: 4px;
}

.PresentationFormTime {
	padding-left: 10px !important;
	text-align: right;
	border: 1px solid #dad7d4 !important;
	border-radius: 4px 0px 0px 4px !important;
	padding-right: 2px !important;
	width: 32% !important;
	height: 30px !important;
}

.PresentationFormTime + span {
	height: 34px;
	width: 10%;
	padding: 8px 6px 7px;
	font-weight: 400;
	line-height: 1;
	color: #5b5b5b;
	text-align: center;
	background-color: #d5d5d5;
	border: 1px solid #dad7d4;
	border-radius: 0px 4px 4px 0px;
}

.PresentationFile {
	display: none;
}

.PresentationFile-label {
	color: #202020;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	margin-top: 12px;
	margin-bottom: 0;
	cursor: pointer;
}

.PresentationFile-label button {
	margin: 15px 0;
	pointer-events: none;
}

.PresentationFile-label__name {
	margin-right: 120px;
}

.PresentationFile-label__error {
	width: 100%;
	color: red;
	font-size: 14px;
	margin: 2px 0 10px;
}

.PresentationModal-spinner {
	position: absolute;
	z-index: 1;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
}

.PresentationModal-body .loader,
.PresentationModal-body .loader:before,
.PresentationModal-body .loader:after {
  border-radius: 50%;
}
.PresentationModal-body .loader {
  color: #0dc5c1;
  font-size: 11px;
  text-indent: -99999em;
  margin: 55px auto;
  position: relative;
  width: 10em;
  height: 10em;
  box-shadow: inset 0 0 0 1em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
.PresentationModal-body .loader:before,
.PresentationModal-body .loader:after {
  position: absolute;
  content: '';
}
.PresentationModal-body .loader:before {
  width: 5.2em;
  height: 10.2em;
  background: #fff;
  border-radius: 10.2em 0 0 10.2em;
  top: -0.1em;
  left: -0.1em;
  -webkit-transform-origin: 5.2em 5.1em;
  transform-origin: 5.2em 5.1em;
  -webkit-animation: load2 2s infinite ease 1.5s;
  animation: load2 2s infinite ease 1.5s;
}
.PresentationModal-body .loader:after {
  width: 5.2em;
  height: 10.2em;
  background: #fff;
  border-radius: 0 10.2em 10.2em 0;
  top: -0.1em;
  left: 5.1em;
  -webkit-transform-origin: 0px 5.1em;
  transform-origin: 0px 5.1em;
  -webkit-animation: load2 2s infinite ease;
  animation: load2 2s infinite ease;
}
@-webkit-keyframes load2 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load2 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
