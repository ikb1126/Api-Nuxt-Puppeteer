import colors from 'vuetify/es5/util/colors'

//dotenvで管理//
require('dotenv').config();

const { DATABASE, MYSQL_PASSWORD, USER_NAME } = process.env;

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // dotenv
  env: {
    DATABASE,
    MYSQL_PASSWORD,
    USER_NAME
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - Api-Nuxt-Puppeteer',
    title: 'Api',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    //'@nuxtjs/dotenv'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/proxy',
    '@nuxtjs/dotenv'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
