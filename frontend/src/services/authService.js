import api from "./api";


// Login API
export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

// Register API
export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};