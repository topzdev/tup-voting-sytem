<template>
  <span>
    <v-icon color="primary" size="100">{{ thisPageConfig.icon }}</v-icon>
    <h1 class="display-2">No Candidate Yet</h1>
    <p class="mt-3 mx-auto body-1" style="width: 75%">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos aperiam amet
      autem sed facilis deserunt corrupti aliquid odit dolorem, provident
    </p>
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
import mixins from "vue-typed-mixins";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import candidateMixins from "@/mixins/candidate.mixin";
import restrictionsMixin from "@/mixins/restrictions.mixin";
import CreateCandidateButton from "@/components/pages/candidate/buttons/CreateCandidateButton.vue";

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