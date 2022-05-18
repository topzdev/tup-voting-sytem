import { ElectionStatus } from "../services/election.service";

const pageStatus = {
  launchpad: ["building"],
  results: ["completed", "archived"],
  party: {
    create: ["building"],
    edit: ["building"],
  },
  voters: {
    create: ["building"],
    edit: ["building"],
    import: ["building"],
    export: ["building", "running", "completed", "archived"],

    table: {
      isVoted: ["running", "completed", "archived"],
      action: ["building"],
    },
  },
  positions: {
    create: ["building"],
    edit: ["building"],
    arrange: ["building", "running"],
  },
  candidate: {
    create: ["building"],
    edit: ["building"],
  },
  settings: {
    closeElection: ["running"],
    archiveElection: ["completed"],
    emails: {
      page: ["preview", "running", "completed"],
      credentials: ["preview", "running"],
      electionHasLaunched: ["preview", "running"],
      electionHasEnded: ["completed"],
    },
    publicity: {
      page: ["building", "running", "preview", "completed"],
      preRegistration: ["building", "preview"],
    },
  },

  preRegister: ["preview"],

  overview: {
    counts: {
      participation: ["preview", "completed", "archived"],
    },
  },
};

export default pageStatus;
