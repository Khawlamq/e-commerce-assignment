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
        this.message = response.data.message
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
  },
});