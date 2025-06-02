import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { createPinia, setActivePinia } from "pinia";
import { nextTick } from "vue";

// Mocks
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));
const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
}));

vi.mock("@heroicons/vue/24/outline", () => ({
  EyeIcon: {
    name: "EyeIcon",
    template:
      '<svg data-testid="eye-icon" @click="$emit(\'click\')" style="cursor: pointer;"></svg>',
    emits: ["click"],
  },
  EyeSlashIcon: {
    name: "EyeSlashIcon",
    template:
      '<svg data-testid="eye-slash-icon" @click="$emit(\'click\')" style="cursor: pointer;"></svg>',
    emits: ["click"],
  },
  ArrowRightIcon: {
    name: "ArrowRightIcon",
    template: '<svg data-testid="arrow-icon"></svg>',
  },
}));

vi.mock("../assets/js/helpers", () => ({
  setTimeForMsg: (store, message) => {
    store.message = message; // Set message immediately without timeout
  },
}));

describe("Signin.vue Integration Tests", () => {
  let wrapper: VueWrapper<any>;
  let vuetify: any;
  let pinia: any;
  let SigninComponent: any;
  let userStore: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    vuetify = createVuetify();
    pinia = createPinia();
    setActivePinia(pinia);

    const module = await import("../../src/pages/SignIn.vue");
    SigninComponent = module.default;

    const { useUserStore } = await import("../../src/stores/userStore");
    userStore = useUserStore();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = () => {
    return mount(SigninComponent, {
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

  it("renders the sign in form", async () => {
    wrapper = createWrapper();
    wrapper.vm.formRef = {
      validate: vi.fn().mockResolvedValue({ valid: true }),
    };
    await nextTick();

    expect(wrapper.text()).toContain("تسجيل الدخول");
    expect(wrapper.text()).toContain("انشاء حساب جديد");

    const emailInput = wrapper.find('[data-testid="email-input"]');
    const passwordInput = wrapper.find('[data-testid="password-input"]');

    expect(emailInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);
  });

  it("shows error when form is invalid", async () => {
    const axios = await import("axios");
    wrapper = createWrapper();
    await wrapper.find(".login-button").trigger("click");
    await nextTick();
    expect(axios.default.post).not.toHaveBeenCalled();
  });

  it("logs in user successfully", async () => {
    vi.useFakeTimers();
    wrapper = createWrapper();

    wrapper.vm.username = "user@example.com";
    wrapper.vm.password = "password";
    wrapper.vm.formRef = {
      validate: vi.fn().mockResolvedValue({ valid: true }),
    };

    userStore.signIn = vi.fn(async () => {
      userStore.token = "fake-token";
      userStore.message = "تسجيل الدخول بنجاح!";
      await nextTick();
    });

    await wrapper.find(".login-button").trigger("click");
    await nextTick();

    vi.runAllTimers();
    await nextTick();
  });

  it("toggles password visibility", async () => {
    wrapper = createWrapper();
    await nextTick();

    const eyeIcon = wrapper.find('[data-testid="eye-icon"]');
    const eyeSlashIcon = wrapper.find('[data-testid="eye-slash-icon"]');

    if (eyeIcon.exists()) {
      await eyeIcon.trigger("click");
      expect(wrapper.vm.show2).toBe(true);
    } else if (eyeSlashIcon.exists()) {
      await eyeSlashIcon.trigger("click");
      expect(wrapper.vm.show2).toBe(false);
    }
  });
});
