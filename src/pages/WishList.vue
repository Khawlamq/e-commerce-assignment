<template>
  <v-container fluid>
    <v-card class="content-box">
      <v-card-title class="text-h6 d-flex align-center">
        <router-link to="/" class="ml-2 d-flex align-center">
          <ArrowRightIcon class="icon" />
        </router-link>
        المنتجات المفضلة ({{ wishListQuantity }})</v-card-title
      >
      <v-card-text>
        <!-- alert message -->
        <v-alert
          v-if="wishListStore.message"
          :style="
            userStore.message.includes(`تم اضافة المنتج الى المفضلة بنجاح`)
              ? {
                  backgroundColor: 'rgb(186, 243, 230)',
                  fontWeight: 'bold',
                  color: 'black',
                }
              : {
                  backgroundColor: 'red',
                  fontWeight: 'bold',
                  color: 'white',
                }
          "
        >
          {{ wishListStore.message }}
        </v-alert>

        <!--  show wishlist items -->
        <template v-if="wishListStore.wishList.length > 0">
          <div
            v-for="(item, index) in wishListStore.wishList"
            :key="item.id"
            class="cart-item"
          >
            <v-row class="cart-row" justify="space-between" no-gutters>
              <v-col cols="12" sm="6" class="d-flex align-center cart-info">
                <router-link
                  :to="{
                    name: 'ProductDetails',
                    params: { id: item.id },
                  }"
                  class="d-flex align-center text-decoration-none"
                >
                  <v-img :src="item.imageURL" class="cart-image" cover />
                  <div class="text-right">
                    <div class="font-weight-medium">
                      {{ item.name }}
                    </div>
                    <div class="text-sm">
                      <span class="text-grey"
                        >SAR {{ item.price.toLocaleString() }}
                      </span>
                    </div>
                  </div>
                </router-link>
              </v-col>

              <!-- Wish list Controls  -->
              <v-col cols="12" sm="6" class="cart-controls">
                <div>
                  <v-btn icon disabled>
                    <HeartIcon class="icon" />
                  </v-btn>
                </div>
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
            لا توجد منتجات مفضلة
            <div class="ma-2">
              <router-link to="/" class="icon-button">
                <v-btn style="background-color: rgb(0, 73, 86); color: white">
                  الرجوع الى الصفحة الرئيسية
                </v-btn>
              </router-link>
            </div>
          </v-alert>
        </template>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useWishListStore } from "../stores/wishListStore";
import { useUserStore } from "../stores/userStore";
import { HeartIcon, ArrowRightIcon } from "@heroicons/vue/24/solid";

const wishListStore = useWishListStore();
const isLoading = ref(true); // for loading products from api call
const wishListQuantity = wishListStore.wishList.length;

onMounted(async () => {
  const userStore = useUserStore();
  if (userStore.token) {
    isLoading.value = true;
    await wishListStore.fetchWishList();
    isLoading.value = false;
  }
});
</script>

<style scoped>
.content-box {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  direction: rtl;
}

.cart-item {
  padding: 8px 8px 0px 4px;
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

.icon {
  width: 20px;
  height: 20px;
}
</style>
