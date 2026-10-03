import api from "./api";

export const getShipments = async () => {
  const res = await api.get("/shipments");
  return res.data;
};

export const createShipment = async (data) => {
  const res = await api.post("/shipments", data);
  return res.data;
};

export const receiveShipment = async (id) => {
  const res = await api.put(`/shipments/${id}/receive`);
  return res.data;
};
