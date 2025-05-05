<template>
  <div
    class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between border-b"
  >
    <div class="flex items-center">
      <div
        class="bg-green-600 text-white px-2 py-1 rounded flex items-center mr-3"
      >
        <span class="font-bold mr-1">3.4</span>
        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      </div>
      <div class="flex items-center">
        <div class="flex mr-1">
          <svg
            v-for="i in 5"
            :key="i"
            class="w-4 h-4"
            :class="i <= 4 ? 'text-yellow-400' : 'text-gray-300'"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </div>
        <span class="text-sm text-gray-600">1,360 reviews</span>
      </div>
    </div>

    <!-- Add any additional buttons or actions here -->
    <button class="text-sm font-medium text-primary-600 hover:text-primary-800">
      View all info
    </button>
  </div>
</template>
