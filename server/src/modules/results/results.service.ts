import { getRepository } from "typeorm";
import {
  parseCustomJsonToCsv,
  parseJsontoCsv,
} from "../../helpers/csv-parser.helper";
import { Candidate } from "../candidate/entity/candidate.entity";
import { Election } from "../election/entity/election.entity";
import { Position } from "../position/entity/position.entity";
import { ElectionVoted } from "../voting/entity/voted.entity";
import { ElectionResults } from "./results.interface";

const getElectionResults = async (_election_id: number) => {
  const positionRepository = getRepository(Position);

  let builder = await positionRepository.createQueryBuilder("position");

  builder = builder
    .leftJoinAndSelect("position.candidates", "candidates")
    .leftJoinAndSelect("candidates.profile_photo", "candidates_profile_photo")
    .leftJoinAndSelect("candidates.party", "candidates_party")
    .leftJoinAndSelect("candidates_party.logo", "candidates_party_logo")
    .loadRelationCountAndMap("candidates.votesCount", "candidates.votes")
    .where("position.election_id = :_election_id", { _election_id })
    .orderBy({
      "position.display_order": "ASC",
      "position.created_at": "DESC",
    });

  return (await builder.getMany()) as ElectionResults;
};

const getElectionWinners = async (_election_id: number) => {
  const candidateRepository = getRepository(Candidate);

  let builder = await candidateRepository.createQueryBuilder("candidates");

  builder = builder
    .leftJoinAndSelect("candidates.profile_photo", "profile_photo")
    .leftJoinAndSelect("candidates.party", "party")
    .leftJoinAndSelect("party.logo", "party_logo")
    .leftJoinAndSelect("candidates.votes", "votes")
    .loadRelationCountAndMap("candidates.votesCount", "candidates.votes")
    .where("candidates.election_id = :_election_id", { _election_id });
  // .orderBy("candidates.votesCount", "DESC");

  return await builder.getMany();
};

const downloadElectionResults = async (_election_id: number) => {
  const results = (await getElectionResults(_election_id)) as ElectionResults;

  const data = [];

  results[0];

  results.forEach((position) => {
    // add position title
    data.push([position.title]);

    // add candadidats header
    data.push(["name", "votes"]);

    // add candidates name and vote
    position.candidates.forEach((candidate) => {
      data.push([
        candidate.lastname +
          "," +
          candidate.firstname +
          " " +
          candidate.middlename +
          ".",

        candidate.votesCount,
      ]);
    });

    // add spacing
    data.push([""]);
    data.push([""]);
  });

  return {
    filename: `election-results-${_election_id}-(${Date.now()}).csv`,
    file: await parseCustomJsonToCsv(data),
  };
};

const downloadVoteAudit = async (_election_id: number) => {
  const votedRepository = getRepository(ElectionVoted);

  let builder = await votedRepository.createQueryBuilder("voted");

  builder = builder
    .leftJoinAndSelect("voted.voter", "voter")
    .where("voted.election_id = :_election_id", {
      _election_id,
    });

  const data = [];

  const voted = await builder.getMany();

  voted.forEach((item) => {
    data.push({
      name: `${item.voter.lastname}, ${item.voter.firstname}`,
      voter_id: item.voter.username,
      receipt_id: item.receipt_id,
      ip: item.ip,
      ua: item.ua,
      voted_date: item.created_at,
    });
  });

  const fields = [
    { label: "Name", value: "name" },
    { label: "Voter Identified", value: "voter_id" },
    { label: "Ballot Receipt", value: "receipt_id" },
    { label: "IP Address", value: "ip" },
    { label: "User Agent", value: "ua" },
    { label: "Vote Date/Time", value: "voted_date" },
  ];

  return {
    filename: `vote-audit-${_election_id}-(${Date.now()}).csv`,
    file: await parseJsontoCsv(fields, data),
  };
};

const resultsServices = {
  getElectionResults,
  getElectionWinners,
  downloadElectionResults,
  downloadVoteAudit,
};

export default resultsServices;
