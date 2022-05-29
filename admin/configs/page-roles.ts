import { UserRoles } from "../services/auth.service";

const pageRoles = {
  organization: {
    create: ["sadmin", "admin"],
    manage: ["sadmin", "admin"],
    button: {
      back: ["sadmin", "admin"],
    },
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
  },
};

export default pageRoles;
