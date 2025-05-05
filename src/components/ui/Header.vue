<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo Section -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/">
            <img
              class="h-8 w-auto"
              src="./../../assets/images/logo.png"
              alt="Your Logo"
            />
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.path"
            class="text-gray-900 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium"
            active-class="text-primary-600 border-b-2 border-primary-600"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Right Side Items (e.g., buttons, user dropdown) -->
        <div class="flex items-center space-x-4">
          <!-- Search Icon (optional) -->
          <button
            type="button"
            class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span class="sr-only">Search</span>
            <MagnifyingGlassIcon class="h-6 w-6" />
          </button>

          <!-- User Dropdown -->
          <div class="relative ml-3">
            <div>
              <button
                type="button"
                class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                @click="toggleUserDropdown"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User profile"
                />
              </button>
            </div>

            <!-- Dropdown Menu -->
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-show="isUserDropdownOpen"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                tabindex="-1"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Your Profile
                </router-link>
                <router-link
                  to="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Settings
                </router-link>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            </transition>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button
              type="button"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              @click="toggleMobileMenu"
            >
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!isMobileMenuOpen" class="block h-6 w-6" />
              <XMarkIcon v-else class="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-show="isMobileMenuOpen" class="md:hidden">
        <div class="pt-2 pb-3 space-y-1 px-2">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.path"
            class="text-gray-900 hover:bg-gray-50 hover:text-primary-500 block px-3 py-2 rounded-md text-base font-medium"
            active-class="bg-primary-50 text-primary-600"
            @click="isMobileMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

interface NavigationItem {
  name: string;
  path: string;
}

const isUserDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);

const navigationItems: NavigationItem[] = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const logout = () => {
  // Implement your logout logic here
  console.log("Logging out...");
  isUserDropdownOpen.value = false;
};
</script>
