<template>
  <v-container fluid>
    <v-card class="content-box mx-auto">
      <v-card-title class="text-h6 text-right d-flex align-center">
        <router-link to="/" class="ml-2 d-flex align-center">
          <ArrowRightIcon class="icon" />
        </router-link>
        سلة المشتريات ({{ totalQuantity }})</v-card-title
      >

      <v-card-text>
        <!-- alert message -->
        <v-alert
          v-if="cartStore.message"
          :style="
            cartStore.message.includes(
              'تم اضافة المنتج الى عربة التسوق بنجاح'
            ) ||
            cartStore.message.includes('تم حذف المنتج من عربة التسوق بنجاح') ||
            cartStore.message.includes('تم تحديث عربة التسوق بنجاح')
              ? {
                  backgroundColor: 'rgb(186, 243, 230)',
                  fontWeight: 'bold',
                  color: 'black',
                }
              : { backgroundColor: 'red', fontWeight: 'bold', color: 'white' }
          "
        >
          {{ cartStore.message }}
        </v-alert>

        <!--  show cart items -->
        <template v-if="cartStore.cartItems.length > 0">
          <div
            v-for="(item, index) in cartStore.cartItems"
            :key="item.id"
            class="cart-item"
          >
            <v-row class="cart-row" justify="space-between" no-gutters>
              <v-col cols="12" sm="6" class="d-flex align-center cart-info">
                <router-link
                  :to="{
                    name: 'ProductDetails',
                    params: { id: item.product.id },
                  }"
                  class="d-flex align-center text-decoration-none"
                >
                  <v-img
                    :src="item.product.imageURL"
                    class="cart-image"
                    cover
                  />
                  <div class="text-right">
                    <div class="font-weight-medium">
                      {{ item.product.name }}
                    </div>
                    <div class="text-sm">
                      <span class="text-grey"
                        >SAR {{ item.product.price.toLocaleString() }} ×
                      </span>
                      <span class="font-weight-bold">{{ item.quantity }}</span>
                    </div>
                  </div>
                </router-link>
              </v-col>

              <!-- Quantity + Delete Controls (Outside router-link)
                so when user click on img or product name route him to product details page -->
              <v-col cols="12" sm="6" class="cart-controls">
                <div class="quantity-selector">
                  <v-btn
                    icon
                    @click="decrementQuantity(item)"
                    :disabled="item.quantity <= 1"
                  >
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
            variant="outlined"
            class="text-center font-weight-bold"
          >
            لا توجد منتجات في سلة التسوق
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
import { onMounted, ref, computed } from "vue";
import { useCartStore } from "../stores/cartStore";
import { useUserStore } from "../stores/userStore";
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ArrowRightIcon,
} from "@heroicons/vue/24/outline";

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

</style>
