<template>
  <v-container>
    <v-card v-if="product" class="content-box">
      <v-card-title class="text-right d-flex align-center">
        <router-link to="/" class="ml-2 d-flex align-center">
          <ArrowRightIcon class="icon" />
        </router-link>
        تفاصيل المنتج</v-card-title
      >
      <v-alert
        class="my-3"
        v-if="cartStore.message"
        :style="
          cartStore.message.includes('تم اضافة المنتج الى عربة التسوق بنجاح')
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
      <v-row>
        <v-col cols="12" sm="6" class="d-flex justify-center">
          <v-img
            :src="product.imageURL"
            class="product-image"
            cover
            height="100%"
            width="100%"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          class="d-flex flex-column justify-space-between"
        >
          <div>
            <v-card-title class="text-wrap">
              {{ product.name }}
            </v-card-title>
            <v-card-subtitle>
              <div class="font-weight-bold product-price">
                {{ product.price }} SAR
              </div>
            </v-card-subtitle>
            <v-card-text>
              <p>{{ product.description }}</p>
            </v-card-text>
          </div>

          <div class="actions-container mt-4">
            <div class="quantity-selector">
              <v-btn
                @click="decrementQuantity()"
                class="quantity-button"
                :disabled="quantity <= 1"
              >
                <MinusIcon class="icon" />
              </v-btn>
              <input
                type="number"
                v-model="quantity"
                min="1"
                class="quantity-input"
              />
              <v-btn @click="incrementQuantity()" class="quantity-button">
                <PlusIcon class="icon" />
              </v-btn>
            </div>
            <v-btn
              class="addToCartButton"
              variant="flat"
              @click="addToCart(product)"
            >
              إضافة للسلة
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-container v-else-if="!product" class="content-box">
      <!-- Loading spinner -->
      <div v-if="isLoading" class="text-center py-10">
        <v-progress-circular indeterminate color="green" size="50" />
        <p class="mt-4">جاري تحميل المنتجات...</p>
      </div>
      <!-- if no products -->

      <div v-else-if="!product">
        <v-card-title class="text-right d-flex align-center">
          <router-link to="/" class="ml-2 d-flex align-center">
            <ArrowRightIcon class="icon" />
          </router-link>
          العودة للقائمة الرئيسية</v-card-title
        >
        <v-alert variant="outlined" class="text-center font-weight-bold mt-4">
          المنتج غير موجود
        </v-alert>
      </div>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "../stores/productStore";
import { useCartStore } from "../stores/cartStore";
import { MinusIcon, PlusIcon, ArrowRightIcon } from "@heroicons/vue/24/outline";
import type { Product } from "../types/product";

const isLoading = ref(false);
const route = useRoute();
const cartStore = useCartStore();
const productStore = useProductStore();
const product = ref<Product | null>(null);
const quantity = ref(1);
let cartId = null;

onMounted(async () => {
  const id = Number(route.params.id);
  isLoading.value = true;

  if (productStore.products.length === 0) {
    await productStore.fetchProducts();
  }

  product.value = productStore.products.find((p) => p.id === id) || null;

  // Check if item is already in the cart
  const existingItem = cartStore.cartItems.find((item) => item.id === id);
  if (existingItem) {
    quantity.value = existingItem.quantity;
    cartId = existingItem.id;
  }

  isLoading.value = false;
});

async function incrementQuantity() {
  quantity.value++;
}

async function decrementQuantity() {
  quantity.value--;
}

async function addToCart(product: Product) {
  await cartStore.addCartItem(product.id);

  if (quantity.value >= 1 && product) {
    if (cartId !== null) {
      await cartStore.updateCartItem(cartId, product.id, quantity.value);
    }
  }
}
</script>

<style scoped>
.content-box {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  direction: rtl;
}

.addToCartButton {
  background-color: rgb(0, 73, 86);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  width: 170px;
}

@media (min-width: 425px) {
  .addToCartButton {
    width: 170px;
    margin-top: 2px;
  }
}

.addToCartButton:hover {
  background-color: rgba(0, 73, 86, 0.8);
}

.product-image {
  border-radius: 12px;
  width: 100%;
  height: 400px;
}

.product-price {
  display: flex;
  align-items: center;
  font-size: 20px;
}

.actions-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-left: 5px;
}
.quantity-button {
  background-color: transparent;
  border: none;
}
.quantity-input {
  width: 40px;
  text-align: center;
  border: none;
  background-color: transparent;
}

@media (min-width: 1000px) {
  .product-image {
    max-width: 400px;
    height: 460px;
  }

  .v-card-title {
    font-size: 35px !important;
  }

  .product-price {
    font-size: 28px;
  }

  .v-card-text p {
    font-size: 30px;
    line-height: 1.6;
  }

  .addToCartButton {
    width: 220px;
    height: 40px;
    font-size: 25px;
  }

  .quantity-input {
    width: 66px;
    height: 38px;
    font-size: 20px;
  }

  .icon {
    width: 44px;
    height: 24px;
    color: black;
  }
  .quantity-selector {
    height: 38px;
    width: 220px;
  }
}
</style>
