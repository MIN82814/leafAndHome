import { adminApi, api, API_PATH } from "./api"

export const signInApi = (formData) => {
  return api.post(`/admin/signin`, formData);
}


export const checkSignInApi = () => {
  return adminApi.post(`/api/user/check`);
}


export const logOutApi = () => {
  return adminApi.post(`/logout`);
}
