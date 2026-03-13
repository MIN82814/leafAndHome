import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { createAsyncMessage } from "../slice/messageSlice";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    carts: [],
    total: 0,
    final_total: 0,
  },
  reducers: {
    updateCart(state, action) {
      state.carts = action.payload.carts;
      state.total = action.payload.total;
      state.final_total = action.payload.final_total;
    }
  }
})




export const createAsyncGetCart = createAsyncThunk(
  'cart/createAsyncGetCart',
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      dispatch(updateCart(response.data.data))
    } catch (error) {
      dispatch(
        createAsyncMessage({
          success: false,
          message: error.response.data.message,
        })
      );
    }
  }
)

export const createAsyncAddCart = createAsyncThunk(
  'cart/createAsyncAddCart',
  async ({ id, qty = 1 }, { dispatch }) => {
    try {
      const data = {
        product_id: id,
        qty,
      };
      await axios.post(`${API_BASE}/api/${API_PATH}/cart`, { data });
      dispatch(
        createAsyncMessage({
          success: true,
          message: "加入購物車成功",
        })
      );
      dispatch(createAsyncGetCart());
    } catch (error) {
      dispatch(
        createAsyncMessage({
          success: false,
          message: error.response.data.message,
        })
      );
    }
  }
)

export const createAsyncUpdateCart = createAsyncThunk(
  'cart/createAsyncAddCart',
  async ({ cartId, productId, qty = 1 }, { dispatch }) => {
    try {
      const data = {
        product_id: productId,
        qty,
      };
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, { data });
      // dispatch(
      //   createAsyncMessage({
      //     success: true,
      //     message: "更新產品數量成功",
      //   })
      // );
      dispatch(createAsyncGetCart());
    } catch (error) {
      dispatch(
        createAsyncMessage({
          success: false,
          message: error.response.data.message,
        })
      );
    }
  }
)




export const createAsyncDelCart = createAsyncThunk(
  'cart/createAsyncDelCart',
  async (id, { dispatch }) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`);
      dispatch(
        createAsyncMessage({
          success: true,
          message: "產品購物車刪除成功",
        })
      );
      dispatch(createAsyncGetCart());
    } catch (error) {
      dispatch(
        createAsyncMessage({
          success: false,
          message: error.response.data.message,
        })
      );
    }
  }
)


export const createAsyncDelAllCart = createAsyncThunk(
  'cart/createAsyncDelCart',
  async (id, { dispatch }) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      dispatch(
        createAsyncMessage({
          success: true,
          message: "購物車清空成功",
        })
      );
      dispatch(createAsyncGetCart());
    } catch (error) {
      dispatch(
        createAsyncMessage({
          success: false,
          message: error.response.data.message,
        })
      );
    }
  }
)



export const { updateCart } = cartSlice.actions;

export default cartSlice.reducer;