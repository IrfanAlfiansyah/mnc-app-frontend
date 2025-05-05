import { defineStore } from "pinia";
import { ref } from "vue";

interface CartItem {
  cart_id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: {
    product_id: number;
    product_name: string;
    price: number;
    stok: number;
  };
}

interface CartResponse {
  success: boolean;
  message?: string;
  data?: CartItem | CartItem[];
  error?: string;
}

const VITE_API_BASE_URL = "http://localhost:3000/api";

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<CartItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchCartItems = async (user_id: number) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`${VITE_API_BASE_URL}/cart/cart`, {
        headers: {
          'Content-Type': 'application/json',
          // Jika menggunakan auth token:
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CartItem[] = await response.json();
      cartItems.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch cart items';
      console.error('Error fetching cart items:', err);
    } finally {
      loading.value = false;
    }
  };

  const addToCart = async (product_id: number, quantity: number, user_id: number) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`${VITE_API_BASE_URL}/cart/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Jika menggunakan auth token:
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify({ product_id, quantity, user_id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CartResponse = await response.json();
      if (data.success && data.data) {
        // Jika produk sudah ada di cart, update quantity
        const existingIndex = cartItems.value.findIndex(
          item => item.product_id === product_id
        );
        
        if (existingIndex !== -1) {
          cartItems.value[existingIndex].quantity += quantity;
        } else {
          // Jika produk baru di cart, tambahkan ke array
          cartItems.value.push(data.data as CartItem);
        }
      }
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add to cart';
      console.error('Error adding to cart:', err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const updateCartItem = async (cart_id: number, quantity: number, user_id: number) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`${VITE_API_BASE_URL}/cart/cart/${cart_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Jika menggunakan auth token:
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify({ quantity, user_id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CartResponse = await response.json();
      if (data.success && data.data) {
        const index = cartItems.value.findIndex(item => item.cart_id === cart_id);
        if (index !== -1) {
          cartItems.value[index] = data.data as CartItem;
        }
      }
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update cart item';
      console.error('Error updating cart item:', err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const removeFromCart = async (cart_id: number, user_id: number) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`${VITE_API_BASE_URL}/cart/cart/${cart_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Jika menggunakan auth token:
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify({ user_id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CartResponse = await response.json();
      if (data.success) {
        cartItems.value = cartItems.value.filter(item => item.cart_id !== cart_id);
      }
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to remove from cart';
      console.error('Error removing from cart:', err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Helper untuk menghitung total harga
  const cartTotal = () => {
    return cartItems.value.reduce(
      (total, item) => total + (item.product.price * item.quantity), 0
    );
  };

  // Helper untuk menghitung total item
  const cartItemsCount = () => {
    return cartItems.value.reduce(
      (count, item) => count + item.quantity, 0
    );
  };

  return {
    cartItems,
    loading,
    error,
    fetchCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartTotal,
    cartItemsCount,
  };
});