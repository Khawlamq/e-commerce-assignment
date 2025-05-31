export const setTimeForMsg = (
  store: { message: string },
  message: string,
  duration: number
): void => {
  store.message = message;
  setTimeout(() => {
    store.message = "";
  }, duration);
};

export const requiredRule = (v: string) => !!v || "هذا الحقل مطلوب";
export const emailRule = (v: string) =>
  (!!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ||
  "الرجاء إدخال بريد إلكتروني بشكل صحيح!";
