import axios from "axios";
import configs from ".";

const instance = axios.create({
  baseURL: configs.server.host,
});

export default instance;
