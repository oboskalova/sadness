<template>
  <div class="ticket">
    <button
      class="ticket-button"
      :class="{ active }"
      @click="openMenu">
      {{ name }}
    </button>
    <div
      v-if="active"
      v-click-outside="closeMenu"
      class="ticket-popup">
      <ul class="menu ticket-list">
        <li class="menu-item">
          <router-link
            class="menu-button"
            to="settings">
            Настройки
          </router-link>
        </li>
        <li class="menu-item">
          <button
            class="menu-button"
            @click="signOut">
            Выйти
          </button>
        </li>
      </ul>    
    </div>
  </div>
</template>

<script>
import User from '../../../helpers/user'

export default {
  name: 'user-ticket',
  computed: {
    name () {
      return this.$store.getters.passport.name
    }
  },
  methods: {
    openMenu () {
      this.active = true
    },
    closeMenu () {
      this.active = false
    },
    signOut () {
      User.signOut()
      this.$router.go({
        path: 'auth',
        forse: true
      })
    }
  },
  data () {
    return {
      active: false
    }
  },
  directives: {
    'click-outside': {
      bind: function (el, binding, vNode) {
        // Provided expression must evaluate to a function.
        if (typeof binding.value !== 'function') {
          const compName = vNode.context.name
          let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`
          if (compName) { warn += `Found in component '${compName}'` }
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
      unbind: function (el, binding) {
        // Remove Event Listeners
        document.removeEventListener('click', el.__vueClickOutside__)
        el.__vueClickOutside__ = null
      }
    }
  }
}
</script>

<style scoped>
.ticket {
  height: 100%;
  position: relative;
}
.ticket-button {
  height: 100%;
  border: none;
  padding: 0.84rem 1.14rem;
  background: #00b0b7;
  color: #ffffff;
  transition: all 100ms ease;
  outline: none;
  cursor: pointer;
}
.ticket-button.active {
  background: #00999e;
}
.ticket-popup {
  right: 0;
  width: 100%;
  min-width: 230px;
  z-index: 1;
  position: absolute;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
.ticket-list {
  width: 100%;
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.menu,
.menu-button {
  background: #00b0b7;
  color: #ffffff;
}
.menu-item,
.menu-button {
  width: 100%;
  display: block;
}
.menu-button {
  padding: 0.84rem 1.14rem;
  border: none;
  text-align: right;
  cursor: pointer;
  outline: none;
}
</style>
