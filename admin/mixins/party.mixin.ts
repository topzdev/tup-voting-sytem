import Vue from "vue";

const partyMixin = Vue.extend({
  data() {
    return {
      pagePath: "party",
    };
  },
  methods: {
    createPartyRoute() {
      this.$router.push(`${this.pagePath}/create`);
    },
    editPartyRoute(id: number) {
      this.$router.push(`${this.pagePath}/${id}/edit`);
    },
  },
});

export default partyMixin;
