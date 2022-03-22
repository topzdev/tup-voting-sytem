import { getRepository } from "typeorm";
import { Election } from "../election/entity/election.entity";
import { finalStatusSubquery } from "../launchpad/launchpad.helper";

const getElectionResults = async (_election_id: number) => {
  const electionRepository = getRepository(Election);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
    .addSelect(finalStatusSubquery(builder.alias))
    .leftJoinAndSelect("election.organization", "organization")
    .leftJoinAndSelect("election.logo", "logo")
    .leftJoinAndSelect("organization.theme", "organization_theme")
    .where("election.id = :_election_id AND election.status != '1'", {
      _election_id,
    });

  const election = await builder.getOne();

  // check if elexction exist or is in building status
  return {
    election: election || null,
  };
};

const getElectionWinners = async (_election_id: number) => {};

const downloadResults = async (_election_id: number) => {};

const resultsServices = {
  getElectionResults,
};

export default resultsServices;
