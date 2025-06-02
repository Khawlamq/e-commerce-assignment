import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useWishListStore } from "../../src/stores/wishListStore";
import { useUserStore } from "../../src/stores/userStore";
import axios from "axios";

// Mock axios properly
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock the helper function
vi.mock("../src/assets/js/helpers", () => ({
  setTimeForMsg: vi.fn(),
}));

// Import the mocked function
import { setTimeForMsg } from "../../src/assets/js/helpers";

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
    vi.restoreAllMocks(); // Restore mocks after each test
  });

  describe("Initial State", () => {
    it("should initialize with correct default values", () => {
      expect(wishListStore.wishList).toEqual([]);
      expect(wishListStore.message).toBe("");
    });
  });

  describe("fetchWishList", () => {
    it("should show login message when no token", async () => {
      userStore.token = ""; // Set token to empty

      await wishListStore.fetchWishList(); // Call the action

      // Directly check the message in the store
      expect(wishListStore.message).toBe("قم بتسجيل الدخول اولا"); // Ensure this matches the actual message in the store

      // Verify that the API call was not made
      expect(axios.get).not.toHaveBeenCalled();
    });

    it("should fetch wish list items successfully when token exists", async () => {
      userStore.token = "fake-token"; // Set a valid token
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

      // Mock the API response
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockWishListData });

      await wishListStore.fetchWishList(); // Call the action to fetch the wishlist

      expect(axios.get).toHaveBeenCalledWith(
        "https://limitless-lake-55070.herokuapp.com/wishlist/fake-token" // Check the correct URL
      );

      expect(wishListStore.wishList).toEqual(mockWishListData); // Check the wish list data
    });

    it("should handle API errors gracefully", async () => {
      userStore.token = "fake-token"; // Set a valid token

      // Mock the API error response
      vi.mocked(axios.get).mockRejectedValueOnce(new Error("API Error"));

      await wishListStore.fetchWishList(); // Call the action

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

    it("should add item successfully", async () => {
      userStore.token = "fake-token";

      vi.mocked(axios.post).mockResolvedValueOnce({ data: { success: true } });
      vi.mocked(axios.get).mockResolvedValueOnce({ data: [] });

      await wishListStore.addWishList(
        "Test desc",
        1,
        "test.jpg",
        "Product 1",
        100
      );
      expect(wishListStore.message).toBe("تم اضافة المنتج الى المفضلة بنجاح");

      expect(axios.post).toHaveBeenCalledWith(
        "https://limitless-lake-55070.herokuapp.com/wishlist/add?token=fake-token",
        {
          description: "Test desc",
          id: 1,
          imageURL: "test.jpg",
          name: "Product 1",
          price: 100,
        }
      );

      expect(axios.get).toHaveBeenCalled();
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
    it("should handle multiple sequential operations", async () => {
      userStore.token = "fake-token";

      vi.mocked(axios.post).mockResolvedValue({ data: { success: true } });
      vi.mocked(axios.get).mockResolvedValue({ data: [] });

      await wishListStore.addWishList("Desc1", 1, "img1.jpg", "Product 1", 100);
      await wishListStore.addWishList("Desc2", 2, "img2.jpg", "Product 2", 200);

      expect(axios.post).toHaveBeenCalledTimes(2);
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    it("should handle token changes between operations", async () => {
      userStore.token = "";
      await wishListStore.addWishList("Desc", 1, "img.jpg", "Product", 100);
      expect(axios.post).not.toHaveBeenCalled();

      userStore.token = "new-token";
      vi.mocked(axios.post).mockResolvedValueOnce({ data: { success: true } });
      vi.mocked(axios.get).mockResolvedValueOnce({ data: [] });

      await wishListStore.addWishList("Desc", 1, "img.jpg", "Product", 100);
      expect(axios.post).toHaveBeenCalledWith(
        "https://limitless-lake-55070.herokuapp.com/wishlist/add?token=new-token",
        {
          description: "Desc",
          id: 1,
          imageURL: "img.jpg",
          name: "Product",
          price: 100,
        }
      );
    });

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
