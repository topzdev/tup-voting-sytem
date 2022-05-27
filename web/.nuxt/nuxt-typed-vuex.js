import { getAccessorFromStore } from 'typed-vuex'

import { createStore } from 'C:/Users/tunga/OneDrive/Desktop/TUP-Manila Web-based Voting System/System/tup-voting-sytem/web/.nuxt/store'

const storeAccessor = getAccessorFromStore(createStore())

export default async ({ store }, inject) => {
  inject('accessor', storeAccessor(store))
}
