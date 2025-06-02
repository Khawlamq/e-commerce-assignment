import { defineStore } from "pinia";
import axios from "axios";
import type { User } from "../types/user";
import { setTimeForMsg } from "../assets/js/helpers";

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
        setTimeForMsg(this, (this.message = "تسجيل الدخول بنجاح!"), 3000);
      } catch (error) {
        setTimeForMsg(this, (this.message = "فشل تسجيل الدخول!"), 3000);
      }
    },

    async signUp(
      email: String,
      firstName: String,
      lastName: String,
      password: String
    ) {
      this.message = "";

      try {
        await axios.post(
          `https://limitless-lake-55070.herokuapp.com/user/signup`,
          { email, firstName, lastName, password }
        );
        setTimeForMsg(this, (this.message = "تم إنشاء الحساب بنجاح .. سجل دخولك حتى تظهر لك قائمتك المفضلة والسلة الخاصة بك"), 6000);
      } catch (error) {
        setTimeForMsg(
          this,
          (this.message = "فشل قي انشاء الحساب حاول مره اخرى !"),
          3000
        );
      }
    },
  },
  persist: true,
});
