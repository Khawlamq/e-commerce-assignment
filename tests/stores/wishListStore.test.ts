import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useWishListStore } from "../../src/stores/wishListStore";
import { useUserStore } from "../../src/stores/userStore";
import axios from "axios";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../src/assets/js/helpers", () => ({
  setTimeForMsg: vi.fn(),
}));

describe("WishList Store", () => {
  let wishListStore: ReturnType<typeof useWishListStore>;
  let userStore: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    wishListStore = useWishListStore();
    userStore = useUserStore();

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("should initialize with correct default values", () => {
      expect(wishListStore.wishList).toEqual([]);
      expect(wishListStore.message).toBe("");
    });
  });

  describe("fetchWishList", () => {
    it("should show login message when no token", async () => {
      userStore.token = "";
      await wishListStore.fetchWishList();

      expect(wishListStore.message).toBe("قم بتسجيل الدخول اولا"); // Ensure this matches the actual message in the store

      expect(axios.get).not.toHaveBeenCalled();
    });

    it("should fetch wish list items successfully when token exists", async () => {
      userStore.token = "fake-token";
      const mockWishListData = [
        {
          id: 1,
          name: "Product 1",
          imageURL: "",
          price: 100,
          description: "",
          categoryId: 50,
        },
      ];

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockWishListData });

      await wishListStore.fetchWishList();

      expect(axios.get).toHaveBeenCalledWith(
        "https://limitless-lake-55070.herokuapp.com/wishlist/fake-token"
      );

      expect(wishListStore.wishList).toEqual(mockWishListData);
    });

    it("should handle API errors gracefully", async () => {
      userStore.token = "fake-token";
      vi.mocked(axios.get).mockRejectedValueOnce(new Error("API Error"));

      await wishListStore.fetchWishList();

      // Check the error message
      expect(wishListStore.message).toBe(
        "حدثت مشكلة! الرجاء المحاولة مرة اخرى"
      );
    });
  });

  describe("addWishList", () => {
    it("should show login message when no token", async () => {
      userStore.token = "";

      await wishListStore.addWishList(
        "Test desc",
        1,
        "test.jpg",
        "Product 1",
        100
      );
      expect(wishListStore.message).toBe("قم بتسجيل الدخول اولا"); // Ensure this matches the actual message in the store

      expect(axios.post).not.toHaveBeenCalled();
    });

    it("should handle API errors when adding item", async () => {
      userStore.token = "fake-token";

      vi.mocked(axios.post).mockRejectedValueOnce(new Error("API Error"));

      await wishListStore.addWishList(
        "Test desc",
        1,
        "test.jpg",
        "Product 1",
        100
      );
      expect(wishListStore.message).toBe(
        "هناك مشكلة! لم يتم اضافة المنتج الى المفضلة "
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty wishlist response", async () => {
      userStore.token = "fake-token";

      vi.mocked(axios.get).mockResolvedValueOnce({ data: [] });

      await wishListStore.fetchWishList();

      expect(wishListStore.wishList).toEqual([]);
    });

    it("should handle wishlist with multiple items", async () => {
      userStore.token = "fake-token";
      const mockWishListData = [
        {
          id: 1,
          name: "Product 1",
          imageURL: "img1.jpg",
          price: 100,
          description: "Desc 1",
        },
        {
          id: 2,
          name: "Product 2",
          imageURL: "img2.jpg",
          price: 200,
          description: "Desc 2",
        },
        {
          id: 3,
          name: "Product 3",
          imageURL: "img3.jpg",
          price: 300,
          description: "Desc 3",
        },
      ];

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockWishListData });

      await wishListStore.fetchWishList();

      expect(wishListStore.wishList).toEqual(mockWishListData);
      expect(wishListStore.wishList).toHaveLength(3);
    });
  });
});
