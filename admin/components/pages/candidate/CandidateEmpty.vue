<template>
  <span>
    <v-icon color="primary" size="100">{{ thisPageConfig.icon }}</v-icon>
    <h1 class="display-2">No Candidate Yet</h1>
    <p class="mt-3 mx-auto body-1" style="width: 75%" v-text="message"></p>
    <v-alert
      v-if="alert.show"
      text
      width="75%"
      class="mx-auto"
      :type="alert.type"
    >
      {{ alert.message }}
    </v-alert>
    <create-candidate-button width="75%" btnClass="mt-1 mx-auto" />
  </span>
</template>
<script lang="ts">
import CreateCandidateButton from "@/components/pages/candidate/buttons/CreateCandidateButton.vue";
import candidateMixins from "@/mixins/candidate.mixin";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import restrictionsMixin from "@/mixins/restrictions.mixin";
import mixins from "vue-typed-mixins";

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(
  manageElectionMixins,
  candidateMixins,
  restrictionsMixin
).extend({
  data() {
    return {
      alert: Object.assign({}, defaultAlert),
    };
  },
  components: {
    CreateCandidateButton,
  },
  computed: {
    thisPageConfig() {
      return this.links["candidates"];
    },

    noPosition(): boolean {
      if (!this.electionInfo) return true;
      return !this.electionInfo?.positionsCount;
    },

    message(): string {
      return this.noPosition
        ? "There is no position added. Please add position first in able to add candidates."
        : `A person running for a position or office. Add at least one in able to
      launch the election.`;
    },
  },
  created() {
    if (this.noPosition) {
      this.alert = {
        show: true,
        type: "error",
        message: "No position available",
      };
    }
  },
});
</script>

<style>
</style>