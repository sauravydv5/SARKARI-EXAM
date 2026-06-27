import api, { getCollection, getSingleItem } from "./api";

const admissionService = {
  getAll: async () => getCollection("/api/admissions"),
  getBySlug: async (slug) => getSingleItem(`/api/admissions/${slug}`),
  create: async (payload) => {
    const response = await api.post("/api/admissions", payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await api.put(`/api/admissions/${id}`, payload);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/admissions/${id}`);
    return response.data;
  },
};

export default admissionService;
