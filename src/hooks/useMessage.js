import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../slice/messageSlice";

//封裝MessageToast的訊息內容
export default function useMessage() {
  const dispatch = useDispatch();
  const showSuccess = (message) => {
    dispatch(
      createAsyncMessage({
        success: true,
        message,
      }),
    );
  }
  const showError = (message) => {
    dispatch(
      createAsyncMessage({
        success: false,
        message,
      }),
    );
  }
  //匯出方法
  return {
    showError, showSuccess,
  }
}