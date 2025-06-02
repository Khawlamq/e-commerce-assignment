// tests/vuetifySetup.ts
import { createVuetify } from 'vuetify';
import { createApp } from 'vue';

const vuetify = createVuetify();

const app = createApp({});
app.use(vuetify);

export { app };