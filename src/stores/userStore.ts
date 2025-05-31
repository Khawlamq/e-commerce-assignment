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
    async signIn(email: String, password: String) {
      this.message = "";
      try {
        const response = await axios.post(
          "https://limitless-lake-55070.herokuapp.com/user/signIn",
          { email, password }
        );
        this.token = response.data.token;
        this.user = response.data.user;
        this.setTimeForMsg((this.message = " تسجيل الدخول بنجاح!"), 3000);
      } catch (error) {
        this.setTimeForMsg((this.message = "فشل تسجيل الدخول!"), 3000);
      }
    },
    async signUp(
      email: String,
      firstName: String,
      lastName: String,
      password: String
    ) {
    
      console.log("helo");

      try {
        const response = await axios.post(
          `https://limitless-lake-55070.herokuapp.com/user/signup`,
          { email, firstName, lastName, password }
        );
        this.setTimeForMsg((this.message = "تم إنشاء الحساب بنجاح"), 3000);
      } catch (error) {
        this.setTimeForMsg(
          (this.message = "فشل قي انشاء الحساب حاول مره اخرى !"),
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
  persist: true,
});
