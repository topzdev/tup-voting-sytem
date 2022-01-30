import Vue from "vue";
import pageStatus from "@/configs/page-status.config";
import { statusOnlyAllowed } from "../helpers/isAllowedByStatus.helper";
import { ElectionStatus } from "../services/election.service";

const restrictionsMixin = Vue.extend({
  methods: {
    disabledByStatus(allowedStatus: ElectionStatus[] | string[]) {
      if (!this.currentElectionStatus) return false;
      return !statusOnlyAllowed(
        this.currentElectionStatus,
        allowedStatus as any
      );
    },

    hideByStatus(allowedStatus: ElectionStatus[] | string[]) {
      if (!this.currentElectionStatus) return true;
      return statusOnlyAllowed(
        this.currentElectionStatus,
        allowedStatus as any
      );
    },

    filterByStatus(items: any[]) {
      return items.filter((item) => {
        if (!this.currentElectionStatus || !item.status) return item;

        if (statusOnlyAllowed(this.currentElectionStatus, item.status))
          return item;
      });
    },
  },

  computed: {
    currentElectionStatus(): ElectionStatus | null {
      const election = this.$accessor.manageElection.election;

      if (!election) return null;
      return election.final_status;
    },

    pageStatus() {
      return pageStatus;
    },
  },
});

export default restrictionsMixin;
