import configs from ".";

const platformLinks = {
  voting: configs.platform.url + "/vote/$electionSlug/",
  election: configs.platform.url + "/election/$electionSlug/",
  preRegister: configs.platform.url + "/pre-register?election=$electionSlug",
};

export const platformShortLinks = {
  voting: configs.platform.shortUrl + "/$electionId/",
};

export default platformLinks;
