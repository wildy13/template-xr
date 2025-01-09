// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'WebXR - Sandbox',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  compatibilityDate: '2024-04-03',
  ssr: false,
  devtools: { enabled: false },
  css: [
    '@/assets/css/main.css',
  ],
  /*
  modules: [
    '@dimforge/rapier3d',
    '@dimforge/rapier3d-compat'
  ] */
})
