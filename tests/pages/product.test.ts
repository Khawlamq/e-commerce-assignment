import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createVuetify } from "vuetify";
import { nextTick } from "vue";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../../src/assets/js/helpers", () => ({
  setTimeForMsg: vi.fn((store, message, timeout) => {
    store.message = message;
    setTimeout(() => {
      store.message = "";
    }, timeout);
  }),
}));

vi.mock("vue-router", () => ({
  useRoute: () => ({
    params: { id: "1" },
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("Product Integration Test", () => {
  let wrapper: VueWrapper<any>;
  let vuetify: ReturnType<typeof createVuetify>;
  let pinia: ReturnType<typeof createPinia>;
  let Product: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    vuetify = createVuetify();
    pinia = createPinia();
    setActivePinia(pinia);

    const module = await import("../../src/pages/Product.vue");
    Product = module.default;
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.useRealTimers();
  });

  const createWrapper = () => {
    return mount(Product, {
      global: {
        plugins: [vuetify, pinia],
        stubs: {
          "router-link": true,
        },
      },
    });
  };

  it("print products from the store", async () => {
    const { useProductStore } = await import("../../src/stores/productStore");
    const store = useProductStore();

    store.products = [
      {
        id: 1,
        name: "Test Product",
        description: "This is a test product.",
        price: 123,
        categoryId: 2,
        imageURL: "https://example.com/sample.jpg",
      },
    ];

    wrapper = createWrapper();
    await nextTick();

    expect(wrapper.text()).toContain("Test Product");
    expect(wrapper.text()).toContain("123");
  });

  it("shows loading message when no products in store", async () => {
    const { useProductStore } = await import("../../src/stores/productStore");
    useProductStore().products = [];

    wrapper = createWrapper();
    await nextTick();

    expect(wrapper.text()).toContain("جاري تحميل المنتجات");
  });

  it("adds product to cart when Add to Cart button is clicked", async () => {
    const { useProductStore } = await import("../../src/stores/productStore");
    const { useCartStore } = await import("../../src/stores/cartStore");

    const product = {
      id: 1,
      name: "Another Product",
      description: "none",
      price: 100,
      categoryId: 5,
      imageURL: "",
    };

    const productStore = useProductStore();
    productStore.products = [product];

    const cartStore = useCartStore();

    cartStore.addCartItem = vi.fn();
    cartStore.updateCartItem = vi.fn();

    wrapper = createWrapper();
    await nextTick();

    const button = wrapper.find(".addToCartButton");
    await button.trigger("click");
    await nextTick();

    expect(cartStore.addCartItem).toHaveBeenCalledWith(product.id);
  });

  it('shows "المنتج غير موجود" if product not found in store', async () => {
    const { useProductStore } = await import("../../src/stores/productStore");

    const productStore = useProductStore();
    productStore.products = [
      {
        id: 999,
        name: "Not matching",
        description: "Should not show",
        price: 0,
        categoryId: 1,
        imageURL: "",
      },
    ];

    wrapper = createWrapper();
    await nextTick();

    expect(wrapper.text()).toContain("المنتج غير موجود");
  });
});
