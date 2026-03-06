import { adminApi, api, API_PATH } from "./api";

export const getArticlesApi = (page = 1) => {
  return api.get(`/api/${API_PATH}/articles`, {
    params: {
      page,
    },
  });
};
export const getArticleIdApi = (id) => {
  return api.get(`/api/${API_PATH}/article/${id}`);
};

// 後台管理端 (Admin)
// 1. 取得後台文章列表
export const getAdminArticlesApi = () => {
  return adminApi.get(`/api/${API_PATH}/admin/articles`);
};
// 2. 取得後台單一文章詳細內容
export const getAdminArticleIdApi = (id) => {
  return adminApi.get(`/api/${API_PATH}/admin/article/${id}`);
};

// 3. 新增文章
export const postAdminArticleApi = (payload) => {
  return adminApi.post(`/api/${API_PATH}/admin/article`, payload);
};
// 4. 更新文章
export const putAdminArticleApi = (id, payload) => {
  return adminApi.put(`/api/${API_PATH}/admin/article/${id}`, payload);
};
// 5. 刪除文章
export const deleteAdminArticleApi = (id) => {
  return adminApi.delete(`/api/${API_PATH}/admin/article/${id}`);
};
// 6. 圖片上傳 (給編輯器或主圖使用)
export const postAdminUploadApi = (formData) => {
  return adminApi.post(`/api/${API_PATH}/admin/upload`, formData);
};
// 7. 取得所有產品列表
export const getAllProductsApi = () => {
  return api.get(`/api/${API_PATH}/products/all`);
};
