import { defineStore } from "pinia";
import { ref } from "vue";

// Shared interfaces
interface User {
  id: number;
  name?: string;
  email: string;
  token?: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: User;
  error?: string;
}

const VITE_API_BASE_URL = "http://localhost:3000/api";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Initialize user from localStorage if available
  const storedUser = localStorage.getItem("authUser");
  try {
    if (storedUser && storedUser !== "undefined") {
      user.value = JSON.parse(storedUser);
    }
  } catch (e) {
    console.warn("Failed to parse stored user:", e);
    localStorage.removeItem("authUser");
  }

  // Shared method
  const handleRequest = async (
    url: string,
    body: object
  ): Promise<AuthResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      // Expecting the user object inside `data.user`
      const loggedInUser: User = data.user;

      user.value = loggedInUser;

      // Save user to localStorage
      localStorage.setItem("authUser", JSON.stringify(loggedInUser));

      return {
        success: true,
        message: data.message || "Operation successful",
        data: loggedInUser,
      };
    } catch (err: any) {
      error.value = err.message;
      return {
        success: false,
        error: err.message,
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Actions
  const signup = async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    return handleRequest("auth/signup", userData);
  };

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    return handleRequest("auth/login", credentials);
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("authUser");
  };

  return {
    user,
    isLoading,
    error,
    signup,
    login,
    logout,
  };
});
