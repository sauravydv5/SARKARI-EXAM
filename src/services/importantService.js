import api, { getCollection, getSingleItem } from "./api";

const importantService = {
  getAll: async () => getCollection("/api/important"),
  getBySlug: async (slug) => getSingleItem(`/api/important/${slug}`),
  create: async (payload) => {
    const response = await api.post("/api/important", payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await api.put(`/api/important/${id}`, payload);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/important/${id}`);
    return response.data;
  },
};

export default importantService;
