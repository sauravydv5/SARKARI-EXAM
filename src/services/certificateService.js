import api, { getCollection, getSingleItem } from "./api";

const certificateService = {
  getAll: async () => getCollection("/api/certificates"),
  getBySlug: async (slug) => getSingleItem(`/api/certificates/${slug}`),
  create: async (payload) => {
    const response = await api.post("/api/certificates", payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await api.put(`/api/certificates/${id}`, payload);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/certificates/${id}`);
    return response.data;
  },
};

export default certificateService;
