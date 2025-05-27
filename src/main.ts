import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import App from './App.vue';

const app = createApp(App);

// Create and configure Pinia with persistence for store token to store user login
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); 

const vuetify = createVuetify();

app.use(pinia);
app.use(vuetify);
app.mount('#app');