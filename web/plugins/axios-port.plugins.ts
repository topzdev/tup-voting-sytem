import { Plugin } from "@nuxt/types";
import { setClient } from "~/services";

const axiosPortPlugin: Plugin = ({ app }) => {
  setClient(app.$axios);
};

export default axiosPortPlugin;
