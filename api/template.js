import axios from 'axios'
import {
	baseUrl
} from './config'

function log(params) {
	console.log(params)
}

const TemplateAPI = {
	fetch(params = {}, success, error) {
		const {
			id
		} = params
		if (typeof success !== 'function') success = log
		if (typeof error !== 'function') error = log
		return axios.get(baseUrl + '/templates/' + id)
			.then(e => success(e.data))
			.catch(e => error(e))
	},
	fetchAll(success, error) {
		if (typeof success !== 'function') success = log
		if (typeof error !== 'function') error = log
		return axios.get(baseUrl + '/templates')
			.then(e => success(e.data))
			.catch(e => error(e))
	},
	create(params = {}, success, error) {
		if (typeof success !== 'function') success = log
		if (typeof error !== 'function') error = log
		return axios.post(baseUrl + '/templates', params)
			.then(e => success(e.data))
			.catch(e => error(e))
	},
	update(params = {}, success, error) {
		if (typeof success !== 'function') success = log
		if (typeof error !== 'function') error = log
		const {
			id
		} = params
		return axios.put(baseUrl + '/templates/' + id, params)
			.then(e => success(params))
			.catch(e => error(e))
	}
}

export default TemplateAPI
