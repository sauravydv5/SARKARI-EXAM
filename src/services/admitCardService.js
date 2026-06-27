import api, { getCollection, getSingleItem } from "./api";

const admitCardService = {
  getAll: async () => getCollection("/api/admit-cards"),
  getBySlug: async (slug) => getSingleItem(`/api/admit-cards/${slug}`),
  create: async (payload) => {
    const response = await api.post("/api/admit-cards", payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await api.put(`/api/admit-cards/${id}`, payload);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/admit-cards/${id}`);
    return response.data;
  },
};

export default admitCardService;
