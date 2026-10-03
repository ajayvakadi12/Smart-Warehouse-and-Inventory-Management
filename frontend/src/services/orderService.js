import api from "./api";

export const getOrders = async (params) => {
  const res = await api.get("/orders", { params });
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const createOrder = async (data) => {
  const res = await api.post("/orders", data);
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await api.put(`/orders/${id}/status`, { status });
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await api.delete(`/orders/${id}`);
  return res.data;
};
