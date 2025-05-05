<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-5xl">
      <div
        class="flex flex-row sm:flex-row border border-gray-200 sm:rounded-xl overflow-hidden"
      >
        <div class="main-bg bg-white py-8 px-4 shadow sm:px-10 flex-1"></div>
        <div class="bg-white py-8 px-4 shadow sm:px-10 flex-1">
          <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              src="./../assets/images/logo.png"
              alt="logo"
              class="h-12 w-auto mx-auto"
            />
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Daftar
            </h2>
            <p class="mt-2 mb-5 text-center text-sm text-gray-600">
              Sudah punya akun?
              <router-link
                to="/login"
                class="font-medium text-amber-600 hover:text-amber-500"
              >
                Masuk disini
              </router-link>
            </p>
          </div>
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700"
                >Nama Lengkap</label
              >
              <div class="mt-1">
                <input
                  id="name"
                  v-model="form.name"
                  name="name"
                  type="text"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"
                >Email</label
              >
              <div class="mt-1">
                <input
                  id="email"
                  v-model="form.email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
                >Password</label
              >
              <div class="mt-1">
                <input
                  id="password"
                  v-model="form.password"
                  name="password"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                for="confirm-password"
                class="block text-sm font-medium text-gray-700"
                >Konfirmasi Password</label
              >
              <div class="mt-1">
                <input
                  id="confirm-password"
                  v-model="form.confirmPassword"
                  name="confirm-password"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div class="flex items-center">
              <input
                id="terms"
                v-model="form.agreeTerms"
                name="terms"
                type="checkbox"
                class="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label for="terms" class="ml-2 block text-sm text-gray-900">
                Saya menyetujui
                <a href="#" class="text-amber-600 hover:text-amber-500"
                  >syarat dan ketentuan</a
                >
              </label>
            </div>

            <div>
              <button
                type="submit"
                :disabled="authStore.isLoading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!authStore.isLoading">Masuk</span>
                <span v-else class="flex items-center">
                  <!-- Animasi loading spinner -->
                  <svg
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses...
                </span>
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import type { SignupForm } from "./../interface/auth";

const authStore = useAuthStore();
const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

const form = ref<SignupForm>({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
});

const validateForm = (): boolean => {
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = "Password and confirmation don't match";
    return false;
  }

  if (!form.value.agreeTerms) {
    errorMessage.value = "You must agree to the terms and conditions";
    return false;
  }

  if (form.value.password.length < 8) {
    errorMessage.value = "Password must be at least 8 characters";
    return false;
  }

  errorMessage.value = null;
  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    errorMessage.value = null;

    const result = await authStore.signup({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
    });

    if (result.success) {
      router.push("/login");
      alert("Registration successful! Please login.");
    } else {
      errorMessage.value = result.error || "Registration failed";
    }
  } catch (error) {
    console.error("Signup error:", error);
    errorMessage.value = "An unexpected error occurred";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.main-bg {
  background-image: url("./../assets/images/burger.png");
  background-size: cover;
  background-position: center;
}
</style>
