import cron from "node-cron";
import cronHandlers from "./handlers";

cron.schedule(
  "15 22 * * *",
  async function () {
    await cronHandlers.sendElectionWillStartHandler();
  },
  {
    timezone: "Asia/Manila",
  }
);

cron.schedule("* * * * *", function () {
  console.log("Hello World!");
});
