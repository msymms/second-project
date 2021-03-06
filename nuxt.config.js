const pkg = require('./package');

module.exports = {
    mode: 'universal',

    /*
    ** Headers of the page
    */
    head: {
        title: pkg.name,
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: pkg.description}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
            {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans'}
        ]
    },

    /*
    ** Customize the progress-bar color
    */
    loading: {color: '#0f0'},

    /*
    ** Global CSS
    */
    css: [
        '~assets/styles/main.css'
    ],

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '~plugins/core-components.js',
        '~plugins/date-filter.js'
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://github.com/nuxt-community/axios-module#usage
        '@nuxtjs/axios',
    ],
    /*
    ** Axios module configuration
    */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
        baseURL: 'https://nuxt-proj-78719.firebaseio.com',
        fbAPIKey: 'AIzaSyAf70_LYR5rCC9-Bf0oV8vaU3mxbnPNhnU'
    },
    transition: {
        name: 'fade',
        mode: 'out-in'
    },

    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {

        }
    },
    generate: {
        routes:
    }

}
