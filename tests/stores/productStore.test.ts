// tests/stores/productStore.spec.ts

import { setActivePinia, createPinia } from "pinia";
import { useProductStore } from "../../src/stores/productStore";
import { describe, it, expect, beforeEach, vi } from "vitest";
import axios from "axios";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};

// Mock helper
vi.mock("@/assets/js/helpers", () => ({
  setTimeForMsg: vi.fn((store, msg, time) => {
    store.message = msg;
  }),
}));

describe("productStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it("fetches products successfully and sets message", async () => {
    const fakeProducts = [
      { id: 1, name: "Product 1", price: 100, imageURL: "", description: "" },
      { id: 2, name: "Product 2", price: 200, imageURL: "", description: "" },
    ];

    mockedAxios.get = vi.fn().mockResolvedValue({ data: fakeProducts });

    const store = useProductStore();
    await store.fetchProducts();

    expect(mockedAxios.get).toHaveBeenCalledOnce();
    expect(store.products).toEqual(fakeProducts);
    expect(store.message).toBe("تم اضافة المنتج الى عربة التسوق بنجاح");
  });

  it("handles fetch failure and sets error message", async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(new Error("Network error"));

    const store = useProductStore();
    await store.fetchProducts();

    expect(mockedAxios.get).toHaveBeenCalledOnce();
    expect(store.products).toEqual([]); // still empty
    expect(store.message).toBe("حدثت مشكلة! الرجاء المحاولة مرة اخرى");
  });
});
