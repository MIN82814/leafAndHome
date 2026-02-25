import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "../slice/cartSlice"
import MessageReducer from "../slice/messageSlice"

export const store = configureStore({
  reducer: {
    cart: CartReducer,
    message: MessageReducer,
  }
})