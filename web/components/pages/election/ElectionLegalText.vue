<template>
  <p>
    By Proceeding, you agree to
    <a
      :href="electionTermsAndCondition.route"
      target="_blank"
      v-text="electionTermsAndCondition.title"
    >
    </a>
    and
    <a :href="privacyPolicy.route" target="_blank" v-text="privacyPolicy.title">
    </a>
  </p>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import pageRoutes from "../../../configs/page-routes";
import { Election } from "../../../types/app";

export default Vue.extend({
  props: {
    election: {
      type: Object,
    } as PropOptions<Election>,
  },

  computed: {
    electionTermsAndCondition(): any {
      return {
        title: `${this.election.title}'s Terms and Condition`,
        route: pageRoutes.election(this.election.slug).termsAndCondition()
          .route,
      };
    },

    privacyPolicy(): any {
      return {
        title: "Privacy Policy",
        route: pageRoutes.privacyPolicy().this().route,
      };
    },
  },
});
</script>

<style>
</style>