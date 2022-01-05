import Vue from "vue";

const positionsMixin = Vue.extend({
  data() {
    return {
      pagePath: "positions",
    };
  },
  methods: {
    createPositionRoute() {
      this.$router.push(`${this.pagePath}/create`);
    },
    editPositionRoute(id: string) {
      this.$router.push(`${this.pagePath}/${id}/edit`);
    },
    importPositionRoute() {
      this.$router.push(`${this.pagePath}/import`);
    },
  },
});

export default positionsMixin;
