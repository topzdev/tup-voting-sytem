import Vue from "vue";

const authMixin = Vue.extend({
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$nuxt.$router.push("/login");
    },
  },

  computed: {
    fullname(): string {
      if (!this.$auth.loggedIn) return "";

      const { firstname, lastname } = this.$auth.user as any;

      return `${firstname} ${lastname}`;
    },

    initials(): string {
      const allNames = this.fullname.trim().split(" ");
      const initials = allNames.reduce((acc, curr, index) => {
        if (index === 0 || index === allNames.length - 1) {
          acc = `${acc}${curr.charAt(0).toUpperCase()}`;
        }
        return acc;
      }, "");

      return initials;
    },
  },
});

export default authMixin;
