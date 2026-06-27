import api, { getCollection, getSingleItem } from "./api";

const latestJobService = {
  getAll: async () => getCollection("/api/jobs"),
  getBySlug: async (slug) => getSingleItem(`/api/jobs/${slug}`),
  create: async (payload) => {
    const response = await api.post("/api/jobs", payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await api.put(`/api/jobs/${id}`, payload);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/jobs/${id}`);
    return response.data;
  },
};

export default latestJobService;
