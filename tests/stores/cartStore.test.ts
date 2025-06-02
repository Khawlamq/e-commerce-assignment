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
    vi.clearAllMocks(); // Reset mocks before each test
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore mocks after each test
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
      mockedAxios.get = vi
        .fn()
        .mockResolvedValue({ data: { cartItems: [], totalCost: 0 } });

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

  describe("deleteCartItem", () => {
    it("should delete item successfully", async () => {
      userStore.token = "fake-token";

      mockedAxios.delete = vi
        .fn()
        .mockResolvedValue({ data: { success: true } });
      mockedAxios.get = vi
        .fn()
        .mockResolvedValue({ data: { cartItems: [], totalCost: 0 } });

      await cartStore.deleteCartItem(456);

      expect(cartStore.message).toBe("تم حذف المنتج من عربة التسوق بنجاح");
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        "https://limitless-lake-55070.herokuapp.com/cart/delete/456?token=fake-token"
      );
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it("should handle API errors when deleting item", async () => {
      userStore.token = "fake-token";
      mockedAxios.delete = vi
        .fn()
        .mockRejectedValue(new Error("Delete API Error"));

      await cartStore.deleteCartItem(456);

      expect(cartStore.message).toBe(
        "هناك مشكلة لم يتم حذف المنتج من عربة التسوق"
      );
    });
  });

  describe("updateCartItem", () => {
    it("should update item successfully", async () => {
      userStore.token = "fake-token";

      mockedAxios.put = vi.fn().mockResolvedValue({ data: { success: true } });
      mockedAxios.get = vi
        .fn()
        .mockResolvedValue({ data: { cartItems: [], totalCost: 0 } });

      await cartStore.updateCartItem(789, 123, 5);

      expect(cartStore.message).toBe("تم تحديث عربة التسوق بنجاح");
      expect(mockedAxios.put).toHaveBeenCalledWith(
        "https://limitless-lake-55070.herokuapp.com/cart/update/789?token=fake-token",
        { id: 789, productId: 123, quantity: 5 }
      );
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it("should handle API errors when updating item", async () => {
      userStore.token = "fake-token";
      mockedAxios.put = vi
        .fn()
        .mockRejectedValue(new Error("Update API Error"));

      await cartStore.updateCartItem(789, 123, 5);

      expect(cartStore.message).toBe(
        "هناك مشكلة لم يتم تحديث عربة التسوق بنجاح"
      ); 
    });
  });

  describe("Edge Cases and Integration", () => {
    it("should handle multiple sequential operations", async () => {
      userStore.token = "fake-token";

      // Mock all API calls to succeed
      vi.mocked(axios.post).mockResolvedValue({ data: { success: true } });
      vi.mocked(axios.put).mockResolvedValue({ data: { success: true } });
      vi.mocked(axios.delete).mockResolvedValue({ data: { success: true } });
      vi.mocked(axios.get).mockResolvedValue({
        data: { cartItems: [], totalCost: 0 },
      });

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
      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { cartItems: [], totalCost: 0 },
      });

      await cartStore.addCartItem(123);
      expect(axios.post).toHaveBeenCalledWith(
        "https://limitless-lake-55070.herokuapp.com/cart/add?token=new-token",
        { productId: 123, quantity: 1 }
      );
    });
  });
});
