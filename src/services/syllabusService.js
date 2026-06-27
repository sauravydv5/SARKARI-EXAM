import api, { getCollection, getSingleItem } from "./api";

const syllabusService = {
  getAll: async () => getCollection("/api/syllabus"),
  getBySlug: async (slug) => getSingleItem(`/api/syllabus/${slug}`),
  create: async (payload) => {
    const response = await api.post("/api/syllabus", payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await api.put(`/api/syllabus/${id}`, payload);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/syllabus/${id}`);
    return response.data;
  },
};

export default syllabusService;
