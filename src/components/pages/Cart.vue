<template>
  <v-container class="cart-page" fluid>
    <v-card class="content-box mx-auto">
      <v-card-title class="text-h6 text-right">  سلة المشتريات ({{ totalQuantity }})</v-card-title>

      <v-card-text>
        <v-alert
          v-if="cartStore.message"
          :style="
            cartStore.message.includes('Added to cart') ||
            cartStore.message.includes('Product has been updated') ||
            cartStore.message.includes('Item has been removed')
              ? {
                  backgroundColor: 'rgb(186, 243, 230)',
                  fontWeight: 'bold',
                  color: 'black',
                }
              : { backgroundColor: 'red', fontWeight: 'bold', color: 'white' }
          "
        >
          {{
            cartStore.message.includes("Added to cart") ||
            cartStore.message.includes("Product has been updated") ||
            cartStore.message.includes("Item has been removed")
              ? "تم تحديث عربة التسوق بنجاح"
              : "هناك مشكلة! لم يتم الاضافة الى عربة التسوق بنجاح"
          }}
        </v-alert>

        <template v-if="cartStore.cartItems.length > 0">
          <div
            v-for="(item, index) in cartStore.cartItems"
            :key="item.id"
            class="cart-item"
          >
            <v-row class="cart-row" justify="space-between" no-gutters>
              <v-col cols="12" sm="6" class="d-flex align-center cart-info">
                <v-img :src="item.product.imageURL" class="cart-image" cover />
                <div class="text-right">
                  <div class="font-weight-medium">{{ item.product.name }}</div>
                  <div class="text-sm">
                    <span class="text-grey"
                      >SAR {{ item.product.price.toLocaleString() }} ×
                    </span>
                    <span class="font-weight-bold">{{ item.quantity }}</span>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" sm="6" class="cart-controls">
                <div class="quantity-selector">
                  <v-btn icon @click="decrementQuantity(item)" :disabled="item.quantity <= 1">
                    <MinusIcon class="icon" />
                  </v-btn>
                  <span class="quantity-number">{{ item.quantity }}</span>
                  <v-btn icon @click="incrementQuantity(item)">
                    <PlusIcon class="icon" />
                  </v-btn>
                </div>
                <v-btn
                  icon
                  color="error"
                  variant="outlined"
                  @click="deleteCartItem(item.id)"
                >
                  <TrashIcon class="icon" />
                </v-btn>
              </v-col>
            </v-row>
            <v-divider class="my-4" />
          </div>
        </template>

        <template v-else>
          <div v-if="isLoading" class="text-center py-10">
            <v-progress-circular indeterminate color="green" size="50" />
            <p class="mt-4">جاري تحميل المنتجات...</p>
          </div>

          <v-alert
            v-else
            type="info"
            variant="outlined"
            class="text-center font-weight-bold"
            style="background-color: #fff3cd; color: #856404"
          >
            سلة التسوق فارغة حالياً
          </v-alert>
        </template>
      </v-card-text>

      <v-card-text v-if="cartStore.cartItems.length > 0">
        <div class="d-flex justify-space-between align-center total-row">
          <span class="text-h6 font-weight-bold">اجمالي السلة</span>
          <span class="text-h6 font-weight-bold">
            SAR {{ cartStore.totalCost }}
          </span>
        </div>
      </v-card-text>

      <v-card-actions
        v-if="cartStore.cartItems.length > 0"
        class="justify-center"
      >
        <v-btn block class="checkout-button"> اتمام عملية الدفع </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed  } from "vue";
import { useCartStore } from "../../stores/cartStore";
import { useUserStore } from "../../stores/userStore";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/vue/24/outline";

const cartStore = useCartStore();
const isLoading = ref(true); // for loading products from api call

onMounted(async () => {
  const userStore = useUserStore();
  if (userStore.token) {
    isLoading.value = true;
    await cartStore.fetchCartItems();
    isLoading.value = false;
  }
});
const totalQuantity = computed(() =>
  cartStore.cartItems.reduce((total, item) => total + item.quantity, 0)
);

async function addCartItem(productId) {
  await cartStore.addCartItem(productId);
}

async function deleteCartItem(itemId) {
  await cartStore.deleteCartItem(itemId);
}

async function incrementQuantity(item) {
  await cartStore.updateCartItem(item.id, item.product.id, item.quantity + 1);
}

async function decrementQuantity(item) {
  const newQuantity = Math.max(item.quantity - 1, 1);
  await cartStore.updateCartItem(item.id, item.product.id, newQuantity);
}
</script>

<style scoped>
.cart-page {
  background-color: #f9fafb;
  min-height: 100vh;
  padding-top: 2rem;
  direction: rtl;
  font-family: "Tajawal", sans-serif;
}

.content-box {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  max-width: 960px;
  width: 100%;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}

.cart-item {
  padding: 8px;
}

.cart-item:hover {
  background-color: #f0f0f0;
}

.cart-row {
  flex-wrap: wrap;
}

.cart-info {
  gap: 12px;
}

.cart-image {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin-left: 1rem;
}

.cart-controls {
  display: flex;
  flex-direction: row-reverse;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

@media (max-width: 700px) {
  .cart-controls {
    flex-direction: row;
    align-items: center;
  }
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 2px 4px;
  background-color: #f9f9f9;
  width: 120px;
  justify-content: space-between;
}

.quantity-number {
  width: 28px;
  text-align: center;
  font-weight: 500;
}

.checkout-button {
  background-color: rgb(0, 73, 86);
  color: white;
  font-weight: 600;
  border-radius: 8px;
  padding: 12px 0;
  transition: background-color 0.3s;
}

.checkout-button:hover {
  background-color: rgb(0, 90, 100);
}

.icon {
  width: 20px;
  height: 20px;
}
</style>
