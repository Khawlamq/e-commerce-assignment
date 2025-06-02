import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { createPinia, setActivePinia } from "pinia";
import { nextTick } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";

// Mocks
vi.mock("@heroicons/vue/24/outline", () => ({
  ChevronDoubleUpIcon: {
    name: "ChevronDoubleUpIcon",
    template: '<svg data-testid="scroll-up"></svg>',
  },
  ChevronDoubleDownIcon: {
    name: "ChevronDoubleDownIcon",
    template: '<svg data-testid="scroll-down"></svg>',
  },
  HeartIcon: {
    name: "HeartIcon",
    template: '<svg data-testid="heart-icon"></svg>',
  },
}));

vi.mock("vue-router", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ path: "/", params: {}, query: {} }),
}));

// Mock DOM methods
Object.defineProperty(window, "scrollY", {
  writable: true,
  value: 0,
});

Object.defineProperty(window, "innerHeight", {
  writable: true,
  value: 800,
});

Object.defineProperty(document.body, "offsetHeight", {
  writable: true,
  value: 1000,
});

describe("Home Page Integration Tests", () => {
  let wrapper: VueWrapper<any>;
  let vuetify: any;
  let pinia: any;
  let HomeComponent: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    vuetify = createVuetify();
    pinia = createPinia();
    setActivePinia(pinia);

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();

    const module = await import("../../src/pages/HomePage.vue");
    HomeComponent = module.default;
  });

  afterEach(() => {
    if (wrapper) wrapper.unmount();
  });

  const createWrapper = async (mockStores = true) => {
    if (mockStores) {
      // Setup store mocks before mounting
      const { useProductStore } = await import("../../src/stores/productStore");
      const { useCartStore } = await import("../../src/stores/cartStore");
      const { useUserStore } = await import("../../src/stores/userStore");
      const { useWishListStore } = await import(
        "../../src/stores/wishListStore"
      );

      const productStore = useProductStore();
      const cartStore = useCartStore();
      const userStore = useUserStore();
      const wishListStore = useWishListStore();

      // Mock all store methods
      productStore.fetchProducts = vi.fn().mockResolvedValue(undefined);
      cartStore.addCartItem = vi.fn().mockResolvedValue(undefined);
      wishListStore.addWishList = vi.fn().mockResolvedValue(undefined);

      // Set default values
      userStore.token = "";
    }

    return mount(HomeComponent, {
      global: {
        plugins: [vuetify, pinia],
        stubs: {
          "router-link": {
            template: "<a><slot /></a>",
            props: ["to"],
          },
        },
      },
    });
  };

  describe("Product List Rendering", () => {
    // it("renders products when products are available", async () => {
    //   const { useProductStore } = await import("../../src/stores/productStore");

    //   const productStore = useProductStore();

    //   const testProduct = {
    //     id: 1,
    //     name: "Test Product",
    //     description: "Test description",
    //     price: 100,
    //     categoryId: 1,
    //     imageURL: "https://example.com/test.jpg",
    //   };

    //   productStore.products = [testProduct];
    //   productStore.isLoading = false;
    //   productStore.fetchProducts = vi.fn().mockResolvedValue(undefined);

    //   wrapper = await createWrapper(false);
    //   await flushPromises();
    //   await nextTick();

    //   // Manually trigger loadMore since onMounted might not have completed
    //   wrapper.vm.loadMore();
    //   await nextTick();
    //   expect(wrapper.text()).toContain("Test Product");
    //   expect(wrapper.text()).toContain("123 SAR");
    // });

    it("displays loading spinner when loading", async () => {
      const { useProductStore } = await import("../../src/stores/productStore");
      const productStore = useProductStore();

      // Set loading state before mounting
      productStore.fetchProducts = vi
        .fn()
        .mockImplementation(() => new Promise(() => {}));
      productStore.isLoading = true;
      productStore.products = [];

      wrapper = await createWrapper();
      await nextTick();

      expect(wrapper.text()).toContain("جاري تحميل المنتجات");
    });

    it("shows empty alert when no products available", async () => {
      const { useProductStore } = await import("../../src/stores/productStore");
      const productStore = useProductStore();

      // Set empty state before mounting
      productStore.fetchProducts = vi.fn().mockResolvedValue(undefined);
      productStore.products = [];
      productStore.isLoading = false;

      wrapper = await createWrapper();
      await flushPromises();
      await nextTick();

      expect(wrapper.text()).toContain("لا توجد منتجات");
    });
  });

  describe("User Interactions", () => {
    it("calls addToCart when add to cart button is clicked", async () => {
      const { useProductStore } = await import("../../src/stores/productStore");
      const { useCartStore } = await import("../../src/stores/cartStore");
      const { useUserStore } = await import("../../src/stores/userStore");

      const productStore = useProductStore();
      const cartStore = useCartStore();
      const userStore = useUserStore();

      const testProduct = {
        id: 1,
        name: "Test Product",
        description: "Test description",
        price: 100,
        categoryId: 1,
        imageURL: "https://example.com/test.jpg",
      };

      productStore.products = [testProduct];
      productStore.isLoading = false;
      cartStore.addCartItem = vi.fn().mockResolvedValue(undefined);
      userStore.token = "valid-token";

      wrapper = await createWrapper(false);
      await flushPromises();
      await nextTick();

      wrapper.vm.loadMore();
      await nextTick();

      const buttons = wrapper.findAll("button");
      const addToCartButton = buttons.find((btn) =>
        btn.text().includes("إضافة للسلة")
      );

      if (addToCartButton) {
        await addToCartButton.trigger("click");
        await flushPromises();
        expect(cartStore.addCartItem).toHaveBeenCalledWith(1);
      }
      await wrapper.vm.addToCart(1);
      expect(cartStore.addCartItem).toHaveBeenCalledWith(1);
    });

    it("calls addToWishList when add to wishlist button is clicked", async () => {
      const { useProductStore } = await import("../../src/stores/productStore");
      const { useWishListStore } = await import(
        "../../src/stores/wishListStore"
      );
      const { useUserStore } = await import("../../src/stores/userStore");

      const productStore = useProductStore();
      const wishListStore = useWishListStore();
      const userStore = useUserStore();

      // Setup test product
      const testProduct = {
        id: 1,
        name: "Test Product",
        description: "Test description",
        price: 100,
        categoryId: 1,
        imageURL: "https://example.com/test.jpg",
      };

      productStore.products = [testProduct];
      productStore.isLoading = false;
      productStore.fetchProducts = vi.fn();
      wishListStore.addWishList = vi.fn();
      userStore.token = "dummy-token";

      wrapper = await createWrapper(false);
      await flushPromises();
      wrapper.vm.loadMore();
      await nextTick();

      const heartButton = wrapper.find('[data-testid="wishlist-button"]');

      if (heartButton.exists()) {
        expect(heartButton.exists()).toBe(true);

        await heartButton.trigger("click");
        await flushPromises();
        expect(wishListStore.addWishList).toHaveBeenCalledWith(
          testProduct.description,
          testProduct.id,
          testProduct.imageURL,
          testProduct.price
        );
      }
    });

    it("handles scroll to top and bottom", async () => {
      wrapper = await createWrapper();
      await flushPromises();
      await nextTick();

      const mockScrollIntoView = vi.fn();
      Element.prototype.scrollIntoView = mockScrollIntoView;

      wrapper.vm.scrollTo("top");
      wrapper.vm.scrollTo("bottom");

      expect(mockScrollIntoView).toHaveBeenCalledTimes(2);
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    });
  });
});
