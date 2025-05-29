import { defineStore } from "pinia";
import axios from "axios";
import type { CartItem } from "@/types/cart";
import { useUserStore } from "./userStore";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartItems: [] as CartItem[],
    totalCost: 0,
    message: "",
  }),

  actions: {
    async fetchCartItems() {
      const userStore = useUserStore();
      const token = userStore.token;
      if (!token) {
        this.setTimeForMsg((this.message = "تم بتسجيل الدخول اولا"), 3000);
        return;
      }

      try {
        const response = await axios.get(
          `https://limitless-lake-55070.herokuapp.com/cart/?token=${token}`
        );
        this.cartItems = response.data.cartItems;
        this.totalCost = response.data.totalCost;
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    },

    async addCartItem(productId: number) {
      const userStore = useUserStore();
      const token = userStore.token;
      if (!token) {
        this.setTimeForMsg((this.message = "قم بتسجيل الدخول اولا"), 3000);
        return;
      }
      try {
        this.setTimeForMsg(
          (this.message = "تم اضافة المنتج الى عربة التسوق بنجاح"),
          3000
        );
        await axios.post(
          `https://limitless-lake-55070.herokuapp.com/cart/add?token=${userStore.token}`,
          {
            productId,
            quantity: 1,
          }
        );
        await this.fetchCartItems(); // to refresh the cart
      } catch (error) {
        console.error("Error adding item to cart:", error);
        this.setTimeForMsg(
          (this.message = "هناك مشكلة لم يتم اضافة المنتج الى عربة التسوق"),
          3000
        );
      }
    },

    async deleteCartItem(cartItemId: number) {
      const userStore = useUserStore();
      try {
        this.setTimeForMsg(
          (this.message = "تم حذف المنتج من عربة التسوق بنجاح"),
          3000
        );
        await axios.delete(
          `https://limitless-lake-55070.herokuapp.com/cart/delete/${cartItemId}?token=${userStore.token}`
        );
        await this.fetchCartItems(); // to refresh the cart
      } catch (error) {
        this.setTimeForMsg(
          (this.message = "هناك مشكلة لم يتم حذف المنتج من عربة التسوق"),
          3000
        );
      }
    },

    async updateCartItem(id: number, productId: number, quantity: number) {
      const userStore = useUserStore();
      try {
        this.setTimeForMsg((this.message = "تم تحديث عربة التسوق بنجاح"), 3000);
        await axios.put(
          `https://limitless-lake-55070.herokuapp.com/cart/update/${id}?token=${userStore.token}`,
          { id, productId, quantity }
        );
        await this.fetchCartItems(); // to refresh the cart
      } catch (error) {
        this.setTimeForMsg(
          (this.message = " هناك مشكلة لم يتم تحديث عربة التسوق بنجاح"),
          3000
        );
      }
    },
    async setTimeForMsg(message: string, duration: number) {
      this.message = message;
      setTimeout(() => {
        // remove message alert after duration
        this.message = "";
      }, duration);
    },
  },
});
