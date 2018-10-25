// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import store from '../store'
import router from '../router'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import VueTouchKeyboard from 'vue-touch-keyboard'

import 'vue-touch-keyboard/dist/vue-touch-keyboard.css' // load default style

import 'material-icons/css/material-icons.css'
import 'mdbootstrap/css/bootstrap.css'
import 'mdbootstrap/css/mdb.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(VueTouchKeyboard)
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(VueGoogleAutocomplete, {
    load: {
        key: 'AIzaSyCBazxxiOaS0X4u73FyhIoyp4w8lPWDvpY',
        libraries: 'places'
    }
})

Vue.directive('click-outside', {
    bind: function(el, binding, vNode) {
        // Provided expression must evaluate to a function.
        if (typeof binding.value !== 'function') {
            const compName = vNode.context.name
            let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`
            if (compName) {
                warn += `Found in component '${compName}'`
            }
            console.warn(warn)
        }
        // Define Handler and cache it on the element
        const bubble = binding.modifiers.bubble
        const handler = (e) => {
            if (bubble || (!el.contains(e.target) && el !== e.target)) {
                binding.value(e)
            }
        }
        el.__vueClickOutside__ = handler
            // add Event Listeners
        document.addEventListener('click', handler)
    },
    unbind: function(el, binding) {
        // Remove Event Listeners
        document.removeEventListener('click', el.__vueClickOutside__)
        el.__vueClickOutside__ = null
    }
})

/* eslint-disable no-new */
new Vue({
    render: h => h(App),
    store: new Vuex.Store(store),
    router
}).$mount('#app')