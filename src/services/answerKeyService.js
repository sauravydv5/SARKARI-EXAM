import api, { getCollection, getSingleItem } from "./api";

const answerKeyService = {
  getAll: async () => getCollection("/api/answer-keys"),
  getBySlug: async (slug) => getSingleItem(`/api/answer-keys/${slug}`),
  create: async (payload) => {
    const response = await api.post("/api/answer-keys", payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await api.put(`/api/answer-keys/${id}`, payload);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/answer-keys/${id}`);
    return response.data;
  },
};

export default answerKeyService;
