<template>
  <v-container>
    <v-card class="product-card content-box">
      <v-row>
        <v-col cols="12" md="6" order-md="2"> 
          <v-img :src="product.image"  class="product-image" />
        </v-col>
        <v-col cols="12" md="6" order-md="1"> 
          <v-card-title class="text-wrap">
            {{ product.name }}
          </v-card-title>
          <v-card-subtitle class="product-price">
            <div class="text-h6 font-weight-bold px-3">{{ product.price }} SAR</div>
            <del class="text-grey-lighten-1 ">{{ product.oldPrice }} SAR</del>
          </v-card-subtitle>
          <v-card-text >
            <p>{{ product.description }}</p>
          </v-card-text>
          <v-btn class="addToCartButton" variant="flat" block @click="addToCart">
            إضافة للسلة
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

function addToCart() {
  console.log('Added to cart:', props.product);
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

}

.addToCartButton:hover {
  background-color: rgba(0, 73, 86, 0.8);
}

.product-image {
  border-radius: 12px;
  width: 100%; 
}

.product-price{
  display: flex;
  align-items: center; 
}
</style>