import { Plugin } from "@nuxt/types";
import { setClient } from "~/services";
import { statusOnlyAllowed } from "../helpers/isAllowedByStatus.helper";

const statusInitPlugin: Plugin = ({ route, error, app }) => {
  if (!process.server) {
    const election = app.$accessor.manageElection.election;

    console.log("Middleware Election", election, route.meta);

    if (election && route.meta && route.meta[1].status) {
      const currentStatus = election.final_status;
      const statusesAllowed = route.meta[1].status;

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

export default statusInitPlugin;
