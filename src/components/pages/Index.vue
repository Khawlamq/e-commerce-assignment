<template>
  <v-container class="index-page" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <div class="content-box">
          <v-img
            :src="mainImage"
            aspect-ratio="16/7"
            class="rounded mb-4"
            cover
            alt="Homepage image"
          />

          <!-- Filter and search -->
          <v-row class="mb-4">
            <v-col cols="5">
              <v-select
                :items="categories"
                v-model="selectedCategory"
                variant="outlined"
              />
            </v-col>
            <v-col cols="7">
              <v-text-field
                v-model="search"
                placeholder="ادخل اسم المنتج..."
                variant="outlined"
                hide-details
                dir="rtl"
              />
            </v-col>
          </v-row>

          <!-- Products -->
          <v-row>
            <v-col
              v-for="(product, index) in paginatedProducts"
              :key="index"
              cols="12"
              sm="6"
              md="3"
              class="d-flex"
            >
              <v-card class="d-flex flex-column justify-between h-100 w-100">
                <v-img
                  :src="product.imageURL"
                  height="180px"
                  cover
                ></v-img>

                <v-card-text
                  class="text-center flex-grow-1 d-flex flex-column justify-space-between"
                >
                  <div>
                    <h4 class="text-subtitle-1 font-weight-medium mb-1">
                      {{ product.name }}
                    </h4>
                    <p class="text-body-2">{{ product.description }}</p>
                  </div>
                  <div>
                    <div class="prices my-2">
                      <div class="text-h6 text-primary font-weight-bold">
                        {{ product.price }} SAR
                      </div>
                    </div>
                    <v-btn class="addToCartButton" variant="flat" block>
                      إضافة للسلة
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Pagination -->
          <v-row justify="center">
            <v-col cols="auto">
              <v-btn
                @click="currentPage = Math.max(currentPage - 1, 1)"
                :disabled="currentPage === 1"
              >
                <ArrowLeftIcon class="icon" />
              </v-btn>
            </v-col>
            <v-col cols="auto" style="display: flex; align-items: center">
              <span>{{ currentPage }} / {{ totalPages }}</span>
            </v-col>
            <v-col cols="auto">
              <v-btn
                @click="currentPage = Math.min(currentPage + 1, totalPages)"
                :disabled="currentPage === totalPages"
              >
                <ArrowRightIcon class="icon" />
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "../../stores/productStore";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/vue/24/outline";
import mainImage from "../../assets/images/main-slider/01.png";

const categories = ["الكل", "تصنيف1", "تصنيف2", "تصنيف3", "تصنيف4"];
const selectedCategory = ref("الكل");
const search = ref("");
const productStore = useProductStore();
const currentPage = ref(1);
const itemsPerPage = 10;

onMounted(() => {
  productStore.fetchProducts();
});

const totalPages = computed(() => {
  return Math.ceil(productStore.products.length / itemsPerPage);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return productStore.products.slice(start, start + itemsPerPage);
});

</script>

<style scoped>
.index-page {
  background-color: rgb(249, 250, 251);
  min-height: 100vh;
  padding-top: 2rem;
}

.content-box {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
}

.prices {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.addToCartButton {
  background-color: rgb(0, 73, 86);
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
.icon {
  width: 20px;
  height: 20px;
}
</style>