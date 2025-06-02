<template>
  <v-container fluid>
    <v-card class="content-box" v-if="userStore.token">
      <v-card-title class="text-h6 d-flex align-center">
        <router-link to="/" class="ml-2 d-flex align-center">
          <ArrowRightIcon class="icon" />
        </router-link>
        المنتجات المفضلة</v-card-title
      >
      <v-card-text>
        <!-- alert message -->
        <v-alert
          v-if="wishListStore.message"
          :style="
            wishListStore.message.includes(`تم اضافة المنتج الى المفضلة بنجاح`)
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
                    name: 'Product',
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
            v-else-if="wishListStore.wishList.length == 0"
            variant="outlined"
            class="text-center font-weight-bold"
          >
            لا توجد منتجات مفضلة
          </v-alert>
        </template>
      </v-card-text>
    </v-card>
    <v-alert v-else class="text-center">
      قم بتسجيل الدخول لعرض المفضلات
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useWishListStore } from "../stores/wishListStore";
import { useUserStore } from "../stores/userStore";
import { HeartIcon, ArrowRightIcon } from "@heroicons/vue/24/solid";

const wishListStore = useWishListStore();
const isLoading = ref(false); // for loading products from api call
const wishListQuantity = computed(() => wishListStore.wishList.length);
const userStore = useUserStore();

onMounted(async () => {
  const userStore = useUserStore();
  if (userStore.token) {
    isLoading.value = true;
    await wishListStore.fetchWishList();
    isLoading.value = false;
  }
});
</script>

<style scoped></style>
