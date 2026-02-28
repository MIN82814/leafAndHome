import { adminApi, api, API_PATH } from "./api"

export const getArticlesApi = (page = 1) => {
  return api.get(`/api/${API_PATH}/articles`, {
    params: {
      page
    },
  })
}

