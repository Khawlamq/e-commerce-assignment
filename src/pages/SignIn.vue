<template>
  <v-container>
    <v-card class="content-box">
      <v-card-title class="text-h6">
        <div class="d-flex align-center">
          <router-link to="/" class="ml-2 d-flex align-center">
            <ArrowRightIcon class="icon" />
          </router-link>
          <span class="ml-2">تسجيل الدخول</span>
        </div>
      </v-card-title>
      <v-card-text>
        <v-alert
          v-if="userStore.message"
          class="my-4"
          :style="
            userStore.message.includes('تسجيل الدخول بنجاح!')
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

        <div v-if="userStore.token">
          <v-alert variant="outlined" class="text-center font-weight-bold mt-4">
            لقد سجلت الدخول مسبقاً
          </v-alert>
        </div>

        <v-form v-else ref="formRef" @submit.prevent="loginUser">
          <v-text-field
            data-testid="email-input"
            placeholder="الايميل"
            v-model="username"
            required
            dir="rtl"
            class="text-right"
            :rules="[emailRule]"
            autocomplete="email"
          />

          <v-text-field
            data-testid="password-input"
            v-model="password"
            :type="show2 ? 'text' : 'password'"
            placeholder="كلمة المرور"
            required
            :rules="[requiredRule]"
            dir="rtl"
            class="text-right"
            :append-inner-icon="undefined"
            autocomplete="current-password"
          >
            <template #append-inner>
              <component
                :is="show2 ? EyeSlashIcon : EyeIcon"
                class="eye-icon"
                @click="show2 = !show2"
              />
            </template>
          </v-text-field>

          <v-btn class="login-button" type="submit">دخول</v-btn>
          <router-link to="/signUp">
            <v-btn class="signup-button" text>انشاء حساب جديد</v-btn>
          </router-link>
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
const formRef = ref();
const userStore = useUserStore();
const router = useRouter();
const username = ref("");
const password = ref("");
const show2 = ref(false);

async function loginUser() {
  const { valid } = await formRef.value?.validate();
  if (!valid) {
    return;
  }
  await userStore.signIn(username.value, password.value);

  if (userStore.message.includes("تسجيل الدخول بنجاح")) {
    setTimeout(() => {
      router.push("/"), 4000;
    });
  }
}
defineExpose({ formRef });
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

.signup-button {
  margin-right: 10px;
  color: rgb(0, 73, 86);
}

.eye-icon {
  width: 20px;
  height: 20px;
  color: #004956;
  cursor: pointer;
}
</style>
