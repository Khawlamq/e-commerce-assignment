import { defineStore } from "pinia";
import axios from "axios";
import type { User } from "../types/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "",
    user: null as User | null,
    message: "",
  }),
  actions: {
    async login(email: String, password: String) {
      this.message = "";
      try {
        const response = await axios.post(
          "https://limitless-lake-55070.herokuapp.com/user/signIn",
          { email, password }
        );
        this.token = response.data.token;
        this.user = response.data.user;
        console.log("Login successful:", response.data);
        this.setTimeForMsg((this.message = " تسجيل الدخول بنجاح!"), 3000);
      } catch (error) {
        this.setTimeForMsg((this.message = "فشل تسجيل الدخول!"), 3000);
        console.error("Login error:", error);
      }
    },
    async setTimeForMsg(message: string, duration: number) {
      this.message = message;
      setTimeout(() => { // remove message alert after duration
        this.message = "";
      }, duration);
    },
  },
  persist: true,
});
