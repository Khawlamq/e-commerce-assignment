<template>
  <v-app style="background-color: rgba(249, 250, 251, 1)">
    <div class="layout">
      <Header />
      <main class="content">
        <router-view />
      </main>
      <Footer />
    </div>
  </v-app>
</template>

<script setup lang="ts">
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
</script>

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
