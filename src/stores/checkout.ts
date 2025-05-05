import { defineStore } from "pinia";
import { ref } from "vue";
import { useCartStore } from "./cart";

interface Order {
  order_id: number;
  user_id: number;
  total_amount: number;
  status: string;
  payment_token?: string;
  payment_redirect_url?: string;
  created_at?: string;
  items?: OrderItem[];
}

interface OrderItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  size: string;
}

interface CheckoutResponse {
  success: boolean;
  message?: string;
  order_id?: number;
  payment_token?: string;
  redirect_url?: string;
  error?: string;
}

interface PaymentStatusResponse {
  success: boolean;
  status?: string;
  message?: string;
  error?: string;
}

const VITE_API_BASE_URL = "http://localhost:3000/api";

export const useCheckoutStore = defineStore("checkout", () => {
  // State
  const currentOrder = ref<Order | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const paymentStatus = ref<string | null>(null);
  const redirectUrl = ref<string | null>(null);

  // Use the existing cart store
  const cartStore = useCartStore();

  // Helper method for API requests
  const apiRequest = async (
    method: string,
    endpoint: string,
    body?: object
  ): Promise<any> => {
    isLoading.value = true;
    error.value = null;

    try {
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(
        `${VITE_API_BASE_URL}/order/${endpoint}`,
        options
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Request failed");
      }

      return await response.json();
    } catch (err: any) {
      error.value = err.message;
      console.error(`API Error (${endpoint}):`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Actions
  const processCheckout = async (checkoutData: {
    user_id: number;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    shipping_address?: string;
    payment_method?: string; // Optional if handled by Midtrans
  }): Promise<CheckoutResponse> => {
    try {
      // Ensure cart is up to date
      await cartStore.fetchCartItems(checkoutData.user_id);

      if (cartStore.cartItems.length === 0) {
        throw new Error("Cannot checkout with an empty cart");
      }

      // Prepare checkout payload
      const payload = {
        ...checkoutData,
        items: cartStore.cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
        })),
        total_amount: cartStore.cartTotal(),
      };

      const data = await apiRequest("POST", "checkout", payload);

      currentOrder.value = {
        order_id: data.order_id,
        user_id: checkoutData.user_id,
        total_amount: payload.total_amount,
        status: "pending",
        payment_token: data.payment_token,
        payment_redirect_url: data.redirect_url,
        items: payload.items.map((item) => ({
          product_id: item.product_id,
          product_name:
            cartStore.cartItems.find((ci) => ci.product_id === item.product_id)
              ?.product.product_name || "",
          price: item.price,
          quantity: item.quantity,
          size: item.size,
        })),
      };

      paymentStatus.value = "pending";
      redirectUrl.value = data.redirect_url;

      // Clear cart only after successful checkout initiation
      cartStore.cartItems = [];

      return {
        success: true,
        message: "Checkout successful",
        order_id: data.order_id,
        payment_token: data.payment_token,
        redirect_url: data.redirect_url,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Checkout failed",
      };
    }
  };

  const redirectToPayment = () => {
    if (redirectUrl.value) {
      window.location.href = redirectUrl.value;
    }
  };

  const verifyPayment = async (
    orderId: number
  ): Promise<PaymentStatusResponse> => {
    try {
      const data = await apiRequest("GET", `order/${orderId}/status`);

      paymentStatus.value = data.status;

      if (currentOrder.value) {
        currentOrder.value.status = data.status;
      }

      return {
        success: true,
        status: data.status,
        message: data.message,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Payment verification failed",
      };
    }
  };

  const fetchOrderDetails = async (orderId: number): Promise<void> => {
    try {
      const data = await apiRequest("GET", `orders/${orderId}`);
      currentOrder.value = data;
      paymentStatus.value = data.status;
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      throw err;
    }
  };

  // Getters
  const isCheckoutComplete = () => {
    return currentOrder.value !== null && paymentStatus.value === "success";
  };

  const isPaymentPending = () => {
    return paymentStatus.value === "pending";
  };

  return {
    // State
    currentOrder,
    isLoading,
    error,
    paymentStatus,
    redirectUrl,

    // Actions
    processCheckout,
    verifyPayment,
    fetchOrderDetails,
    redirectToPayment,

    // Getters
    isCheckoutComplete,
    isPaymentPending,
  };
});
