import cron from "node-cron";
import cronHandlers from "./handlers";

// will run at 11:55am
cron.schedule(
  "55 23 * * *",
  async function () {
    await cronHandlers.sendElectionHasEnded();
  },
  {
    timezone: "Asia/Manila",
  }
);

// will run at 10:55am
cron.schedule(
  "55 22 * * *",
  async function () {
    await cronHandlers.sendElectionWillStartHandler();
  },
  {
    timezone: "Asia/Manila",
  }
);

// will run at 10:55am
cron.schedule(
  "55 21 * * *",
  async function () {
    await cronHandlers.sendElectionCredentialsHandler();
  },
  {
    timezone: "Asia/Manila",
  }
);
