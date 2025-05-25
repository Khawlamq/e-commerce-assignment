<template>
  <header class="header">
    <div class="header-content">
      <!-- Logo + Brand -->
      <div class="header-brand">
        <div class="logo-circle">
          <img
            src="https://cdn.salla.network/images/logo/logo-square.png"
            alt="شعار المتجر"
          />
        </div>
        <div class="brand-text">
          <h1>متجر التجربة الجميلة</h1>
          <p>متجرك لكل تجاربك وأفكارك الجميلة</p>
        </div>
      </div>

      <!-- Icons -->
      <div class="header-actions">
        <button class="icon-button">
          <ShoppingBagIcon class="icon" />
        </button>
        <button class="icon-button">
          <UserIcon class="icon" />
        </button>
      </div>
    </div>
  </header>
</template>


<script setup lang="ts">
import { ShoppingBagIcon, UserIcon } from '@heroicons/vue/24/outline' 
</script>

<style scoped>
.header {
  padding: 1rem 2rem;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.header-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.logo-circle {
  border: 4px solid #c7f3ec !important;
  border-radius: 50% !important;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-circle img {
  width: 50px;
  height: 50px;
}

.brand-text h1 {
  font-size: 1.25rem;
  margin: 1px;
  color: #222;
}

.brand-text p {
  margin: 0;
  color: #9c9999;
  font-size: 0.8rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.icon-button {
  background-color: #c7f3ec !important;
  border-radius: 50% !important;
  width: 40px;
  height: 40px;
  border: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 20px;
  height: 20px;
  color: black;
}

@media (min-width: 700px) {
  .header-content {
    flex-direction: row-reverse;
    justify-content: space-between;
  }

  .header-brand {
    flex-direction: row-reverse;
    text-align: right;
    gap: 1rem;
  }
}
</style>
