import { UserRoles } from "../services/auth.service";

const pageRoles = {
  index: ["sadmin", "admin"],

  organization: {
    this: ["sadmin", "admin"],
    create: ["sadmin", "admin"],
    manage: ["sadmin", "admin"],
    button: {
      back: ["sadmin", "admin"],
    },
  },

  election: {
    election_officer: ["sadmin", "admin"],
    button: {
      back: ["sadmin", "admin"],
    },
  },

  admin: {
    this: ["sadmin", "admin"],
  },

  dialogs: {
    default: ["sadmin", "admin", "elec_ofc"] as UserRoles[],
    resolveTie: ["sadmin", "admin", "elec_ofc"] as UserRoles[],
    resetTieBreaker: ["sadmin", "admin", "elec_ofc"] as UserRoles[],
    publishResult: ["sadmin", "admin", "elec_ofc"] as UserRoles[],
    unPublishResult: ["sadmin", "admin", "elec_ofc"] as UserRoles[],

    deleteElection: ["sadmin", "admin"] as UserRoles[],
    deleleElectionOfficer: ["sadmin", "admin"] as UserRoles[],
    deleteOrganization: ["sadmin", "admin"] as UserRoles[],
    removeAccount: ["sadmin", "admin"] as UserRoles[],
    launchElection: ["sadmin", "admin"] as UserRoles[],
    closeElection: ["sadmin", "admin"] as UserRoles[],
  },
};

export default pageRoles;
