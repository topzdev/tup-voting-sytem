import mixins from "vue-typed-mixins";
import manageElectionMixins from "./manage-election.mixins";

const overviewMixin = mixins(manageElectionMixins).extend({
  computed: {
    pagePath() {
      return `/manage/election/${this.electionId}/overview/`;
    },
  },

  methods: {
    overviewPage() {
      return `${this.pagePath}`;
    },
  },
});

export default overviewMixin;
