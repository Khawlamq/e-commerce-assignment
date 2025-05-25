<script setup lang="ts">
import './assets/main.css'
import Footer from './components/Footer.vue';
import Header from './components/Header.vue'
import Index from './components/pages/Index.vue';
</script>

<template>
   <v-app style="background-color: rgba(249, 250, 251, 1);">
    <div class="layout">
      <Header />
      <main class="content">
        <Index />
        <!-- <router-view /> or your page content -->
      </main>
      <Footer />
    </div>
  </v-app>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
}
</style>

