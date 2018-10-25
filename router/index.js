import VueRouter from 'vue-router'
import routes from './routes'
import User from '../helpers/user'
import { setAuthToken } from '../api/config'

const router = new VueRouter(routes)

router.beforeEach((to, from, next) => {
  if (/^\/agreements/.test(to.path)) next()
  else {
    if (User.isAuth() || /^\/auth/.test(to.path)) {
      setAuthToken(User.getToken())
      if (User.isAuth() && !User.isAccepted()) next('/agreements')
      else {
        if (User.isAuth()) {
          if(to.path.indexOf('/auth') + 1) {
            next({ path: '/' })
          } else {
            next()
          }
        } else {
          next()
        } 
      }
    } else {
      next({ path: '/auth' })
    }
  }
})

export default router
