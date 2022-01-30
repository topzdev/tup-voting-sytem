import { Middleware } from "@nuxt/types";
import { RolesString, UserRole } from "@/types/roles";
import { statusOnlyAllowed } from "@/helpers/isAllowedByStatus.helper";

//https://github.com/nuxt/nuxt.js/issues/1687

const statusMiddleware: Middleware = async ({ route, error, app }) => {
  console.log("Checking Status Middleware");

  if (!process.server) {
    let election = app.$accessor.manageElection.election;

    if (!election) {
      const election_id = route.params.electionId;
      await app.$accessor.manageElection.fetchElection(parseInt(election_id));
      election = app.$accessor.manageElection.election;
    }

    console.log("Middleware Election", election, route.meta);

    if (election && route.meta && route.meta.length) {
      const metaStatus = (route.meta as []).find((item) => item["status"]);

      if (!metaStatus) return;

      const currentStatus = election.final_status;
      const statusesAllowed = metaStatus["status"];

      console.log("Status Allowed", statusesAllowed);

      if (!statusOnlyAllowed(currentStatus, statusesAllowed)) {
        return error({
          statusCode: 401,
          message: `The Election Status must be <b>${(statusesAllowed as [])
            .map((item) => item)
            .join(",")} </b> to be allowed to use this route`,
        });
      }
    }
  }
};

export default statusMiddleware;
