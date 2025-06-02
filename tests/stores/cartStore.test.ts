import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCartStore } from "../../src/stores/cartStore";
import { useUserStore } from "../../src/stores/userStore";
import axios from "axios";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

// Mock helper function
vi.mock("@/assets/js/helpers", () => ({
  setTimeForMsg: vi.fn((store, msg, time) => {
    store.message = msg;
  }),
}));

describe("cartStore", () => {
  let cartStore;
  let userStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    cartStore = useCartStore();
    userStore = useUserStore();
    vi.clearAllMocks(); 
  });

  afterEach(() => {
    vi.restoreAllMocks(); 
  });

  describe("fetchCartItems", () => {
    it("should show login message when no token", async () => {
      userStore.token = "";

      await cartStore.fetchCartItems();

      expect(cartStore.message).toBe(" قم بتسجيل الدخول اولا");
      expect(axios.get).not.toHaveBeenCalled();
    });

    it("should fetch cart items successfully when token exists", async () => {
      userStore.token = "fake-token";
      const mockCartData = {
        cartItems: [{ id: 1, name: "Product 1", price: 100, quantity: 2 }],
        totalCost: 250,
      };

      mockedAxios.get = vi.fn().mockResolvedValue({ data: mockCartData });

      await cartStore.fetchCartItems();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://limitless-lake-55070.herokuapp.com/cart/?token=fake-token"
      );

      expect(cartStore.cartItems).toEqual(mockCartData.cartItems);
      expect(cartStore.totalCost).toBe(250);
    });

    it("should handle API errors", async () => {
      userStore.token = "fake-token";
      mockedAxios.get = vi.fn().mockRejectedValue(new Error("API Error"));

      await cartStore.fetchCartItems();

      expect(mockedAxios.get).toHaveBeenCalled();
      expect(cartStore.cartItems).toEqual([]); // Should still be empty
      expect(cartStore.message).toBe("حدثت مشكلة! الرجاء المحاولة مرة اخرى");
    });
  });

  
  describe("addCartItem", () => {
    it("should show login message when no token", async () => {
      userStore.token = "";

      await cartStore.addCartItem(123);

      expect(cartStore.message).toBe("قم بتسجيل الدخول اولا");
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("should add item successfully", async () => {
      userStore.token = "fake-token";

      mockedAxios.post = vi.fn().mockResolvedValue({ data: { success: true } });
      mockedAxios.get = vi.fn().mockResolvedValue({ data: { cartItems: [], totalCost: 0 } });

      await cartStore.addCartItem(123);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://limitless-lake-55070.herokuapp.com/cart/add?token=fake-token",
        { productId: 123, quantity: 1 }
      );

      expect(cartStore.message).toBe("تم اضافة المنتج الى عربة التسوق بنجاح");
    });

    it("should handle API errors when adding item", async () => {
      userStore.token = "fake-token";
      mockedAxios.post = vi.fn().mockRejectedValue(new Error("API Error"));

      await cartStore.addCartItem(123);

      expect(cartStore.message).toBe(
        "هناك مشكلة لم يتم اضافة المنتج الى عربة التسوق"
      );
    });
  });

  // ... Continue similarly for deleteCartItem and updateCartItem

  describe("Edge Cases and Integration", () => {
    it("should handle multiple sequential operations", async () => {
      userStore.token = "fake-token";

      // Mock all API calls to succeed
      vi.mocked(axios.post).mockResolvedValue({ data: { success: true } });
      vi.mocked(axios.put).mockResolvedValue({ data: { success: true } });
      vi.mocked(axios.delete).mockResolvedValue({ data: { success: true } });
      vi.mocked(axios.get).mockResolvedValue({ data: { cartItems: [], totalCost: 0 } });

      // Perform multiple operations
      await cartStore.addCartItem(123);
      await cartStore.updateCartItem(456, 123, 3);
      await cartStore.deleteCartItem(456);

      // Verify all operations were called
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.delete).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledTimes(3); // Each operation calls fetchCartItems
    });

    it("should handle token changes between operations", async () => {
      // Start with no token
      userStore.token = "";
      await cartStore.addCartItem(123);
      expect(axios.post).not.toHaveBeenCalled();

      // Add token and try again
      userStore.token = "new-token";
      vi.mocked(axios.post).mockResolvedValueOnce({ data: { success: true } });
      vi.mocked(axios.get).mockResolvedValueOnce({ data: { cartItems: [], totalCost: 0 } });

      await cartStore.addCartItem(123);
      expect(axios.post).toHaveBeenCalledWith(
        "https://limitless-lake-55070.herokuapp.com/cart/add?token=new-token",
        { productId: 123, quantity: 1 }
      );
    });
  });
});