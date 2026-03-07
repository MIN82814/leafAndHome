import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
      console.log(response.data.data);
      dispatch(updateCart(response.data.data))
    } catch (error) {
      console.log(error.response);
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
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, { data });
      console.log(response.data);
      dispatch(createAsyncGetCart());
    } catch (error) {
      console.log(error.response);
    }
  }
)

export const createAsyncUpdateCart = createAsyncThunk(
  'cart/createAsyncAddCart',
  async ({ cartId, productId, qty = 1 }, { dispatch }) => {
    console.log(cartId, productId, qty)
    try {
      const data = {
        product_id: productId,
        qty,
      };
      const response = await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, { data });
      console.log(response.data);
      dispatch(createAsyncGetCart());
    } catch (error) {
      console.log(error.response);
    }
  }
)




export const createAsyncDelCart = createAsyncThunk(
  'cart/createAsyncDelCart',
  async (id, { dispatch }) => {
    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`);
      console.log(id);
      console.log(response.data);
      dispatch(createAsyncGetCart());
    } catch (error) {
      console.log(error.response);
    }
  }
)


export const { updateCart } = cartSlice.actions;

export default cartSlice.reducer;