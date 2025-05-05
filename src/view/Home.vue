<script setup lang="ts">
import { useProductStore } from "./../stores/product";
import { useCartStore } from "./../stores/cart";
import { onMounted, computed, ref } from "vue";
import { formatCurrency } from "./../utils/formatters";
import Header from "../components/ui/Header.vue";
import Banner from "../components/ui/Banner.vue";
import Footer from "../components/ui/Footer.vue";

const productStore = useProductStore();
const cartStore = useCartStore();
const searchQuery = ref("");
const user_id = 2; // Ganti dengan user_id yang sesuai atau dari auth

// Fetch products and cart items when component mounts
onMounted(async () => {
  await productStore.fetchProducts();
  await cartStore.fetchCartItems(user_id);
});

// Filter products based on search query
const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return productStore.products;
  }
  const query = searchQuery.value.toLowerCase();
  return productStore.products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(query) ||
      product.product_id.toString().includes(query)
  );
});

// Convert filtered products to menu items format
const menuItems = computed(() => {
  return filteredProducts.value.map((product) => ({
    id: product.product_id,
    name: product.product_name,
    description: `Product ID: ${product.product_id} | Stock: ${product.stok}`,
    sizes: [
      { name: "Small", price: product.price * 0.8, selected: false },
      { name: "Medium", price: product.price, selected: true },
      { name: "Large", price: product.price * 1.2, selected: false },
    ],
  }));
});

const menuCategories = [
  "Pizzas",
  "Garlic Bread",
  "Calzone",
  "Kebabas",
  "Salads",
  "Cold drinks",
  "Happy Meal*",
  "Desserts",
  "Hot drinks",
  "Sauces",
  "Orbit*",
];

// Delivery fee and discount
const deliveryFee = 2.5;
const discount = 3.0;

// Add to cart function
const addToCart = async (product_id: number, quantity: number = 1) => {
  const result = await cartStore.addToCart(product_id, quantity, user_id);
  if (result.success) {
    console.log("Item added to cart");
  } else {
    console.error(result.error);
  }
};

// Update cart item quantity
const updateCartItemQuantity = async (cart_id: number, newQuantity: number) => {
  if (newQuantity < 1) {
    await cartStore.removeFromCart(cart_id, user_id);
    return;
  }

  const result = await cartStore.updateCartItem(cart_id, newQuantity, user_id);
  if (result.success) {
    console.log("Cart item updated");
  } else {
    console.error(result.error);
  }
};

// Remove from cart
const removeFromCart = async (cart_id: number) => {
  const result = await cartStore.removeFromCart(cart_id, user_id);
  if (result.success) {
    console.log("Item removed from cart");
  } else {
    console.error(result.error);
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-6 max-w-6xl">
    <Header></Header>
    <Banner></Banner>
    <div v-if="productStore.loading" class="text-center py-8">
      Loading products...
    </div>
    <div v-else-if="productStore.error" class="text-center py-8 text-red-500">
      Error: {{ productStore.error }}
    </div>
    <div v-else class="flex flex-row lg:flex-row gap-8 mt-3">
      <!-- Left Column - Menu -->
      <div class="lg:w-1/3 border p-4 rounded-xl">
        <!-- Menu Categories -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">Menu</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              v-for="category in menuCategories"
              :key="category"
              class="text-left px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <span class="font-medium text-gray-800">{{ category }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="lg:w-2/3 border p-4 rounded-xl">
        <div class="relative mb-6">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search from menu..."
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <svg
            class="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <!-- Message when no results found -->
        <div v-if="menuItems.length === 0" class="text-center py-8">
          <p class="text-gray-500">
            No products found matching "{{ searchQuery }}"
          </p>
        </div>

        <!-- Pizza Items -->
        <div
          v-for="item in menuItems"
          :key="item.id"
          class="mb-8 bg-white rounded-lg shadow-sm p-6"
        >
          <h3 class="text-xl font-bold text-gray-800 mb-3">
            {{ item.name }}
          </h3>
          <img src="./../assets/images/burger.jpg" alt="" class="rounded-xl" />
          <p class="text-gray-600 mb-4">{{ item.description }}</p>

          <!-- Size Options -->
          <div class="grid grid-cols-3 gap-3 mb-4">
            <button
              v-for="size in item.sizes"
              :key="size.name"
              class="py-2 px-3 border rounded-lg hover:bg-lime-600 bg-lime-500"
              :class="{ 'border-primary-500 bg-primary-50': size.selected }"
            >
              <div class="font-medium">{{ size.name }}</div>
              <div class="text-primary-600 font-bold">
                {{ formatCurrency(size.price) }}
              </div>
            </button>
          </div>

          <!-- Special Option -->
          <div class="bg-lime-500 p-4 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <span class="font-medium"
                  >X1 {{ item.sizes[1].name }} with Sauces</span
                >
              </div>
              <div class="flex items-center">
                <span class="font-bold text-primary-600 mr-4">{{
                  formatCurrency(item.sizes[1].price)
                }}</span>
                <button
                  class="bg-lime-600 text-white px-3 py-1 rounded-lg hover:bg-lime-700 transition-colors"
                  @click="addToCart(item.id)"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Basket -->
      <div class="lg:w-1/3">
        <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">My Basket</h2>

          <!-- Loading state for cart -->
          <div v-if="cartStore.loading" class="text-center py-4">
            Loading cart items...
          </div>
          <div
            v-else-if="cartStore.error"
            class="text-center py-4 text-red-500"
          >
            Error: {{ cartStore.error }}
          </div>

          <!-- Empty cart message -->
          <div
            v-else-if="cartStore.cartItems.length === 0"
            class="text-center py-8"
          >
            <p class="text-gray-500">Your basket is empty</p>
          </div>

          <!-- Basket Items -->
          <div v-else class="space-y-4 mb-6">
            <div
              v-for="item in cartStore.cartItems"
              :key="item.cart_id"
              class="border-b pb-4"
            >
              <div class="flex justify-between">
                <div>
                  <p class="font-medium text-gray-800">
                    {{ item.product.product_name }}
                  </p>
                  <p class="text-sm text-gray-500">Size: Medium</p>
                </div>
                <span class="font-bold">{{
                  formatCurrency(item.product.price * item.quantity)
                }}</span>
              </div>
              <div class="flex justify-between items-center mt-2">
                <button
                  class="text-red-500 text-sm hover:underline"
                  @click="removeFromCart(item.cart_id)"
                >
                  Remove
                </button>
                <div
                  class="flex items-center border rounded-lg overflow-hidden"
                >
                  <button
                    class="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                    @click="
                      updateCartItemQuantity(item.cart_id, item.quantity - 1)
                    "
                  >
                    -
                  </button>
                  <span class="px-3">{{ item.quantity }}</span>
                  <button
                    class="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                    @click="
                      updateCartItemQuantity(item.cart_id, item.quantity + 1)
                    "
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div v-if="cartStore.cartItems.length > 0" class="space-y-2 mb-6">
            <div class="flex justify-between">
              <span class="text-gray-600">Sub Total:</span>
              <span class="font-bold">{{
                formatCurrency(cartStore.cartTotal())
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Discounts:</span>
              <span class="text-red-500">-{{ formatCurrency(discount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Delivery Fee:</span>
              <span>{{ formatCurrency(deliveryFee) }}</span>
            </div>
          </div>

          <!-- Total -->
          <div v-if="cartStore.cartItems.length > 0" class="border-t pt-4 mb-6">
            <div class="flex justify-between font-bold text-lg">
              <span>Total to pay</span>
              <span>{{
                formatCurrency(cartStore.cartTotal() + deliveryFee - discount)
              }}</span>
            </div>
            <p class="text-sm text-gray-500 mt-1">Choose your free item.</p>
          </div>

          <!-- Checkout Button -->
          <button
            v-if="cartStore.cartItems.length > 0"
            class="w-full mt-6 bg-orange-400 text-white py-3 rounded-lg font-bold hover:bg-orange-500 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>

<style scoped>
/* Custom styles if needed */
</style>
