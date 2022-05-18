import platformLinks, {
  platformShortLinks,
} from "../../configs/platform-links.config";
import { Election } from "../election/entity/election.entity";
import { ElectionUrls } from "./overview.interface";

const generateElectionUrls = (election: Election): ElectionUrls => {
  const votingLongUrl = platformLinks.voting(election.slug);
  const electionUrl = platformLinks.election(election.slug);
  const preRegisterUrl = election.allow_pre_register
    ? platformLinks.preRegister(election.slug)
    : null;
  const votingShortUrl = platformShortLinks.voting(election.id);

  return {
    votingLongUrl,
    preRegisterUrl,
    votingShortUrl,
    electionUrl,
  };
};

const overviewHelpers = {
  generateElectionUrls,
};

export default overviewHelpers;
