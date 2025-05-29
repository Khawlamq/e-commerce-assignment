import { defineStore } from 'pinia';
import axios from 'axios';
import type { Product } from '../types/product';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    message: ''
  }),

  actions: {
    async fetchProducts() {
      try {
        const response = await axios.get('https://limitless-lake-55070.herokuapp.com/product/');
        this.products = response.data;
        this.setTimeForMsg((this.message="تم اضافة المنتج الى عربة التسوق بنجاح"), 7000)
      } catch (error) {
        this.setTimeForMsg((this.message="حدثت مشكلة! الرجاء المحاولة مرة اخرى"), 7000)
      }
    },
     async setTimeForMsg(message: string, duration: number){
        this.message = message;
        setTimeout(() => { // remove message alert after duration 
        this.message = '';
        }, duration);
    }
  },
});