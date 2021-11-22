import axios from "../../configs/axios";
import { AdminLoginCredentials } from "../../types/global";

const login = async (credentials: AdminLoginCredentials) => {
  const response = await axios.post(`api/v1/auth/admin/login`, credentials);
  console.log("Login Response", response);
  return response;
};

const logout = async () => {
  const response = await axios.post(`api/v1/auth/admin/logout`);

  return response;
};

const adminAuthApi = {
  login,
  logout,
};

export default adminAuthApi;
