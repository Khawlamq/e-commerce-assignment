import { defineStore } from 'pinia';
import axios from 'axios';
import type  { User } from '../types/User'; 

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    message: '',
  }),
  actions: {
    async login(email : String, password: String) {
      this.message = ''; 
        try {
            const response = await axios.post('https://limitless-lake-55070.herokuapp.com/user/signIn'
                , { email, password });

            console.log('Login successful:', response.data);
        } catch (error) {
            this.message = 'فشل تسجيل الدخول!';
            console.error('Login error:', error);
        }
    }
  }
});