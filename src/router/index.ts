// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import SignIn from "../pages/SignIn.vue";
import SignUp from "../pages/SignUp.vue";
import Cart from "../pages/Cart.vue";
import WishList from "../pages/WishList.vue";
import Product from "../pages/Product.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/signIn", name: "SignIn", component: SignIn },
  { path: "/signup", name: "SignUp", component: SignUp },
  { path: "/cart", name: "Cart", component: Cart },
  { path: "/wishList", name: "WishList", component: WishList },
  {
    path: "/products/:id",
    name: "Product",
    component: Product,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
