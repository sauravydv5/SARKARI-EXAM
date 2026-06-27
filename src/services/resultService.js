import api, { getCollection, getSingleItem } from "./api";

const resultService = {
  getAll: async () => getCollection("/api/results"),
  getBySlug: async (slug) => getSingleItem(`/api/results/${slug}`),
  create: async (payload) => {
    const response = await api.post("/api/results", payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await api.put(`/api/results/${id}`, payload);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/results/${id}`);
    return response.data;
  },
};

export default resultService;
