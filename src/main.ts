import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Fonts
import '@mdi/font/css/materialdesignicons.css'

// Components
import App from './App.vue'
import { router } from './routers'

// Themes
import { leafDark, leafLight } from './themes/leaf'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'leafLight',
    themes: {
      leafLight: leafLight,
      leafDark: leafDark,
    },
  },
})

createApp(App).use(vuetify).use(router).mount('#app')
