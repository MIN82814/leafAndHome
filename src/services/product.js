import { adminApi, api, API_PATH } from "./api"

//封裝 API , 只封裝axios的部分 因此不需要 async await 
export const getProductsApi = (page = 1, category) => {
  return api.get(`/api/${API_PATH}/products`, {
    params: {
      page,
      category: category === "all" ? undefined : category,
    },
  })
}
export const getProductsAllApi = () => {
  return api.get(`/api/${API_PATH}/products/all`)
}
export const getProductApi = (id) => {
  return api.get(`/api/${API_PATH}/product/${id}`)
}
export const getAdminProductsApi = (page = 1, category) => {
  return adminApi.get(`/api/${API_PATH}/admin/products`, {
    params: {
      page,
      category: category === "all" ? undefined : category,
    },
  })
}

export const updateAdminProductsApi = (data) => {
  return adminApi.put(`/api/${API_PATH}/admin/product/${data.data.id}`, data);
  // return console.log(data);
}