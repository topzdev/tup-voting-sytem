import configs from ".";

const platformLinks = {
  voting: (election_slug: string) =>
    configs.platform.url + `/vote/${election_slug}`,
  election: (election_slug: string) =>
    configs.platform.url + `/election/${election_slug}/`,
  preRegister: (election_slug: string) =>
    configs.platform.url + `/pre-register?election=${election_slug}`,
};

export const platformShortLinks = {
  voting: (election_id: number) =>
    configs.platform.shortUrl + `/${election_id}/`,
};

export default platformLinks;
