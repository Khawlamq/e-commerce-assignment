import { defineStore } from "pinia";
import axios from "axios";
import type { Product } from "../types/product";
import { useUserStore } from "./userStore";

export const useWishListStore = defineStore("wishList", {
  state: () => ({
    wishList: [] as Product[],
    message: "",
  }),

  actions: {
    async fetchWishList() {
      const userStore = useUserStore();
      const token = userStore.token;
      if (!token) {
        this.setTimeForMsg((this.message = "تم بتسجيل الدخول اولا"), 3000);
        return;
      }

      try {
        const response = await axios.get(
          `https://limitless-lake-55070.herokuapp.com/wishlist/${token}`
        );
        this.wishList = response.data;
      } catch (error) {
        this.setTimeForMsg(
          (this.message = "حدثت مشكلة! الرجاء المحاولة مرة اخرى"),
          3000
        );
      }
    },

    async addWishList(
      description: string,
      id: number,
      imageURL: string,
      name: string,
      price: number
    ) {
      const userStore = useUserStore();
      const token = userStore.token;

      if (!token) {
        this.setTimeForMsg((this.message = "يرجى تسجيل الدخول أولا"), 3000);
        return;
      }

      try {
        this.setTimeForMsg(
          (this.message = "تم اضافة المنتج الى المفضلة بنجاح"),
          3000
        );
        await axios.post(
          `https://limitless-lake-55070.herokuapp.com/wishlist/add?token=${token}`,
          {
            description,
            id,
            imageURL,
            name,
            price,
          }
        );
        await this.fetchWishList(); // to refresh wishlist
      } catch (error) {
        this.setTimeForMsg(
          (this.message = "هناك مشكلة! لم يتم اضافة المنتج الى المفضلة "),
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
