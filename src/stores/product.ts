import { defineStore } from "pinia";
import { ref } from "vue";

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  stok: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductResponse {
  success: boolean;
  message?: string;
  data?: Product | Product[];
  error?: string;
}

const VITE_API_BASE_URL = "http://localhost:3000/api";

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchProducts = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`${VITE_API_BASE_URL}/product/product`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Product[] = await response.json();
      products.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch products';
      console.error('Error fetching products:', err);
    } finally {
      loading.value = false;
    }
  };

  const getProductById = async (id: number): Promise<Product | undefined> => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`${VITE_API_BASE_URL}/product/product/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ProductResponse = await response.json();
      return data.data as Product;
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Failed to fetch product with id ${id}`;
      console.error(`Error fetching product ${id}:`, err);
      return undefined;
    } finally {
      loading.value = false;
    }
  };

  const createProduct = async (productData: Omit<Product, 'product_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`${VITE_API_BASE_URL}/product/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ProductResponse = await response.json();
      if (data.success && data.data) {
        products.value.push(data.data as Product);
      }
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create product';
      console.error('Error creating product:', err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const updateProduct = async (id: number, productData: Partial<Product>) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`${VITE_API_BASE_URL}/product/product/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ProductResponse = await response.json();
      if (data.success && data.data) {
        const index = products.value.findIndex(p => p.product_id === id);
        if (index !== -1) {
          products.value[index] = { ...products.value[index], ...data.data };
        }
      }
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Failed to update product with id ${id}`;
      console.error(`Error updating product ${id}:`, err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`${VITE_API_BASE_URL}/product/product/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ProductResponse = await response.json();
      if (data.success) {
        products.value = products.value.filter(p => p.product_id !== id);
      }
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Failed to delete product with id ${id}`;
      console.error(`Error deleting product ${id}:`, err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
});