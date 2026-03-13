import { adminApi, API_PATH } from "./api"

export const uploadImageApi = (formData) => {
  return adminApi.post(`/api/${API_PATH}/admin/upload`, formData);
}

