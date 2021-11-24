import axios from "../../configs/axios";
import { AdminLoginCredentials } from "../../types/global";

const login = async (credentials: AdminLoginCredentials) => {
  const response = await axios.post(`api/v1/auth/admin/login`, credentials);
  return response;
};

const logout = async () => {
  const response = await axios.post(`api/v1/auth/admin/logout`);

  return response;
};

const me = async (accessToken: string) => {
  const response = await axios.get("api/v1/auth/admin/me", {
    headers: {
      Authorization: accessToken,
    },
  });

  return response;
};

const adminAuthApi = {
  login,
  logout,
  me,
};

export default adminAuthApi;
