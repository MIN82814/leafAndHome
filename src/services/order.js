import { adminApi, api, API_PATH } from "./api"

//封裝 API , 只封裝axios的部分 因此不需要 async await 
export const getOrdersApi = (page = 1, category) => {
  return api.get(`/api/${API_PATH}/orders`, {
    params: {
      page,
      category: category === "all" ? undefined : category,
    },
  })
}
export const getOrdersAllApi = () => {
  return api.get(`/api/${API_PATH}/orders/all`)
}
export const getOrderApi = (id) => {
  return api.get(`/api/${API_PATH}/order/${id}`)
}
export const getAdminOrdersApi = (page = 1, category) => {
  return adminApi.get(`/api/${API_PATH}/admin/orders`, {
    params: {
      page,
      category: category === "all" ? undefined : category,
    },
  })
}
export const updateAdminOrderApi = (id, data) => {
  return adminApi.put(`/api/${API_PATH}/admin/order/${id}`, {
    data,
  })
}

export const delAdminOrderApi = (id) => {
  return adminApi.delete(`/api/${API_PATH}/admin/order/${id}`)
}