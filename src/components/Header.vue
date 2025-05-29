<template>
  <header class="header">
    <div class="header-content">
      <!-- Logo + Brand -->
      <div class="header-brand">
        <div class="logo-circle">
          <router-link to="/" title="تسجيل الدخول">
            <img
              src="https://cdn.salla.network/images/logo/logo-square.png"
              alt="شعار المتجر"
            />
          </router-link>
        </div>
        <div class="brand-text">
          <h1>متجر التجربة الجميلة</h1>
          <p>متجرك لكل تجاربك وأفكارك الجميلة</p>
        </div>
      </div>

      <!-- Icons -->
      <div class="header-actions">
        <router-link to="/cart" class="icon-button cart-icon" title="السلة">
          <ShoppingBagIcon class="icon" />
          <span v-if="totalQuantity > 0" class="badge">{{
            totalQuantity
          }}</span>
        </router-link>
        <router-link to="/login" class="icon-button" title="تسجيل الدخول">
          <UserIcon class="icon" />
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  ShoppingBagIcon,
  UserMinusIcon,
  UserIcon,
} from "@heroicons/vue/24/outline";
import { computed, onMounted } from "vue";
import { useCartStore } from "../stores/cartStore";
import { useUserStore } from "../stores/userStore";

const cartStore = useCartStore();
const userStore = useUserStore();

onMounted(() => {
  if (userStore.token) {
    cartStore.fetchCartItems();
  }
});

const totalQuantity = computed(() =>
  cartStore.cartItems.reduce((total, item) => total + item.quantity, 0)
);
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

@media (min-width: 1200px) {
  .icon {
  width: 30px;
  height: 40px;
  color: black;
}
.icon-button {
  background-color: #c7f3ec !important;
  border-radius: 50% !important;
  width: 60px;
  height: 60px;
  border: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
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

.badge {
  background-color: red;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 50%;
  padding: 2px 6px;
  line-height: 1;
}
</style>
