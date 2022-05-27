import { getAccessorFromStore } from 'typed-vuex'

import { createStore } from 'C:/development/tup-voting-system/web/.nuxt/store'

const storeAccessor = getAccessorFromStore(createStore())

export default async ({ store }, inject) => {
  inject('accessor', storeAccessor(store))
}
