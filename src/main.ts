import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import App from './App.vue';
import 'vuetify/styles'; // Import Vuetify styles
import '@mdi/font/css/materialdesignicons.css'; // Import Material Design Icons

const app = createApp(App);
const pinia = createPinia();
const vuetify = createVuetify(); // Create Vuetify instance

app.use(pinia);
app.use(vuetify); // Use Vuetify
app.mount('#app');