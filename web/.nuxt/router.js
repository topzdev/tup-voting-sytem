import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _d36b18c0 = () => interopDefault(import('..\\pages\\pre-register\\index.vue' /* webpackChunkName: "pages/pre-register/index" */))
const _3fed4f94 = () => interopDefault(import('..\\pages\\election\\_slug\\index.vue' /* webpackChunkName: "pages/election/_slug/index" */))
const _c867264a = () => interopDefault(import('..\\pages\\vote\\_slug.vue' /* webpackChunkName: "pages/vote/_slug" */))
const _b4d46972 = () => interopDefault(import('..\\pages\\vote\\_slug\\index.vue' /* webpackChunkName: "pages/vote/_slug/index" */))
const _7d5b037f = () => interopDefault(import('..\\pages\\vote\\_slug\\ballot.vue' /* webpackChunkName: "pages/vote/_slug/ballot" */))
const _04d33423 = () => interopDefault(import('..\\pages\\vote\\_slug\\ballot\\index.vue' /* webpackChunkName: "pages/vote/_slug/ballot/index" */))
const _4a21dac7 = () => interopDefault(import('..\\pages\\vote\\_slug\\ballot\\final.vue' /* webpackChunkName: "pages/vote/_slug/ballot/final" */))
const _0ab33952 = () => interopDefault(import('..\\pages\\vote\\_slug\\ballot\\review.vue' /* webpackChunkName: "pages/vote/_slug/ballot/review" */))
const _61076466 = () => interopDefault(import('..\\pages\\election\\_slug\\candidate\\_candidateId.vue' /* webpackChunkName: "pages/election/_slug/candidate/_candidateId" */))
const _11d71dac = () => interopDefault(import('..\\pages\\election\\_slug\\party\\_partyId.vue' /* webpackChunkName: "pages/election/_slug/party/_partyId" */))
const _5c54590d = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _d36b18c0,
    name: "pre-register"
  }, {
    path: "/election/:slug",
    component: _3fed4f94,
    name: "election-slug"
  }, {
    path: "/vote/:slug?",
    component: _c867264a,
    children: [{
      path: "",
      component: _b4d46972,
      name: "vote-slug"
    }, {
      path: "ballot",
      component: _7d5b037f,
      children: [{
        path: "",
        component: _04d33423,
        name: "vote-slug-ballot"
      }, {
        path: "final",
        component: _4a21dac7,
        name: "vote-slug-ballot-final"
      }, {
        path: "review",
        component: _0ab33952,
        name: "vote-slug-ballot-review"
      }]
    }]
  }, {
    path: "/election/:slug?/candidate/:candidateId?",
    component: _61076466,
    name: "election-slug-candidate-candidateId"
  }, {
    path: "/election/:slug?/party/:partyId?",
    component: _11d71dac,
    name: "election-slug-party-partyId"
  }, {
    path: "/",
    component: _5c54590d,
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
