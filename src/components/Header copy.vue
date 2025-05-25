<template>
  <header class="header">
    <v-container fluid>
      <v-row
        class="header-content"
        align="center"
        justify="space-between"
      >
        <!-- Logo + Brand -->
        <v-col
          cols="12"
          md="6"
          class="d-flex flex-column flex-md-row align-center justify-center justify-md-end header-brand"
        >
          <div class="logo-circle">
            <img
              src="https://cdn.salla.network/images/logo/logo-square.png"
              alt="شعار المتجر"
            />
          </div>
          <div class="brand-text ms-md-4 mt-2 mt-md-0 text-center text-md-end">
            <h1>متجر التجربة الجميلة</h1>
            <p>متجرك لكل تجاربك وأفكارك الجميلة</p>
          </div>
        </v-col>

        <!-- Icons -->
        <v-col
          cols="12"
          md="6"
          class="d-flex justify-center justify-md-start mt-4 mt-md-0"
        >
          <div class="header-actions">
            <button class="icon-button">
              <ShoppingBagIcon />
            </button>
            <button class="icon-button">
              <UserIcon />
            </button>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </header>
</template>

<script setup lang="ts">
import { ShoppingBagIcon, UserIcon } from '@heroicons/vue/24/outline' 
</script>
