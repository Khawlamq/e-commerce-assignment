import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Global test setup for Vuetify
global.vuetify = createVuetify({
  components,
  directives,
})