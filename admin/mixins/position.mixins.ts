import { RouteConfig } from "@nuxt/types/config/router";
import Vue from "vue";

const positionsMixin = Vue.extend({
  data() {
    return {
      pagePath: "positions",
    };
  },
  methods: {
    createPositionRoute() {
      return `${this.pagePath}/create`;
    },
    editPositionRoute(id: number, config?: RouteConfig): RouteConfig {
      return {
        ...config,
        path: `${this.pagePath}/${id}/edit`,
      };
    },
  },
});

export default positionsMixin;
