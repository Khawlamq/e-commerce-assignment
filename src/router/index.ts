// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/pages/HomePage.vue';
import Login from '../components/pages/Login.vue';
import Cart from '../components/pages/Cart.vue';
import Product from '../components/pages/Product.vue';
import ProductDetails from '../components/pages/ProductDetails.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: Login },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/products', name: 'Product', component: Product },
  { path: '/products/:id', name: 'ProductDetails', component: ProductDetails, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
