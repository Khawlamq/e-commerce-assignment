// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import Login from "../pages/Login.vue";
import Cart from "../pages/Cart.vue";
import ProductDetails from "../pages/ProductDetails.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/login", name: "Login", component: Login },
  { path: "/cart", name: "Cart", component: Cart },
  {
    path: "/products/:id",
    name: "ProductDetails",
    component: ProductDetails,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
