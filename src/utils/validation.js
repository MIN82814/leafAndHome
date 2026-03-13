export const emailValidation = {
  required: "請輸入email",
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Email格式不正確",
  }
}