import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useUserStore } from "../../src/stores/userStore";
import axios from "axios";

// Mock the axios module
vi.mock("axios");
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe("User Store Tests", () => {
  let userStore;

  beforeEach(() => {
    vi.clearAllMocks();
    const pinia = createPinia();
    setActivePinia(pinia);
    userStore = useUserStore();
  });

  it("signs in successfully", async () => {
    userStore.token = "fake-token";
    mockedAxios.post = vi.fn().mockResolvedValue({
      data: {
        token: "fake-token",
        user: { id: 1, name: "Test User" },
      },
    });

    await userStore.signIn("test@example.com", "password123");

    expect(userStore.token).toBe("fake-token");
    expect(userStore.user).toEqual({ id: 1, name: "Test User" });
    expect(userStore.message).toBe("تسجيل الدخول بنجاح!");
  });

  it("handles sign in error", async () => {
    mockedAxios.post = vi.fn().mockRejectedValue(new Error("API Error"));

    await userStore.signIn("test@example.com", "wrongpassword");

    expect(userStore.message).toBe("فشل تسجيل الدخول!");
  });

  it("signs up successfully", async () => {
    mockedAxios.post = vi.fn().mockResolvedValueOnce({
      data: {},
    });

    await userStore.signUp("test@example.com", "Test", "User", "password123");

    expect(userStore.message).toBe("تم إنشاء الحساب بنجاح .. سجل دخولك حتى تظهر لك قائمتك المفضلة والسلة الخاصة بك");
  });

  it("handles sign up error", async () => {
    mockedAxios.post = vi.fn().mockRejectedValue(new Error("API Error"));

    await userStore.signUp("test@example.com", "Test", "User", "password123");

    expect(userStore.message).toBe("فشل قي انشاء الحساب حاول مره اخرى !");
  });
});
