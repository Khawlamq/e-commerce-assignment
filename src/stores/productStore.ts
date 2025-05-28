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
        this.setTimeForMsg(response.data.message, 7000)
      } catch (error) {
        console.error('Error fetching products:', error);
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