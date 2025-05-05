<template>
  <div class="bg-white shadow-md">
    <!-- Restaurant Header Section -->
    <div class="relative justify-center">
      <!-- Background Image (replace with your actual image) -->
      <div class="h-96 w-full banner"></div>

      <!-- Overlay Content -->
      <div
        class="absolute flex flex-row bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6"
      >
        <div class="flex flex-col lg:w-2/3 border p-4 rounded-xl justify-end">
          <!-- Tagline -->
          <p class="text-black text-sm italic mb-1">
            Desi Flavours with a blend of Italian aesthetics!
          </p>

          <!-- Restaurant Name -->
          <h1 class="text-3xl font-bold text-black mb-2">
            Tandoori Pizza London
          </h1>

          <!-- Info Row -->
          <div
            class="flex flex-wrap items-center gap-x-6 gap-y-2 text-black text-sm"
          >
            <div class="flex items-center">
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Delivery in 20-25 Minutes</span>
            </div>

            <div class="flex items-center">
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Minimum Order: 12 GBP</span>
            </div>

            <div class="flex items-center">
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <span>Open until 3:00 AM</span>
            </div>
          </div>
        </div>
        <div class="lg:w-3/3 border p-4 rounded-xl">
          <img src="./../../assets/images/person.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RestaurantHeader",
  setup() {
    return {
      // You can add any reactive data or methods here
    };
  },
});
</script>

<style scoped>
.banner {
  background-image: url("./../../assets/images/banner.png");
  /* background-size: cover; */
  background-position: center;
}
</style>
