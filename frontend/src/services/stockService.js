import api from "./api";

export const getStockTransactions = async (params) => {
  const res = await api.get("/stocks", { params });
  return res.data;
};

export const createStockTransaction = async (data) => {
  const res = await api.post("/stocks", data);
  return res.data;
};

export const stockIn = async (data) => {
  const res = await api.post("/stock/in", data);
  return res.data;
};

export const stockOut = async (data) => {
  const res = await api.post("/stock/out", data);
  return res.data;
};

export const getAuditLogs = async () => {
  const res = await api.get("/stock/audit-logs");
  return res.data;
};
