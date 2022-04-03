import colors from "vuetify/es5/util/colors";

export default {
  ssr: false,
  env: {
    // baseUrl: process.env.BASER_SERVER_URL || "http://localhost:5000",
    // browserBaseUrl: process.env.BASER_CLIENT_URL || "http://localhost:3000",
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - TUP Voting Admin",
    title: "TUP Voting Admin",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  router: {
    middleware: ["auth"],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "~/plugins/axios-port.plugins" },
    { src: "~/plugins/vue-datetime-picker", mode: "client" },
    { src: "~/plugins/vue-draggable", mode: "client" },
    { src: "~/plugins/tiptap-vuetify", mode: "client" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    // https://typed-vuex.roe.dev/
    "nuxt-typed-vuex",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    "@nuxtjs/auth-next",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_SERVER_URL || "http://localhost:5000",
      progress: true,
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "en",
    },
  },

  auth: {
    // rewriteRedirects: true,
    // resetOnError: true,
    redirect: {
      login: "/login",
      logout: "/",
      callback: "/login",
      home: "/",
    },
    strategies: {
      local: {
        token: {
          property: "token",
          global: true,
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: "user",
          // autoFetch: true
        },
        endpoints: {
          login: { url: "/api/v1/auth/admin/login", method: "post" },
          logout: { url: "/api/v1/auth/admin/logout", method: "post" },
          user: { url: "/api/v1/auth/admin/me", method: "get" },
        },
      },
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          secondary: colors.amber.darken3,
          accent: colors.grey.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["vue-datetime-picker", "tiptap-vuetify", "vuetify/lib"],
  },
};
