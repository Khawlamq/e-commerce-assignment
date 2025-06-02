import { defineStore } from "pinia";
import axios from "axios";
import type { Product } from "../types/product";
import { setTimeForMsg } from "../assets/js/helpers";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [] as Product[],
    message: "",
    isLoading: false,
  }),

  actions: {
    async fetchProducts() {
      try {
        this.isLoading = true;
        const response = await axios.get(
          "https://limitless-lake-55070.herokuapp.com/product/"
        );
        this.products = response.data;
        setTimeForMsg(
          this,
          (this.message = "تم اضافة المنتج الى عربة التسوق بنجاح"),
          3000
        );
      } catch (error) {
        setTimeForMsg(
          this,
          (this.message = "حدثت مشكلة! الرجاء المحاولة مرة اخرى"),
          3000
        );
      } finally {
        this.isLoading = false;
      }
    },
  },
});
