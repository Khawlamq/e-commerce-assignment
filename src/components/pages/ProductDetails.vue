<template>
  <v-container>
    <v-card class="product-card content-box">
      <v-row>
        <v-col cols="12" sm="6" order-md="2"> 
          <v-img :src="product.image" class="product-image" />
        </v-col>
        <v-col cols="12" sm="6" order-md="1"> 
          <v-card-title class="text-wrap">
            {{ product.name }}
          </v-card-title>
          <v-card-subtitle class="product-price">
            <div class="text-h6 font-weight-bold px-3">{{ product.price }} SAR</div>
            <del class="text-grey-lighten-1">{{ product.oldPrice }} SAR</del>
          </v-card-subtitle>
          <v-card-text>
            <p>{{ product.description }}</p>
          </v-card-text>
          
          <div class="actions-container">
            <div class="quantity-selector">
              <v-btn @click="decrementQuantity" class="quantity-button">
                <MinusIcon class="icon" />
              </v-btn>
              <input type="number" v-model="quantity" min="1" class="quantity-input" />
              <v-btn @click="incrementQuantity" class="quantity-button">
                <PlusIcon class="icon" />
              </v-btn>
            </div>
            <v-btn class="addToCartButton" variant="flat" @click="addToCart">
              إضافة للسلة
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const quantity = ref(1); // Initialize quantity

function incrementQuantity() {
  quantity.value++;
}

function decrementQuantity() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

function addToCart() {
  console.log('Added to cart:', props.product, 'Quantity:', quantity.value);
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
  .addToCartButton{
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
.quantity-button{
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