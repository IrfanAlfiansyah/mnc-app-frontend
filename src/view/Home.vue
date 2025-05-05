<script setup lang="ts">
import { useProductStore } from "./../stores/product";
import { useCartStore } from "./../stores/cart";
import { useCheckoutStore } from "./../stores/checkout";
import { onMounted, computed, ref, watch } from "vue";
import { formatCurrency } from "./../utils/formatters";
import Header from "../components/ui/Header.vue";
import Banner from "../components/ui/Banner.vue";
import Footer from "../components/ui/Footer.vue";

// Types
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  sizes: SizeOption[];
  selectedSize: SizeOption;
}

interface SizeOption {
  name: string;
  price: number;
  selected: boolean;
}

interface OrderSummary {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

interface CartItem {
  cart_id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  size: string;
  price: number;
  product: {
    product_id: number;
    product_name: string;
    price: number;
    stok: number;
  };
}

// Stores
const productStore = useProductStore();
const cartStore = useCartStore();
const checkoutStore = useCheckoutStore();

// Refs
const searchQuery = ref("");
const user_id = ref(3);
const cartItems = ref<CartItem[]>([]);
const isCheckingOut = ref(false);

const cartTotal = computed(() => cartStore.cartTotal());
const cartItemsCount = computed(() => cartStore.cartItemsCount());

// Constants
const DELIVERY_FEE = 10000;
const DISCOUNT = 7500;
const MENU_CATEGORIES = [
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

// Fetch data on mount
onMounted(async () => {
  try {
    await Promise.all([productStore.fetchProducts(), fetchCartData()]);
  } catch (error) {
    console.error("Failed to initialize component:", error);
  }
});

// Watch for cart changes
watch(
  () => [...cartStore.cartItems],
  (newItems) => {
    cartItems.value = newItems;
  },
  { deep: true, immediate: true }
);

// Computed properties
const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) {
    return productStore.products;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return productStore.products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(query) ||
      product.product_id.toString().includes(query)
  );
});

const menuItems = computed<MenuItem[]>(() => {
  return filteredProducts.value.map((product) => {
    const sizes: SizeOption[] = [
      { name: "Small", price: product.price * 0.8, selected: false },
      { name: "Medium", price: product.price, selected: true },
      { name: "Large", price: product.price * 1.2, selected: false },
    ];

    return {
      id: product.product_id,
      name: product.product_name,
      description: `Product ID: ${product.product_id} | Stock: ${product.stok}`,
      price: product.price,
      sizes,
      selectedSize: sizes.find((size) => size.selected) || sizes[1],
    };
  });
});

const orderSummary = computed<OrderSummary>(() => {
  const subtotal = cartTotal.value;
  const total = subtotal + DELIVERY_FEE - DISCOUNT;

  return {
    subtotal,
    deliveryFee: DELIVERY_FEE,
    discount: DISCOUNT,
    total,
  };
});

// Methods
const fetchCartData = async () => {
  try {
    await cartStore.fetchCartItems(user_id.value);
    cartItems.value = cartStore.cartItems;
  } catch (error) {
    console.error("Failed to fetch cart data:", error);
  }
};

const selectSize = (item: MenuItem, size: SizeOption) => {
  item.sizes = item.sizes.map((s) => ({
    ...s,
    selected: s.name === size.name,
  }));
  item.selectedSize = { ...size };
};

const addToCart = async (item: MenuItem, quantity: number = 1) => {
  try {
    const result = await cartStore.addToCart(
      item.id,
      quantity,
      user_id.value,
      item.selectedSize.name,
      item.selectedSize.price
    );

    if (result.success) {
      await cartStore.fetchCartItems(user_id.value);
    } else {
      console.error("Failed to add to cart:", result.error);
    }
  } catch (error) {
    console.error("Error in addToCart:", error);
  }
};

const updateCartItemQuantity = async (cart_id: number, newQuantity: number) => {
  if (newQuantity < 1) {
    await removeFromCart(cart_id);
    return;
  }

  try {
    const result = await cartStore.updateCartItem(
      cart_id,
      newQuantity,
      user_id.value
    );
    if (!result.success) {
      console.error("Failed to update quantity:", result.error);
    }
  } catch (error) {
    console.error("Error updating cart item:", error);
  }
};

const removeFromCart = async (cart_id: number) => {
  try {
    const result = await cartStore.removeFromCart(cart_id, user_id.value);
    if (!result.success) {
      console.error("Failed to remove item:", result.error);
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};

const proceedToCheckout = async () => {
  isCheckingOut.value = true;

  try {
    // Ambil dan parse user dari localStorage
    const storedUser = localStorage.getItem("authUser");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    const customerName = parsedUser?.name || "";
    const customerEmail = parsedUser?.email || "";

    const response = await checkoutStore.processCheckout({
      user_id: user_id.value,
      customer_name: customerName,
      customer_email: customerEmail,
      payment_method: "",
    });

    if (response.success && checkoutStore.currentOrder?.payment_redirect_url) {
      window.location.href = checkoutStore.currentOrder.payment_redirect_url;
    } else {
      console.error("Checkout failed:", response.error || "Unknown error");
    }
  } catch (error) {
    console.error("Error during checkout:", error);
  } finally {
    isCheckingOut.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-6 max-w-6xl">
    <Header></Header>
    <Banner />

    <!-- Loading and error states -->
    <template v-if="productStore.loading">
      <div class="text-center py-8">Loading products...</div>
    </template>

    <template v-else-if="productStore.error">
      <div class="text-center py-8 text-red-500">
        Error: {{ productStore.error }}
      </div>
    </template>

    <template v-else>
      <div class="flex flex-row lg:flex-row gap-8 mt-3">
        <!-- Left Column - Menu Categories -->
        <div class="lg:w-1/3 border p-4 rounded-xl">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">Menu</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              v-for="category in MENU_CATEGORIES"
              :key="category"
              class="text-left px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <span class="font-medium text-gray-800">{{ category }}</span>
            </button>
          </div>
        </div>

        <!-- Middle Column - Menu Items -->
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

          <!-- No results message -->
          <template v-if="menuItems.length === 0">
            <div class="text-center py-8">
              <p class="text-gray-500">
                No products found matching "{{ searchQuery }}"
              </p>
            </div>
          </template>

          <!-- Menu Items List -->
          <template v-else>
            <div
              v-for="item in menuItems"
              :key="item.id"
              class="mb-8 bg-white rounded-lg shadow-sm p-6"
            >
              <h3 class="text-xl font-bold text-gray-800 mb-3">
                {{ item.name }}
              </h3>
              <img
                src="./../assets/images/burger.jpg"
                :alt="item.name"
                class="rounded-xl w-full h-auto mb-4"
              />
              <p class="text-gray-600 mb-4">{{ item.description }}</p>

              <!-- Size Options -->
              <div class="grid grid-cols-3 gap-3 mb-4">
                <div
                  v-for="size in item.sizes"
                  :key="size.name"
                  class="border rounded-lg overflow-hidden"
                  :class="{ 'border-lime-500 border-2': size.selected }"
                >
                  <div class="p-3">
                    <div class="font-medium text-center">{{ size.name }}</div>
                    <div class="font-bold text-center mb-2">
                      {{ formatCurrency(size.price) }}
                    </div>
                    <button
                      @click="selectSize(item, size)"
                      class="w-full py-2 bg-lime-500 hover:bg-lime-600 text-white rounded transition-colors"
                    >
                      Select Size
                    </button>
                  </div>
                </div>
              </div>

              <!-- Add to Cart Button -->
              <button
                @click="addToCart(item)"
                class="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-colors"
              >
                Add to Cart - {{ formatCurrency(item.selectedSize.price) }}
              </button>
            </div>
          </template>
        </div>

        <!-- Right Column - Shopping Cart -->
        <div class="lg:w-1/3">
          <div class="bg-white rounded-lg shadow-sm p-3 sticky top-4">
            <div
              class="bg-lime-600 rounded-xl gap-3 p-4 flex flex-row justify-center items-center mb-3"
            >
              <img src="./../assets/images/cart.png" alt="Cart" width="35" />
              <h2 class="text-xl font-semibold text-white">
                My Basket ({{ cartItemsCount }})
              </h2>
            </div>

            <!-- Cart loading state -->
            <template v-if="cartStore.loading">
              <div class="text-center py-4">Loading cart items...</div>
            </template>

            <template v-else-if="cartStore.error">
              <div class="text-center py-4 text-red-500">
                Error: {{ cartStore.error }}
              </div>
            </template>

            <!-- Empty shopping cart -->
            <template v-else-if="!cartItems || cartItems.length === 0">
              <div class="text-center py-8">
                <p class="text-gray-500">Your basket is empty</p>
                <button
                  @click="searchQuery = ''"
                  class="mt-4 bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            </template>

            <!-- Cart with items -->
            <template v-else>
              <div class="space-y-4 mb-6 max-h-96 overflow-y-auto">
                <div
                  v-for="item in cartItems"
                  :key="item.cart_id"
                  class="border-b pb-4"
                >
                  <div class="flex justify-between">
                    <div>
                      <p class="font-medium text-gray-800">
                        {{ item.product.product_name }}
                      </p>
                    </div>
                    <span class="font-bold">
                      {{ formatCurrency(item.product.price) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center mt-2">
                    <button
                      class="text-white bg-red-500 p-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
                      @click="removeFromCart(item.cart_id)"
                    >
                      Remove
                    </button>
                    <div
                      class="flex items-center border rounded-lg overflow-hidden"
                    >
                      <button
                        class="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                        @click="
                          updateCartItemQuantity(
                            item.cart_id,
                            item.quantity - 1
                          )
                        "
                        :disabled="item.quantity <= 1"
                        :class="{
                          'opacity-50 cursor-not-allowed': item.quantity <= 1,
                        }"
                      >
                        -
                      </button>
                      <span class="px-3">{{ item.quantity }}</span>
                      <button
                        class="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                        @click="
                          updateCartItemQuantity(
                            item.cart_id,
                            item.quantity + 1
                          )
                        "
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Summary -->
              <div class="space-y-2 mb-6">
                <div class="flex justify-between">
                  <span class="text-gray-600">Sub Total:</span>
                  <span class="font-bold">
                    {{ formatCurrency(orderSummary.subtotal) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Discounts:</span>
                  <span class="text-red-500">
                    -{{ formatCurrency(orderSummary.discount) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Delivery Fee:</span>
                  <span>{{ formatCurrency(orderSummary.deliveryFee) }}</span>
                </div>
              </div>

              <!-- Total -->
              <div class="border-t pt-4 mb-6">
                <div class="flex justify-between font-bold text-lg">
                  <span>Total to pay</span>
                  <span>{{ formatCurrency(orderSummary.total) }}</span>
                </div>
              </div>

              <!-- Checkout Button -->
              <button
                @click="proceedToCheckout"
                :disabled="isCheckingOut || checkoutStore.isLoading"
                class="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isCheckingOut || checkoutStore.isLoading"
                  >Processing...</span
                >
                <span v-else>Proceed to Checkout</span>
              </button>

              <!-- Checkout error message -->
              <div
                v-if="checkoutStore.error"
                class="mt-4 text-red-500 text-center"
              >
                {{ checkoutStore.error }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>

  <Footer></Footer>
</template>

<style scoped></style>
