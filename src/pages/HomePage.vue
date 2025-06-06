<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <div class="content-box">
          <!-- Top Ref -->
          <div ref="topRef"></div>

          <v-img
            :src="mainImage"
            class="rounded mb-4"
            aspect-ratio="2.75"
            cover
            alt="Homepage image"
          />

          <!-- Search and filter -->
          <v-row class="mb-4">
            <v-col cols="12" sm="6" md="4">
              <v-select
                data-testid="price-select"
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
                data-testid="search-input"
                v-model="search"
                placeholder="ادخل اسم المنتج..."
                variant="outlined"
                hide-details
                dir="rtl"
              />
            </v-col>
          </v-row>

          <!-- Floating scroll buttons to top/bottom-->
          <v-btn
            data-testid="scroll-up"
            icon
            class="scroll-button"
            @click="scrollTo('top')"
          >
            <ChevronDoubleUpIcon class="icon" />
          </v-btn>

          <v-btn
            icon
            data-testid="scroll-down"
            class="scroll-button scroll-down"
            @click="scrollTo('bottom')"
          >
            <ChevronDoubleDownIcon class="icon" />
          </v-btn>

          <!-- Loading spinner -->
          <div v-if="isLoading == true" class="text-center py-10">
            <v-progress-circular indeterminate color="green" size="50" />
            <p class="mt-4">جاري تحميل المنتجات...</p>
          </div>
          <!-- when no products -->
          <v-alert
            v-else-if="productStore.products.length == 0"
            variant="outlined"
            class="text-center font-weight-bold mt-4"
          >
            لا توجد منتجات
          </v-alert>
          <v-alert
            v-if="showLoginAlert"
            variant="outlined"
            type="info"
            class="text-center font-weight-bold my-4"
          >
            قم بتسجيل الدخول اولا حتى تتمكن من التسوق
          </v-alert>
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
              <v-card class="d-flex flex-column justify-between h-100 w-100">
                <div class="icon-button" v-if="userStore.token">
                  <HeartIcon
                    data-testid="wishlist-button"
                    class="icon"
                    @click="addToWishList(product)"
                  />
                </div>
                <router-link
                  :to="{ name: 'Product', params: { id: product.id } }"
                  class="d-flex flex-column justify-between h-100 w-100 text-decoration-none"
                >
                  <v-img :src="product.imageURL" height="180px" cover />
                </router-link>
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
            </v-col>
          </v-row>

          <!-- No products found -->
          <v-row
            v-if="
              isLoading == false &&
              products.length === 0 &&
              search.trim().length > 0
            "
          >
            <v-col cols="12" class="text-center text-grey">
              لا توجد منتجات مطابقة
            </v-col>
          </v-row>

          <!-- Bottom Ref -->
          <div ref="bottomRef"></div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import "../assets/main.css";
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useProductStore } from "..//stores/productStore";
import { useCartStore } from "..//stores/cartStore";
import { useUserStore } from "../stores/userStore";
import { useWishListStore } from "..//stores/wishListStore";
import mainImage from "..//assets/images/mainImage.png";
import placeholderImage from "..//assets/images/placeholder.png";
import { useRouter } from "vue-router";
import type { Product } from "../types/product";
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  HeartIcon,
} from "@heroicons/vue/24/outline";
const showLoginAlert = ref(false);
const userStore = useUserStore();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const wishListStore = useWishListStore();
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
const isLoading = computed(() => productStore.isLoading);
const topRef = ref<HTMLElement | null>(null);
const bottomRef = ref<HTMLElement | null>(null);

function scrollTo(position: "top" | "bottom") {
  const target = position === "top" ? topRef.value : bottomRef.value;
  target?.scrollIntoView({ behavior: "smooth" });
}
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
  if (!userStore.token) {
    showLoginAlert.value = true;
    setTimeout(() => {
      showLoginAlert.value = false;
    }, 3000);
    return;
  }
  await cartStore.addCartItem(productId);
}

async function addToWishList(product: Product) {
  await wishListStore.addWishList(
    product.description,
    product.id,
    product.name,
    product.imageURL,
    product.price
  );
}

onMounted(async () => {
  await productStore.fetchProducts();
  products.value = [];
  page.value = 1;
  loadMore();
  window.addEventListener("scroll", onScroll);
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

.scroll-button {
  position: fixed;
  z-index: 1000;
  right: 1rem;
  background-color: #c7f3ec;
}

.scroll-button:hover {
  opacity: 0.85;
}

.scroll-button {
  bottom: 5rem;
}

.scroll-button.scroll-down {
  bottom: 1rem;
}
</style>
