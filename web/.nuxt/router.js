import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _1a57d190 = () => interopDefault(import('..\\pages\\election\\_slug.vue' /* webpackChunkName: "pages/election/_slug" */))
const _2c66a0f2 = () => interopDefault(import('..\\pages\\election\\_slug\\index.vue' /* webpackChunkName: "pages/election/_slug/index" */))
const _5eb63998 = () => interopDefault(import('..\\pages\\election\\_slug\\ballot.vue' /* webpackChunkName: "pages/election/_slug/ballot" */))
const _9495a264 = () => interopDefault(import('..\\pages\\election\\_slug\\ballot\\index.vue' /* webpackChunkName: "pages/election/_slug/ballot/index" */))
const _6603be0c = () => interopDefault(import('..\\pages\\election\\_slug\\ballot\\review.vue' /* webpackChunkName: "pages/election/_slug/ballot/review" */))
const _274d10d1 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/election/:slug?",
    component: _1a57d190,
    children: [{
      path: "",
      component: _2c66a0f2,
      name: "election-slug"
    }, {
      path: "ballot",
      component: _5eb63998,
      children: [{
        path: "",
        component: _9495a264,
        name: "election-slug-ballot"
      }, {
        path: "review",
        component: _6603be0c,
        name: "election-slug-ballot-review"
      }]
    }]
  }, {
    path: "/",
    component: _274d10d1,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
