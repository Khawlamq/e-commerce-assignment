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

          <!-- Search and filter -->
          <v-row class="mb-4">
            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="priceOptions"
                v-model="selectedPriceSort"
                label="فرز حسب السعر"
                item-title="title"
                item-value="value"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" sm="6" md="8">
              <v-text-field
                v-model="search"
                placeholder="ادخل اسم المنتج..."
                variant="outlined"
                hide-details
                dir="rtl"
              />
            </v-col>
          </v-row>

          <!-- Loading spinner -->
          <div v-if="isLoading" class="text-center py-10">
            <v-progress-circular indeterminate color="green" size="50" />
            <p class="mt-4">جاري تحميل المنتجات...</p>
          </div>

          <!-- Products -->
          <v-row>
            <v-col
              v-for="(product, index) in products"
              :key="index"
              cols="12"
              sm="6"
              md="3"
              class="d-flex"
            >
              <router-link
                :to="{ name: 'ProductDetails', params: { id: product.id } }"
                class="d-flex flex-column justify-between h-100 w-100 text-decoration-none"
              >
                <v-card class="d-flex flex-column justify-between h-100 w-100">
                  <v-img
                    :src="product.imageURL"
                    height="180px"
                    cover
                  />
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
                      <v-btn
                        class="addToCartButton"
                        variant="flat"
                        block
                        @click.prevent="addToCart(product.id)"
                      >
                        إضافة للسلة
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </router-link>
            </v-col>
          </v-row>

          <!-- No products found -->
          <v-row
            v-if="!isLoading && products.length === 0 && search.trim().length > 0"
          >
            <v-col cols="12" class="text-center text-grey">
              لا توجد منتجات مطابقة
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useProductStore } from "../../stores/productStore";
import { useCartStore } from "../../stores/cartStore";
import mainImage from "../../assets/images/mainImage.png";
import placeholderImage from "../../assets/images/placeholder.png";
import { useRouter } from "vue-router";

const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const search = ref("");
const selectedPriceSort = ref("lowToHigh");
const priceOptions = [
  { title: "السعر من الأعلى إلى الأقل", value: "highToLow" },
  { title: "السعر من الأقل إلى الأعلى", value: "lowToHigh" },
];
const itemsPerPage = 10;
const page = ref(1);
const products = ref<any[]>([]);
const loading = ref(false);
const isLoading = ref(false);

const sortedProducts = computed(() => {
  const keyword = search.value.toLowerCase().trim();

  let filtered = productStore.products.filter((p) =>
    p.name?.toLowerCase().includes(keyword)
  );

  if (selectedPriceSort.value === "highToLow") {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    filtered.sort((a, b) => a.price - b.price);
  }

  return filtered;
});

function loadMore() {
  if (loading.value) return;
  const start = (page.value - 1) * itemsPerPage;
  const nextProducts = sortedProducts.value.slice(start, start + itemsPerPage);

  if (nextProducts.length === 0) return;
  loading.value = true;

  setTimeout(() => {
    const processedProducts = nextProducts.map((p) => ({
      ...p,
      imageURL: p.imageURL?.startsWith("http") ? p.imageURL : placeholderImage,
    }));

    products.value.push(...processedProducts);
    page.value++;
    loading.value = false;
  }, 200);
}

function onScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loadMore();
  }
}

async function addToCart(productId: number) {
  await cartStore.addCartItem(productId);
}

onMounted(async () => {
  isLoading.value = true;
  await productStore.fetchProducts();
  products.value = [];
  page.value = 1;
  loadMore();
  window.addEventListener("scroll", onScroll);
  isLoading.value = false;
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

watch([search, selectedPriceSort], () => {
  page.value = 1;
  products.value = [];
  loadMore();
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
</style>
