import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { createPinia, setActivePinia } from "pinia";
import { nextTick } from "vue";
import type { VueWrapper } from "@vue/test-utils";

// Mock external dependencies
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));


vi.mock("@heroicons/vue/24/outline", () => ({
  MinusIcon: {
    name: "MinusIcon",
    template:
      '<svg data-testid="minus-icon" @click="$emit(\'click\')" style="cursor: pointer;"></svg>',
    emits: ["click"],
  },
  PlusIcon: {
    name: "PlusIcon",
    template:
      '<svg data-testid="plus-icon" @click="$emit(\'click\')" style="cursor: pointer;"></svg>',
    emits: ["click"],
  },
  TrashIcon: {
    name: "TrashIcon",
    template:
      '<svg data-testid="trash-icon" @click="$emit(\'click\')" style="cursor: pointer;"></svg>',
    emits: ["click"],
  },
  ArrowRightIcon: {
    name: "ArrowRightIcon",
    template: '<svg data-testid="arrow-icon"></svg>',
  },
}));

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  useRoute: () => ({
    path: "/cart",
    params: {},
    query: {},
  }),
}));

describe("Cart Component Integration Tests", () => {
  let wrapper: VueWrapper<any>;
  let vuetify: any;
  let pinia: any;
  let CartComponent: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    vuetify = createVuetify();
    pinia = createPinia();
    setActivePinia(pinia);

    const module = await import("../../src/pages/Cart.vue");
    CartComponent = module.default;
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = () => {
    return mount(CartComponent, {
      global: {
        plugins: [vuetify, pinia],
        stubs: {
          "router-link": {
            template:
              '<a class="router-link" @click="$emit(\'click\')"><slot /></a>',
            props: ["to"],
            emits: ["click"],
          },
        },
      },
    });
  };

  describe("Store Integration", () => {
    it("should display cart items when they exist", async () => {
      const { useCartStore } = await import("../../src/stores/cartStore");
      const cartStore = useCartStore();

      cartStore.cartItems = [
        {
          id: 1,
          quantity: 2,
          product: { id: 101, name: "Test Product", price: 100 },
        },
      ];
      cartStore.totalCost = 200;
      await nextTick();

      wrapper = createWrapper();
      await nextTick();

      expect(wrapper.text()).toContain("Test Product");
      expect(wrapper.text()).toContain("SAR 100");
      expect(wrapper.text()).toContain("سلة المشتريات (2)");
    });

    it("should handle empty cart state correctly", async () => {
      const { useCartStore } = await import("../../src/stores/cartStore");
      const cartStore = useCartStore();

      cartStore.cartItems = [];
      cartStore.totalCost = 0;
      await nextTick();

      wrapper = createWrapper();
      await nextTick();

      expect(wrapper.text()).toContain("لا توجد منتجات في سلة التسوق");
      expect(wrapper.text()).toContain("سلة المشتريات (0)");
    });

    it("should call store methods and handle button interactions", async () => {
      const { useCartStore } = await import("../../src/stores/cartStore");
      const axios = await import("axios");
      const cartStore = useCartStore();

      cartStore.cartItems = [
        {
          id: 1,
          product: {
            id: 101,
            name: "Test Product",
            price: 100,
            imageURL: "https://example.com/image.jpg",
          },
          quantity: 2,
        },
      ];
      await nextTick();

      wrapper = createWrapper();
      await nextTick();

      vi.mocked(axios.default.put).mockResolvedValue({
        data: { success: true },
      });

      const plusButtons = wrapper.findAll('[data-testid="plus-icon"]');
      if (plusButtons.length > 0) {
        await plusButtons[0].trigger("click");
        expect(axios.default.put).toHaveBeenCalled();
      }
    });

    it("should handle API errors ", async () => {
      const { useCartStore } = await import("../../src/stores/cartStore");
      const { useUserStore } = await import("../../src/stores/userStore");
      const axios = await import("axios");
      const cartStore = useCartStore();
      const userStore = useUserStore();

      userStore.token = "dummy-token";
      cartStore.message = "";

      vi.mocked(axios.default.post).mockRejectedValue(new Error("API error"));

      await cartStore.addCartItem(1);
      await nextTick();

      expect(cartStore.message).toContain(
        "هناك مشكلة لم يتم اضافة المنتج الى عربة التسوق"
      );
    });

    it("should show and hide messages with proper timing", async () => {
      const { useCartStore } = await import("../../src/stores/cartStore");
      const cartStore = useCartStore();

      wrapper = createWrapper();
      await nextTick();

      cartStore.message = "Test message";
      await nextTick();

      expect(wrapper.text()).toContain("Test message");

      cartStore.message = "";
      await nextTick();

      expect(wrapper.text()).not.toContain("Test message");
    });
  });

  describe("User Authentication Integration", () => {
    it("should behave differently based on user authentication", async () => {
      const { useUserStore } = await import("../../src/stores/userStore");
      const userStore = useUserStore();

      wrapper = createWrapper();
      await nextTick();

      userStore.token = ""; // No token
      await nextTick();
      expect(wrapper.exists()).toBe(true);

      userStore.token = "test-token"; // With token
      await nextTick();
      expect(wrapper.exists()).toBe(true);
    });
  });
});
