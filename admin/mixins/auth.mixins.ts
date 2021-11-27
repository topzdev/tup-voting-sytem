import Vue from "vue";

const authMixin = Vue.extend({
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$nuxt.$router.push("/login");
    },
  },
});

export default authMixin;
