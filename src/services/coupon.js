import { api, adminApi, API_PATH } from "./api"


export const getAdminCouponsApi = (page = 1) => {
  return adminApi.get(`/api/${API_PATH}/admin/coupons`, {
    params: {
      page
    },
  });
}

export const addAdminCouponsApi = (data) => {
  return adminApi.post(`/api/${API_PATH}/admin/coupon`, data);
}

export const updateAdminCouponsApi = (id, data) => {
  return adminApi.put(`/api/${API_PATH}/admin/coupon/${id}`, data);
}
export const deleteAdminCouponsApi = (id) => {
  return adminApi.delete(`/api/${API_PATH}/admin/coupon/${id}`);
}


export const useCouponsApi = (data) => {
  return api.post(`/api/${API_PATH}/coupon`, data);
}
