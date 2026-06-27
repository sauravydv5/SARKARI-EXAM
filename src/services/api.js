
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCollection = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    const payload = response?.data;

    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;

    return [];
  } catch {
    return [];
  }
};

export const getSingleItem = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    const payload = response?.data;

    if (payload && typeof payload === "object") {
      if (Array.isArray(payload)) return payload[0] || null;
      if (payload?.data && typeof payload.data === "object") return payload.data;
      return payload;
    }

    return null;
  } catch {
    return null;
  }
};

export default api;

