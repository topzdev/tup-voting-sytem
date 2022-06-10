import { Plugin } from "@nuxt/types";
import pageConfig from "../configs/pages.config";

const authPlugin: Plugin = ({ $auth, app, redirect }) => {
  // if (!process.server) {
  console.log($auth);
  if (!$auth.loggedIn) {
    return;
  }

  const election_officer = $auth.user.election_officer;
  console.log("Redirect: ", election_officer);
  if (election_officer) {
    return;
  }
};

export default authPlugin;
