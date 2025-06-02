import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { createPinia, setActivePinia } from "pinia";
import { useWishListStore } from "../../src/stores/wishListStore";
import { useUserStore } from "../../src/stores/userStore";

// Mock external dependencies
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Wishlist Component Tests", () => {
  let wrapper;
  let vuetify;
  let pinia;

  beforeEach(async () => {
    vi.clearAllMocks();
    vuetify = createVuetify();
    pinia = createPinia();
    setActivePinia(pinia);

    const module = await import("../../src/pages/Wishlist.vue");
    wrapper = mount(module.default, {
      global: {
        plugins: [vuetify, pinia],
      },
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it("displays login message when no token", async () => {
    const userStore = useUserStore();
    userStore.token = ""; 
    const wishListStore = useWishListStore();
    await wishListStore.fetchWishList(); 

    await wrapper.vm.$nextTick(); 

    expect(wrapper.text()).toContain("قم بتسجيل الدخول لعرض المفضلات"); 
  });

  it("renders wishlist items correctly", async () => {
    const userStore = useUserStore();
    userStore.token = "fake-token"; 
    const wishListStore = useWishListStore();
    wishListStore.wishList = [
      {
        id: 1,
        name: "Product 1",
        imageURL: "image1.jpg",
        price: 100,
        description: "",
        categoryId: 1,
      },
    ];
    await wrapper.vm.$nextTick(); 
    const items = wrapper.findAll(".cart-item");
    expect(items.length).toBe(1); 
    expect(wrapper.text()).toContain("Product 1");
  });

  it("displays alert for empty wishlist", async () => {
    const userStore = useUserStore();
    userStore.token = "fake-token"; 
    const wishListStore = useWishListStore();
    wishListStore.wishList = []; 
    await wrapper.vm.$nextTick(); 

    expect(wrapper.text()).toContain("لا توجد منتجات مفضلة");
  });
});