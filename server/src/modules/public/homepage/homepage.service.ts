import { getRepository } from "typeorm";
import { Election } from "../../election/entity/election.entity";
import { finalStatusSubquery } from "../../launchpad/launchpad.helper";
import { Party } from "../../party/entity/party.entity";
import { publicElectionWhereQuery } from "./homepage.helpers";

const getElectionsContent = async () => {
  const electionRepository = getRepository(Election);
  let electionBuilder = electionRepository.createQueryBuilder("election");

  electionBuilder = electionBuilder
    .addSelect(finalStatusSubquery(electionBuilder.alias))
    .leftJoinAndSelect("election.logo", "logo")
    .leftJoinAndSelect("election.organization", "organization")
    .where(publicElectionWhereQuery("election"))
    .andWhere("organization.id IS NOT NULL");

  electionBuilder = electionBuilder.orderBy({
    "election.created_at": "DESC",
  });

  const elections = await electionBuilder.getMany();

  return {
    preview: elections.filter((item) => item.final_status === "preview"),
    running: elections.filter((item) => item.final_status === "running"),
    completed: elections.filter((item) => item.final_status === "completed"),
  };
};

const getPartiesContent = async () => {
  const partyRepository = getRepository(Party);

  let builder = partyRepository
    .createQueryBuilder("party")
    .leftJoinAndSelect("party.election", "election")
    .andWhere(publicElectionWhereQuery("election"))
    .leftJoinAndSelect("party.logo", "logo")
    .leftJoinAndSelect("party.cover_photo", "cover");

  builder = builder.orderBy({
    "party.created_at": "DESC",
  });

  const parties = await builder.getMany();

  return parties;
};

const homepageServices = {
  getElectionsContent,
  getPartiesContent,
};

export default homepageServices;
