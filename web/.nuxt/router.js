import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _74344464 = () => interopDefault(import('..\\pages\\pre-register\\index.vue' /* webpackChunkName: "pages/pre-register/index" */))
const _2c66a0f2 = () => interopDefault(import('..\\pages\\election\\_slug\\index.vue' /* webpackChunkName: "pages/election/_slug/index" */))
const _6165419f = () => interopDefault(import('..\\pages\\vote\\_slug.vue' /* webpackChunkName: "pages/vote/_slug" */))
const _32e65bfa = () => interopDefault(import('..\\pages\\vote\\_slug\\index.vue' /* webpackChunkName: "pages/vote/_slug/index" */))
const _5b44d443 = () => interopDefault(import('..\\pages\\vote\\_slug\\ballot.vue' /* webpackChunkName: "pages/vote/_slug/ballot" */))
const _48b48242 = () => interopDefault(import('..\\pages\\vote\\_slug\\ballot\\index.vue' /* webpackChunkName: "pages/vote/_slug/ballot/index" */))
const _20f46583 = () => interopDefault(import('..\\pages\\vote\\_slug\\ballot\\final.vue' /* webpackChunkName: "pages/vote/_slug/ballot/final" */))
const _03b59fca = () => interopDefault(import('..\\pages\\vote\\_slug\\ballot\\review.vue' /* webpackChunkName: "pages/vote/_slug/ballot/review" */))
const _24c27622 = () => interopDefault(import('..\\pages\\election\\_slug\\candidate\\_candidateId.vue' /* webpackChunkName: "pages/election/_slug/candidate/_candidateId" */))
const _0fa4a930 = () => interopDefault(import('..\\pages\\election\\_slug\\party\\_partyId.vue' /* webpackChunkName: "pages/election/_slug/party/_partyId" */))
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
    path: "/pre-register",
    component: _74344464,
    name: "pre-register"
  }, {
    path: "/election/:slug",
    component: _2c66a0f2,
    name: "election-slug"
  }, {
    path: "/vote/:slug?",
    component: _6165419f,
    children: [{
      path: "",
      component: _32e65bfa,
      name: "vote-slug"
    }, {
      path: "ballot",
      component: _5b44d443,
      children: [{
        path: "",
        component: _48b48242,
        name: "vote-slug-ballot"
      }, {
        path: "final",
        component: _20f46583,
        name: "vote-slug-ballot-final"
      }, {
        path: "review",
        component: _03b59fca,
        name: "vote-slug-ballot-review"
      }]
    }]
  }, {
    path: "/election/:slug?/candidate/:candidateId?",
    component: _24c27622,
    name: "election-slug-candidate-candidateId"
  }, {
    path: "/election/:slug?/party/:partyId?",
    component: _0fa4a930,
    name: "election-slug-party-partyId"
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
