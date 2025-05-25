<template>
  <v-container class="index-page" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <div class="content-box">

          <!-- Homepage Image -->
          <v-img
            :src="mainImage"
            aspect-ratio="16/7"
            class="rounded mb-4"
            cover
            alt="Homepage image"
          />

          <!-- Filters -->
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
              />
            </v-col>
          </v-row>

          <!-- Products -->
          <v-row>
            <v-col
              v-for="(product, index) in filteredProducts"
              :key="index"
              cols="12"
              sm="6"
              md="3"
            >
              <v-card class="product-card">
                <v-img :src="product.image" height="180px" cover></v-img>
                <v-card-text class="text-center">
                  <h4 class="text-subtitle-1 font-weight-medium mb-1">
                    {{ product.brand }}
                  </h4>
                  <p class="text-body-2 mb-1">{{ product.name }}</p>
                  <p class="text-caption text-grey-darken-1">{{ product.description }}</p>
                  <div class="prices my-2">
                    <del class="text-grey-lighten-1">{{ product.oldPrice }} SAR</del>
                    <div class="text-h6 text-primary font-weight-bold">{{ product.price }} SAR</div>
                  </div>
                  <v-btn class="addToCartButton" variant="flat" block>
                    إضافة للسلة
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import mainImage from '../../assets/images/main-slider/01.png'
import airpodsOneImage from '../../assets/images/products/01.png'
import airpodsSecondImage from '../../assets/images/products/02.png'
import airpodsThirdImage from '../../assets/images/products/03.png'
import airpodsForthImage from '../../assets/images/products/04.png'


const categories = ['الكل', 'تصنيف1', 'تصنيف2', 'تصنيف3','تصنيف4']
const selectedCategory = ref('الكل')
const search = ref('')

const products = ref([
    {
    brand: 'apple',
    name: 'سماعات AirPods Max الاصدار الجديد',
    description: 'الاصدار الاحدث و الافضل حتى اليوم',
    price: 2250,
    oldPrice: 2500,
    image: airpodsSecondImage,
    category: 'سماعات'
  },
  {
    brand: 'apple',
    name: 'سماعات AirPods Max الاصدار الجديد',
    description: 'الاصدار الاحدث و الافضل حتى اليوم',
    price: 2250,
    oldPrice: 2500,
    image: airpodsThirdImage,
    category: 'سماعات'
  },
  {
    brand: 'apple',
    name: 'سماعات AirPods Max الاصدار الجديد',
    description: 'الاصدار الاحدث و الافضل حتى اليوم',
    price: 2250,
    oldPrice: 2500,
    image: airpodsForthImage,
    category: 'سماعات'
  }
])

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesCategory = selectedCategory.value === 'الكل' || product.category === selectedCategory.value
    const matchesSearch = product.name.includes(search.value) // Consider making this case-insensitive
    return matchesCategory && matchesSearch
  })
})
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

.product-card {
  border: 1px solid #eee;
  border-radius: 12px;
  transition: box-shadow 0.2s;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
}

.prices {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.addToCartButton{
   background-color: rgb(0 73 86 / var(--tw-bg-opacity, 1));
   color: white;
}
</style>