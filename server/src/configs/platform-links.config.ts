import configs from ".";

const platformLinks = {
  voting: configs.platform.url + "/election/$electionSlug/",
  election: configs.platform.url + "/e/$electionSlug/",
};

export default platformLinks;
