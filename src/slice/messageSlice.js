import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  name: 'message',
  initialState: [
    // {
    //   id: 1,
    //   type: 'success',
    //   title: '成功',
    //   text: '更新成功',
    // },
    // {
    //   id: 2,
    //   type: 'danger',
    //   title: '失敗',
    //   text: '更新失敗',
    // }
  ],
  reducers: {
    createMessage(state, action) {
      state.push({
        id: action.payload.id,
        type: action.payload.color ? 'success' : 'danger',  //狀態
        title: action.payload.success ? '成功' : '失敗',        //狀態
        text: action.payload.message,    //回傳的訊息
      })
    },
    removeMessage(state, action) {
      const index = state.findIndex(message => message.id === action.payload)
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  }
})

export const createAsyncMessage = createAsyncThunk(
  //哪一個slice的名稱/方法
  'message/createAsyncMessage',
  async (payload, { dispatch, requestId }) => {
    //設定訊息
    dispatch(createMessage({
      ...payload,
      id: requestId,
    }))
    //創建後過兩秒後移除訊息
    setTimeout(() => {
      dispatch(removeMessage(requestId));
    }, 2000);
  }
);
export const { createMessage, removeMessage } = messageSlice.actions; //解構Slice的actions

export default messageSlice.reducer;