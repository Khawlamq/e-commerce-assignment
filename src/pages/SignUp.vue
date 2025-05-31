<template>
  <v-container>
    <v-card class="content-box">
      <div>
        <router-link to="/" class="ml-2 d-flex align-center">
          <ArrowRightIcon class="icon" />
        </router-link>
      </div>
      <v-card-title class="text-h6 text-right"> إنشاء حساب جديد </v-card-title>
      <v-card-text>
        <v-alert
          v-if="userStore.message"
          class="my-4"
          :style="
            userStore.message.includes('تم إنشاء الحساب بنجاح')
              ? {
                  backgroundColor: 'rgb(186, 243, 230)',
                  fontWeight: 'bold',
                  color: 'black',
                }
              : { backgroundColor: 'red', fontWeight: 'bold', color: 'white' }
          "
        >
          {{ userStore.message }}
        </v-alert>

        <v-form ref="formRef" @submit.prevent="registerUser">
          <v-text-field
            v-model="firstName"
            placeholder="الاسم الأول"
            :rules="[requiredRule]"
            required
            dir="rtl"
            class="text-right"
          />
          <v-text-field
            v-model="lastName"
            placeholder="الاسم الاخير"
            :rules="[requiredRule]"
            required
            dir="rtl"
            class="text-right"
          />
          <v-text-field
            v-model="email"
            placeholder="البريد الإلكتروني"
            :rules="[requiredRule, emailRule]"
            required
            dir="rtl"
            class="text-right"
          />
          <v-text-field
            v-model="password"
            :append-inner-icon="show2 ? EyeIcon : EyeSlashIcon"
            @click:append-inner="show2 = !show2"
            :type="show2 ? 'text' : 'password'"
            placeholder="كلمة المرور"
            :rules="[requiredRule]"
            required
            dir="rtl"
            class="text-right"
          />

          <v-btn class="login-button" type="submit"> إنشاء حساب </v-btn>
          <v-btn class="logout-button" text @click="$router.push('/signIn')">
            لدي حساب بالفعل
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { emailRule, requiredRule } from "../assets/js/helpers";
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
} from "@heroicons/vue/24/outline";

const userStore = useUserStore();
const router = useRouter();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const show2 = ref(false);
const formRef = ref();

async function registerUser() {
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  await userStore.signUp({
    email: email.value,
    firstName: firstName.value,
    lastName: lastName.value,
    password: password.value,
  });

  if (userStore.message.includes("تم إنشاء الحساب بنجاح")) {
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }
}
</script>

<style scoped>
.login-button {
  background-color: rgb(0, 73, 86);
  color: white;
  border-radius: 8px;
}
.login-button:hover {
  background-color: rgba(0, 73, 86, 0.8);
}

.logout-button {
  margin-right: 10px;
  color: rgb(0, 73, 86);
}
</style>
