<template>
  <v-container v-if="product">
    <v-card class="product-card content-box">
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
        <v-col cols="12" sm="6" order-md="2">
          <v-img :src="product.imageURL" class="product-image" />
        </v-col>
        <v-col cols="12" sm="6" order-md="1">
          <v-card-title class="text-wrap">
            {{ product.name }}
          </v-card-title>
          <v-card-subtitle class="product-price">
            <div class="text-h6 font-weight-bold px-3">
              {{ product.price }} SAR
            </div>
            <del class="text-grey-lighten-1">{{ product.oldPrice }} SAR</del>
          </v-card-subtitle>
          <v-card-text>
            <p>{{ product.description }}</p>
          </v-card-text>

          <div class="actions-container">
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
              <v-btn
                @click="incrementQuantity()"
                class="quantity-button"
              >
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
  </v-container>

  <v-container v-else>
    <!-- Loading spinner -->
    <div v-if="isLoading" class="text-center py-10">
      <v-progress-circular indeterminate color="green" size="50" />
      <p class="mt-4">جاري تحميل المنتجات...</p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "../../stores/productStore";
import { useCartStore } from "../../stores/cartStore";
import { MinusIcon, PlusIcon } from "@heroicons/vue/24/outline";

const isLoading = ref(true); // for loading products from api call
const route = useRoute();
const cartStore = useCartStore();
const productStore = useProductStore();

const product = ref(null);
const quantity = ref(1);

onMounted(async () => {
  const id = Number(route.params.id);
  isLoading.value = true;

  if (productStore.products.length === 0) {
    await productStore.fetchProducts();
  }

  product.value = productStore.products.find((p) => p.id === id);

  // Check if item is already in the cart
  const existingItem = cartStore.cartItems.find((item) => item.id === id);
  if (existingItem) {
    quantity.value = existingItem.quantity;
  }

  isLoading.value = false;
});

async function incrementQuantity() {
  quantity.value++;
}

async function decrementQuantity() {
  quantity.value--;
}

async function addToCart(product) {
  await cartStore.addCartItem(product.id);

  if (quantity.value >= 1 && product.value ) {
    await cartStore.updateCartItem(
      product.categoryId,
      product.id,
      quantity.value
    );
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
  margin-right: 10px;
  width: 120px;
}
@media (max-width: 700px) {
  .addToCartButton {
    width: 170px;
    margin-top: 2px;
    margin-right: 0px;
  }
}

.addToCartButton:hover {
  background-color: rgba(0, 73, 86, 0.8);
}

.product-image {
  border-radius: 12px;
  width: 100%;
}

.product-price {
  display: flex;
  align-items: center;
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

.icon {
  width: 20px;
  height: 20px;
}
</style>
