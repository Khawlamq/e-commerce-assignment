<template>
  <v-container>
    <v-card class="content-box">
      <v-card-title class="text-h6 text-right">
        تسجيل الدخول
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="loginUser"> 
          <v-text-field
            label=" الايميل"
            v-model="username" 
            required
            dir="rtl"
            class="text-right"
          />
          <v-text-field
            label="كلمة المرور"
            v-model="password" 
            type="password"
            required
            dir="rtl"
            class="text-right"
          />
          <v-btn class="login-button" type="submit"> 
            دخول
          </v-btn>
          <v-btn class="forgot-password" text>
            نسيت كلمة المرور؟
          </v-btn>
          <v-alert v-if="errorMessage" type="error" dismissible>
            {{ errorMessage }} 
          </v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../../stores/userStore';

const userStore = useUserStore();
const username = ref('');
const password = ref('');
const errorMessage= ref('');

async function loginUser() {
  this.errorMessage= ''
  await userStore.login(username.value, password.value);
  errorMessage.value = userStore.message;
}

</script>

<style scoped>
.content-box {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  direction: rtl; /* Right-to-left layout */
}

.login-button {
  background-color: rgb(0, 73, 86);
  color: white;
  border-radius: 8px;
}

.login-button:hover {
  background-color: rgba(0, 73, 86, 0.8);
}

.forgot-password {
  margin-right: 10px;
  color: rgb(0, 73, 86);
}
</style>