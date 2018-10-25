<template>
  <b-modal
    v-model="active"
    no-close-on-backdrop
		hide-footer
    size="lg"
		class="modal-overflow"
    @show="setWidgetContent"
		@hide="setAllDataByDefault"
		ref="ModalCreateQR"
    :title="modalTitle">
		<!-- содержимое модального окна -->
		<div class="container">
			<div class="row row-op">
				<label class="label-bold">Название:</label>
				<input 
					type="text"
					name="Title"
					v-model="name"
					ref="QRTitle"/>
			</div>
			<div class="row row-op row-margin">
				<label class="QR-label">
					<span>Выберите тип:</span>
					<select 
						name="QRSelect"
						ref="QRSelect"
						@change="changeCurrentTypeValue">

						<option 
							v-for="option in typeOptions" 
							:key="option.value"
							:value="option.value">
							{{ option.text }}
						</option>
						
					</select>
				</label>

				<label class="QR-label QR-label__color-mt">
					<span>Выберите цвет:</span>
					<div
						class="QR-label__color"
						:style="{ backgroundColor: bgColor.hex }"
						@click="() => { this.isVisibleShadowField = true; this.isColorPicker = true; }">
						<Chrome v-model="bgColor"
							v-show="isColorPicker"
							class="color-picker" />
					</div>
				</label>
			</div>

			<form
				class="row row-op"
				v-for="(type, index) in typeFields"
				:class="typeFields[index].fields.length === 1 || typeFields[index].fields[1].isTextarea ? 'row-one' : ''"
				:key="index"
				ref="QRInputsForm"
				v-show="type.value === currentTypeValue">

					<div
						class="col-padding"
						v-for="(field, index) in type.fields"
						:class="index % 2 === 0 ? 'col-5' : 'col-6 offset-1'"
						:key="index">
						<label class="label-bold">{{ field.value }}</label>

						<input 
							v-if="!field.isTextarea"
							type="text"
							:ref="type.value" 
							:name="field.name"
							:qrtitle="field.value"
							:qrrequired="field.required"
							@blur="validateInputs">
						
						<textarea 
							v-else
							:ref="type.value" 
							:name="field.name"
							:qrtitle="field.value"
							:qrrequired="field.required"
							@blur="validateInputs"></textarea>
					</div>
			
			</form>

			<div class="row row-op">
				<div class="alert-link"
					v-show="errorMessage !== ''">
					{{ errorMessage }}
				</div>
			</div>

			<div class="row row-op">
				<b-button
					class="generateQRBtn"
					variant="primary"
					@click="getQRCode">Сгенерировать</b-button>	
			</div>

			<div class="row row-op d-flex justify-content-center">
				<img
					v-if="QRSrc"
					:src="QRSrc"
					class="QRImage"
					ref="QRImage">
			</div>
		</div>

		<!-- /содержимое модального окна -->
		<div class="row row-footer justify-content-end">
			<button
				:disabled="!canGetQR"
				class="btn btn-pink float-right"
				@click="isModify?changePlaylistItem():createPlaylistItem()">{{btnConfirmTitle}}</button>
			<button
				class="btn btn-cancel float-right"
				@click="active = false">Отмена</button>
		</div>
				
    <div class="shadowField" @click="closeAllMenu" v-if="isVisibleShadowField"></div>
  </b-modal>
</template>

<script>
/* eslint-disable */
import ModalWidgetHelper from './_ModalWidgetHelper.js'
import { Chrome } from 'vue-color'
import axios from 'axios'
import { baseUrl } from '../../../../api/config'
export default {
  name: "ModalCreateQR",
	components: { Chrome },
	data: () => ({
		// need data
		modalWidgetHelper: null,
		widgetType: 13,
		//
		name: "QR",
    typeOptions: [
      {
        value: "Ссылка",
				text: "Ссылка",
				name: "url"
      },
      {
        value: "Текст",
				text: "Текст",
				name: "text"
      },
      {
        value: "Контакт",
				text: "Контакт",
				name: "vcard"
      },
      {
        value: "SMS",
				text: "SMS",
				name: "sms"
      }
		],
		typeFields: [
			{
				value: 'Ссылка',
				fields: [{ value: 'URL', name: 'url', required: true }]
			},
			{
				value: 'Текст',
				fields: [
					{ value: 'Текст', name: 'text', required: true, isTextarea: true }
				]
			},
			{
				value: 'Контакт',
				fields: [
					{ value: 'Имя', name: 'name', required: true },
					{ value: 'Страна', name: 'country' },
					{ value: 'Фамилия', name: 'surname', required: true },
					{ value: 'Регион', name: 'region' },
					{ value: 'Телефон', name: 'phone', required: true },
					{ value: 'Город', name: 'city' },
					{ value: 'Email', name: 'email' },
					{ value: 'Улица', name: 'street' },
					{ value: 'Веб-сайт', name: 'website' },
					{ value: 'Почтовый индекс', name: 'postcode' }
				]
			},
			{
				value: 'SMS',
				fields: [
					{ value: 'Номер', name: 'number', required: true },
					{ value: 'Текст', name: 'body', isTextarea: true }
				]
			}
		],
		name: 'QR-код',
		currentTypeValue: 'Ссылка',
		pickerBorderColor: '',
		isColorPicker: false,
		bgColor: { hex: '#000000' },
		isVisibleShadowField: false,
		inputs: [],
		errorMessage: '',
		canGetQR: false,
		QRSrc: null
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
      if (this.isModify) return 'Изменение QR-кода'
      else return 'Добавление QR-кода'
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
		}
  },
  methods: {
    createWidgetItem () {
			const { type, color, QRContent, fields, typeIndex } = this.getDataForQR()
      const item = {
				name: this.name,
				id: this.id,
				type: this.widgetType,
				qrType: type,
				typeIndex,
				color,
				fields,
				getSrc: `${baseUrl}/qr?type=${type}&color=${color}&content=${JSON.stringify(QRContent)}`,
				content: JSON.stringify(QRContent)
			}
			
			if (this.src) {
				item.src = this.src
			}

      return JSON.stringify(item)
    },
    setAllDataByDefault () {
			this.id = this.container.id
			this.name = 'QR-код' + this.numberOfWidgets
			this.currentTypeValue = 'Ссылка'
			this.$refs.QRSelect.value = 'Ссылка'
			this.isColorPicker = false
			this.bgColor = { hex: '#000000' }
			this.isVisibleShadowField = false
			this.inputs = []
			this.QRSrc = null
			this.$refs.QRInputsForm.forEach(form => 
				form.querySelectorAll('input').forEach(el => {
					el.value = ''
				})
			)
			this.errorMessage = ''
    },
    setWidgetContent () {
      if (this.isModify) {
        // изменение
        const content = this.modalWidgetContent
        this.id = content.id
				this.name = content.name
				this.currentTypeValue = this.typeOptions[content.typeIndex].text
				this.$refs.QRSelect.value = this.currentTypeValue
				this.src = content.src
				this.bgColor = {
					hex: this.RGBToHex(content.color)
				}
				console.log('COLORS: ', this.bgColor, content.color)

				const { fields } = content
				const inputs = [...this.$refs.QRInputsForm[content.typeIndex].querySelectorAll('input')]
				for (const field in fields) {
					const index = inputs.findIndex(input => {
						return input.name === field
					})
					if (index !== -1) {
						inputs[index].value = fields[field]
					}
				}

				this.QRSrc = content.getSrc
      } else this.setAllDataByDefault()
      this.modalWidgetHelper = new ModalWidgetHelper(this.$store, this.createWidgetItem,
         {wName: this.name, wId: this.id})
    },
    createPlaylistItem () {
			this.modalWidgetHelper.createPlaylistItem({wName: this.name}, () => { this.active = false })
			this.canGetQR = false
    },
    changePlaylistItem () {
			this.modalWidgetHelper.changePlaylistItem({wName: this.name, wId: this.id}, () => { this.active = false })
			this.canGetQR = false
		},
		changeCurrentTypeValue (e) {
			this.QRSrc = null
			this.canGetQR = false
			this.errorMessage = ''
			this.currentTypeValue = e.target.value
		},
		closeAllMenu () {
      this.isColorPicker = false
			this.isVisibleShadowField = false
		},
		validateInputs () {
			const { typeIndex } = this.getDataForQR()
			const inputs = this.$refs.QRInputsForm[typeIndex].querySelectorAll('input, textarea')

			let toReplace = false
			let isReady = true
			const fields = []

			inputs.forEach((el, index) => {
				if (!this.inputs[index] || this.inputs[index].value !== el.value) {
					toReplace = true
				}

				if (el.getAttribute('qrrequired') && el.value.trim() === '') {
					isReady = false
					fields.push(el)
				}
			})

			if (toReplace) {
				this.inputs = inputs
			}

			if (isReady) {
				this.canGetQR = true
				this.errorMessage = ''
				return true
			}

			this.showError(fields)
			this.canGetQR = false
			return false
		},
		hexToRGB (hex) {
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ?
			 `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` 
			 : '0,0,0';
		},
		RGBToHex (rgb) {
			let hex = '#'

			rgb.split(',').forEach(color => {
				let convertedColor = parseInt(color).toString(16)
				if (convertedColor.length === 1) {
					convertedColor = '0' + convertedColor
				}
				hex += convertedColor
			})

			return hex
		},
		async getQRCode () {
			const result = this.validateInputs()
			if (!result) return

			const { color, type, QRContent } = this.getDataForQR()
			this.QRSrc = `${baseUrl}/qr?type=${type}&color=${color}&content=${JSON.stringify(QRContent)}`
		},
		getDataForQR () {
			const color = this.hexToRGB(this.bgColor.hex)
			const { type, typeIndex } = this.getQRType()
			
			const content = {}
			const inputs = this.$refs[this.currentTypeValue]
			inputs.forEach(input => {
				content[input.name] = input.value
			})
			
			const QRContent = type === 'vcard' ? this.getVCard(content) : content
			return { color, QRContent, type, typeIndex, fields: content }
		},
		showError (fields) {
			let errorMessage = 'Вы должны заполнить следующие поля: '
			fields.forEach((el, index) => {
				let ending = ', '
				if (index === fields.length - 1) {
					ending = '.'
				}
				errorMessage += (el.getAttribute('qrtitle') + ending)
			})
			this.errorMessage = errorMessage
		},
		getVCard ({ name, surname, country, city, email, phone, postcode, region, street, website }) {
			const vcard = `MECARD:N:${surname},${name};TEL:${phone};EMAIL:${email};ADR:${country},${city},${region},${street},${postcode};URL:${website}`
			console.log('vcard: ', vcard)
			return { text: vcard }
		},
		getQRType () {
			const typeIndex = this.typeOptions.findIndex(type => type.text === this.currentTypeValue)
			return { type: this.typeOptions[typeIndex].name, typeIndex }
		}
  }
}

</script>


<style scoped>
textarea {
	margin-top: 13px;
	height: 110px;
	resize: none;
	border-radius: 8px;
}
.row-one .col-padding {
	flex: 1;
	max-width: 100%;
	min-width: 100%;
	margin-left: 0;
}
.row-op {
  margin-bottom: 10px;
}
.row-margin {
	margin-top: 14px;
	margin-bottom: 14px;
}
.col-padding {
	padding-left: 0;
	padding-right: 0;
	padding-bottom: 20px;
}
.btn-cancel {
	background-color: #01afb6;
}
.color-picker{
	position: absolute;
	z-index: 9999;
}
.shadowField {
	width: 100%;
	height: 100%;
	opacity: 0;
	top: 0;
	left: 0;
	border: 1px solid black;
	position: fixed;
	z-index: 999;
}
.alert-link {
	font-size: 14px;
	color:red;
	font-weight: 400;
	margin-bottom: 0px;
}
.QRImage {
	display: block;
}
.generateQRBtn {
	margin-left: 0;
}
</style>

<style>
 .modal-body {
	max-height: 80vh;
	overflow: auto;
}
.QR-label {
	font-size: 14px;
	font-weight: 600;
	display: flex;
	align-items: center;
	margin-right: 13px;
	position: relative;
	color: #202020;
	margin-bottom: 0;
	display: inline-flex;
}

.QR-label select {
	border: 1px solid #a8a8a8;
	padding: 3px 2px;
	margin-top: 3px;
	height: 30px !important;
	font-size: 14px;
	min-width: 128px;
	border-radius: 4px;
}

.QR-label span {
	text-align: right;
	padding-right: 15px;
}

.QR-label__color {
	width: 20px;
	height: 20px;
	border-radius: 4px;
	cursor: pointer;
	position: relative;
}

.QR-label__color-mt {
	margin-left: 100px;
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
