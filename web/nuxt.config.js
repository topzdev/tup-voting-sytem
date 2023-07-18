import colors from "vuetify/es5/util/colors";
require("dotenv").config();

export default {
  env: {
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    BASE_SERVER_URL: process.env.BASE_SERVER_URL,
    BASE_NUXT_PORT: process.env.BASE_NUXT_PORT,
  },

  server: {
    port: process.env.BASE_NUXT_PORT,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s | TUP Election",
    title: "TUP Election",
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
    { src: "~/plugins/google-auth", mode: "client" },
    // { src: "~/plugins/vuex-persist", mode: "client" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    // https://typed-vuex.roe.dev/getting-started/getting-started-nuxt
    "nuxt-typed-vuex",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    "@nuxtjs/auth-next",
    "@nuxtjs/recaptcha",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  publicRuntimeConfig: {
    recaptcha: {
      /* reCAPTCHA options */
      siteKey: process.env.RECAPTCHA_PLATFORM_SITE_KEY, // for example,
      size: "invisible",
      hideBadge: false,
      version: 2,
    },

    axios: {
      // baseURL: "https://tup-voting-server-dev.herokuapp.com/",
      baseURL: process.env.BASE_SERVER_URL,
      progress: true,
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    icon: {
      fileName: "logo.png",
      sizes: [64, 120, 144, 152, 192, 384, 512],
    },
    meta: {
      title: "TUPM-Organization Voting Platform",
      author: "Dev404",
      mobileApp: "true",
      mobileAppIOS: "true",
    },

    manifest: {
      name: "TUPM-Organization Voting Platform",
      short_name: "TUPM-OVP",
      description:
        "This voting platform is exclusive for the use of accredited organization of T.U.P. - Manila",
      start_url: "/",
      lang: "en",
    },
  },

  auth: {
    redirect: false,
    rewriteRedirects: true,
    resetOnError: true,
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
          login: { url: "/api/v1/auth/voter/login", method: "post" },
          logout: { url: "/api/v1/auth/voter/logout", method: "post" },
          user: { url: "/api/v1/auth/voter/me", method: "get" },
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
          primary: "#c51f3b",
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
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
    devtools: false, //true
    // analyze: true,
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
        preserveLineBreaks: false,
        collapseWhitespace: true,
        removeComments: true,
      },
    },
    terser: {
      // https://github.com/terser/terser#compress-options
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },
};
