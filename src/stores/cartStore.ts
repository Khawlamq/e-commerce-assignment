import { defineStore } from 'pinia';
import axios from 'axios';
import type { CartItem } from '@/types/cart';
import { useUserStore } from './userStore';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [] as CartItem[],
    totalCost: 0,
    message: ''
  }),

  actions: {
    async fetchCartItems() {
      const userStore = useUserStore();
      const token = userStore.token;
      if (!token) {
        console.warn("User not logged in the token is not found.");
        return;
        }

      try {
        const response = await axios.get(
          `https://limitless-lake-55070.herokuapp.com/cart/?token=${token}`
        );
        this.cartItems = response.data.cartItems;
        this.totalCost = response.data.totalCost;
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    },

    async addCartItem(productId: number) {
      const userStore = useUserStore();
      try {
        const response = await axios.post(
          `https://limitless-lake-55070.herokuapp.com/cart/add?token=${userStore.token}`,
          { 
            productId,
             quantity: 1 }
        );
        this.setTimeForMsg(response.data.message, 7000)
        this.fetchCartItems(); // to refresh the cart
      } catch (error) {
        console.error('Error adding item to cart:', error);
      }
    },

    async deleteCartItem(cartItemId: number) {
      const userStore = useUserStore();
      try {
        const response = await axios.delete(
          `https://limitless-lake-55070.herokuapp.com/cart/delete/${cartItemId}?token=${userStore.token}`
        );
        this.setTimeForMsg(response.data.message, 7000)
        this.fetchCartItems(); // to refresh the cart
      } catch (error) {
        console.error('Error deleting cart item:', error);
      }
    },

    async updateCartItem(id: number,productId: number, quantity: number) {
      const userStore = useUserStore();
      try {
        const response = await axios.put(
          `https://limitless-lake-55070.herokuapp.com/cart/update/${id}?token=${userStore.token}`,
          { id, productId, quantity }
        );
        this.setTimeForMsg(response.data.message, 7000)
        this.fetchCartItems(); // to refresh the cart
      } catch (error) {
        console.error('Error updating cart item:', error);
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
