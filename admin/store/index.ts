import { getAccessorType } from "typed-vuex";

// Import all your submodules
import * as snackbar from "~/store/snackbar";
import * as manageElection from "~/store/manageElection";
import * as system from "~/store/system";
import * as user from "~/store/user";
import * as myAccount from "~/store/myAccount";
import * as electionResult from "~/store/electionResult";
import * as organization from "~/store/organization";

export const accessorType = getAccessorType({
  modules: {
    // The key (submodule) needs to match the Nuxt namespace (e.g. ~/store/submodule.ts)
    manageElection,
    snackbar,
    system,
    user,
    myAccount,
    electionResult,
    organization,
  },
});
