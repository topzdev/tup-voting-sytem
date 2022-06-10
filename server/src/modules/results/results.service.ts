import { getManager, getRepository } from "typeorm";
import {
  parseCustomJsonToCsv,
  parseJsontoCsv,
} from "../../helpers/csv-parser.helper";
import { HttpException } from "../../helpers/errors/http.exception";
import { Candidate } from "../candidate/entity/candidate.entity";
import { ElectionOfficer } from "../election-officers/entity/election-offcer.entity";
import { Election } from "../election/entity/election.entity";
import { finalStatusSubquery } from "../launchpad/launchpad.helper";
import { Position } from "../position/entity/position.entity";
import { Voter } from "../voter/entity/voter.entity";
import { ElectionVoted } from "../voting/entity/voted.entity";
import resultHelpers from "./results.helper";
import {
  CandidateTieResult,
  ElectionResult,
  InitialPosition,
  ResolveTieDTO,
  ResultCandidate,
  ResultPosition,
  ResultPositionsWithWinner,
} from "./results.interface";

const getElectionResults = async (_election_id: Election["id"]) => {
  if (!_election_id)
    throw new HttpException("BAD_REQUEST", "Election ID is required");
  const positionRepository = getRepository(Position);
  const electionRepository = getRepository(Election);

  let electionBuilder = electionRepository.createQueryBuilder("election");

  electionRepository.createQueryBuilder("election");

  electionBuilder = electionBuilder
    .addSelect(finalStatusSubquery(electionBuilder.alias))
    .loadRelationCountAndMap("election.votersCount", "election.voters")
    .loadRelationCountAndMap("election.votedCount", "election.voted")
    .where("election.id = :_election_id", { _election_id });

  const election = await electionBuilder.getOne();

  if (!election) throw new HttpException("NOT_FOUND", "Election not found");

  let positionBuilder = await positionRepository.createQueryBuilder("position");

  positionBuilder = positionBuilder
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

  let initPositions = (await positionBuilder.getMany()) as InitialPosition[];

  console.log(election);

  let result: ElectionResult;

  const other_info = {
    votersCount: (election as any).votersCount,
    votedCount: (election as any).votedCount,
  };

  if (
    election.final_status === "completed" ||
    election.final_status === "archived"
  ) {
    const finalPositions = resultHelpers.getResultPositionsWithWinners(
      initPositions
    ) as any;
    const issues = resultHelpers.generateIssues(finalPositions);

    result = {
      positions: finalPositions,
      issues,
      other_info,
    };
  } else {
    const finalPositions = resultHelpers.getResultPosition(initPositions);

    result = {
      positions: finalPositions,
      other_info,
    };
  }

  return result;
};

const getElectionWinners = async (_election_id: Election["id"]) => {
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

const downloadElectionResults = async (_election_id: Election["id"]) => {
  const results = await getElectionResults(_election_id);
  const election = await getRepository(Election)
    .createQueryBuilder("election")
    .leftJoinAndSelect("election.organization", "organization")
    .leftJoinAndSelect("election.election_officers", "election_officers")
    .leftJoinAndSelect("election_officers.user", "election_officers_user")
    .where("election.id = :election_id", {
      election_id: _election_id,
    })
    .getOne();

  const divider = "#########";

  const data = [];

  if (!election) throw new HttpException("NOT_FOUND", "Election not found");

  data.push(["Title: " + election.title]);
  data.push(["Description: " + election.description]);
  data.push([""]);
  data.push([""]);

  results.positions.forEach((position) => {
    // add position title
    data.push([position.title]);

    const winners = (position as ResultPositionsWithWinner).winners;

    if (winners && winners.length) {
      data.push(["Winner(s)"]);

      data.push(["#", "name", "votes", "vote %"]);

      winners.forEach(function (item, idx) {
        data.push([
          idx + 1,
          item.candidateName,
          item.votesCount,
          item.votePercentage,
        ]);
      });
    }

    data.push([""]);
    data.push(["Candiddate(s)"]);

    // add candadidats header
    data.push(["#", "name", "votes", "votes %"]);

    // add candidates name and vote
    let candidates: ResultCandidate[] = [];

    console.log(position.candidates);

    position.candidates.forEach(function (item) {
      let tieItem = item as any;
      // if (tieItem.tie) {
      //   candidates = [
      //     ...candidates,
      //     ...tieItem.candidates.map((item) => ({ ...item, tie: true })),
      //   ];
      // } else {
      // }
      candidates = [...candidates, item as ResultCandidate];
    });

    candidates.forEach((candidate, idx) => {
      data.push([
        idx + 1,
        candidate.candidateName,
        candidate.votesCount,
        candidate.votePercentage + "%",
      ]);
    });

    // add spacing
    data.push([""]);
    data.push([""]);
  });

  const election_officers = election.election_officers;
  console.log(election_officers);

  if (election_officers && election_officers.length) {
    data.push(["Assigned Election Officers:"]);
    data.push([""]);

    election_officers.forEach((item) => {
      if (item.user) {
        data.push([
          ` ${item.user.lastname},${item.user.firstname} (${item.user.email_address})`,
        ]);
      }
    });
  }

  return {
    filename: `election-results-${_election_id}-(${Date.now()}).csv`,
    file: await parseCustomJsonToCsv(data),
  };
};

const resolveTie = async (dto: ResolveTieDTO) => {
  if (!dto.election_id || !dto.position_id)
    throw new HttpException(
      "BAD_REQUEST",
      "Election and Position ID is required"
    );

  if (!dto.candidatesWithPos.length) {
    throw new HttpException(
      "BAD_REQUEST",
      "Candidates with Position is required"
    );
  }

  const entityManager = getManager();

  let dataValues = [];
  dto.candidatesWithPos.forEach((item) => {
    dataValues.push(`(${item.candidate_id}, ${item.pos})`);
  });

  console.log("Datavalues", dataValues);

  const rawQuery = await entityManager.query(`
  UPDATE 
  candidate AS candidate
  SET
  pos = data.col_pos
  FROM 
  (values ${dataValues.join(",")}) 
  AS 
  data(col_candidate_id, col_pos) 
  WHERE 
  candidate.id = data.col_candidate_id 
  AND 
  candidate.position_id = ${dto.position_id}
  AND
  election_id = ${dto.election_id}; 
  `);

  const positionRepository = getRepository(Position);
  const positionBuilder = positionRepository.createQueryBuilder("position");

  const position = await positionBuilder
    .update()
    .set({
      is_tie_resolved: true,
      tie_resolved_message: dto.tie_resolved_message,
    })
    .where("position.id = :position_id", { position_id: dto.position_id })
    .execute();

  console.log("Raw Query Result", rawQuery);

  return true;
};

const resetTie = async (position_id: Position["id"]) => {
  const candidateRepository = getRepository(Candidate);

  const candidateBuilder = candidateRepository.createQueryBuilder("candidate");

  const candidate = await candidateBuilder
    .update()
    .set({
      pos: null,
    })
    .where("position_id = :position_id", { position_id })
    .execute();

  console.log(candidate);

  const positionRepository = getRepository(Position);
  const positionBuilder = positionRepository.createQueryBuilder("position");

  const position = await positionBuilder
    .update()
    .set({
      is_tie_resolved: null,
      tie_resolved_message: null,
    })
    .where("position.id = :position_id", { position_id: position_id })
    .execute();

  return true;
};

const downloadVoteAudit = async (_election_id: Election["id"]) => {
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
      // name: `${item.voter.lastname}, ${item.voter.firstname}`,
      voter_id: item.voter.username,
      receipt_id: item.receipt_id,
      ip: item.ip,
      ua: item.ua,
      voted_date: item.created_at,
    });
  });

  const fields = [
    // { label: "Name", value: "name" },
    { label: "Voter Id", value: "voter_id" },
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

const publishResult = async (_election_id: Election["id"]) => {
  if (!_election_id) {
    throw new HttpException("BAD_REQUEST", "Election id is required");
  }
  const electionRepository = getRepository(Election);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
    .select(["election.is_tally_public"])
    .where("election.id = :_election_id", {
      _election_id,
    });

  const election = await builder.getOne();

  if (!election) {
    throw new HttpException("NOT_FOUND", "Election not found");
  }

  const savedElection = await builder
    .update()
    .set({
      is_tally_public: true,
    })
    .where("election.id = :_election_id", { _election_id })
    .execute();

  return true;
};

const unPublishResult = async (_election_id: Election["id"]) => {
  if (!_election_id) {
    throw new HttpException("BAD_REQUEST", "Election id is required");
  }
  const electionRepository = getRepository(Election);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
    .select(["election.is_tally_public"])
    .where("election.id = :_election_id", {
      _election_id,
    });

  const election = await builder.getOne();

  if (!election) {
    throw new HttpException("NOT_FOUND", "Election not found");
  }

  const savedElection = await builder
    .update()
    .set({
      is_tally_public: false,
    })
    .where("election.id = :_election_id", { _election_id })
    .execute();

  return true;
};

const resultsServices = {
  getElectionResults,
  getElectionWinners,
  downloadElectionResults,
  downloadVoteAudit,
  resolveTie,
  resetTie,
  publishResult,
  unPublishResult,
};

export default resultsServices;
