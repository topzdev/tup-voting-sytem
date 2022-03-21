import { getConnection, getRepository } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import { Candidate } from "../candidate/entity/candidate.entity";
import {
  Election,
  ElectionStatusEnum,
} from "../election/entity/election.entity";
import { finalStatusSubquery } from "../launchpad/launchpad.helper";
import { Position } from "../position/entity/position.entity";
import { Voter } from "../voter/entity/voter.entity";
import { ElectionVoted } from "./entity/voted.entity";
import { ElectionVotes } from "./entity/votes.entity";
import {
  generateBallotError,
  generateReceipt,
  VOTING_MESSAGES,
} from "./voting.helper";
import {
  BallotOtherInfo,
  BallotReceipt,
  BallotVote,
  BallotVotes,
} from "./voting.interface";

const getElectionBySlug = async (_slug: string) => {
  const electionRepository = getRepository(Election);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
    .addSelect(finalStatusSubquery(builder.alias))
    .leftJoinAndSelect("election.organization", "organization")
    .leftJoinAndSelect("election.logo", "logo")
    .leftJoinAndSelect("organization.theme", "organization_theme")
    .where("election.slug = :_slug AND election.status != '1'", { _slug });

  const election = await builder.getOne();

  let error = generateBallotError(election);

  return {
    election: election || null,
    error,
  };
};

const getElectionById = async (_election_id: number) => {
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
  let error = generateBallotError(election);

  return {
    election: election || null,
    error,
  };
};

const getElectionBallot = async (_election_id: number, _voter_id: number) => {
  const positionRepository = getRepository(Position);
  const electionRepository = getRepository(Election);
  const voterRepository = getRepository(Voter);
  const election = await electionRepository.findOne(_election_id);

  let voterBuilder = await voterRepository
    .createQueryBuilder("voter")
    .leftJoinAndSelect("voter.voted", "voted")
    .where("voter.id = :_voter_id", { _voter_id })
    .getOne();

  console.log("Voter Builder", voterBuilder);

  if (voterBuilder.voted) {
    throw new HttpException("BAD_REQUEST", VOTING_MESSAGES.alreadyVoted);
  }

  if (!election)
    throw new HttpException("BAD_REQUEST", VOTING_MESSAGES.electioNotExist);

  let builder = await positionRepository.createQueryBuilder("position");

  builder = builder
    .leftJoinAndSelect("position.candidates", "candidates")
    .leftJoinAndSelect("candidates.profile_photo", "candidates_profile_photo")
    .leftJoinAndSelect("candidates.cover_photo", "candidates_cover_photo")
    .leftJoinAndSelect("candidates.party", "candidates_party")
    .leftJoinAndSelect("candidates_party.logo", "candidates_party_logo")
    .where("position.election_id = :_election_id", { _election_id })
    .orderBy({
      "position.display_order": "ASC",
      "position.created_at": "DESC",
    });

  return await builder.getMany();
};

const getCandidateInfo = async (candidate_id: number) => {
  const candidateRepository = getRepository(Candidate);

  const builder = candidateRepository.createQueryBuilder("candidate");

  const candidate = await builder
    .leftJoinAndSelect("candidate.profile_photo", "profile_photo")
    .leftJoinAndSelect("candidate.cover_photo", "cover_photo")
    .leftJoinAndSelect("candidate.socials", "socials")
    .leftJoinAndSelect("candidate.party", "party")
    .leftJoinAndSelect("party.logo", "party_logo")
    .leftJoinAndSelect("candidate.position", "position")
    .where("candidate.id = :candidate_id", {
      candidate_id,
    })
    .getOne();

  return candidate || null;
};

const submitBallot = async (
  _voter_id: number,
  _ballot: BallotVotes,
  _other_info: BallotOtherInfo
): Promise<BallotReceipt> => {
  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  console.log("Ballot Information: ", _voter_id, _ballot, _other_info);

  if (!_voter_id)
    throw new HttpException(
      "BAD_REQUEST",
      VOTING_MESSAGES.voterIdRequired.title
    );

  if (!_ballot)
    throw new HttpException("BAD_REQUEST", VOTING_MESSAGES.ballotEmpty);

  const election_id = _ballot.election_id;
  const votes = _ballot.votes;

  if (!election_id)
    throw new HttpException(
      "BAD_REQUEST",
      VOTING_MESSAGES.electionIdRequired.title
    );

  await queryRunner.connect();

  let electionbuilder = queryRunner.manager.createQueryBuilder(
    Election,
    "election"
  );

  let votedBuilder = queryRunner.manager.createQueryBuilder(
    ElectionVoted,
    "voted"
  );

  let voterBuilder = queryRunner.manager.createQueryBuilder(Voter, "voter");

  /* Check if voter is a legit voter of that election */
  const voter = await voterBuilder
    .where("voter.id = :voter_id", {
      voter_id: _voter_id,
    })
    .getOne();

  console.log("Voter Information: ", voter);

  if (!voter) {
    throw new HttpException("NOT_FOUND", VOTING_MESSAGES.voterNotFound);
  }

  /* check if election is avaialble */
  const election = await electionbuilder
    .addSelect(finalStatusSubquery(electionbuilder.alias))
    .where("election.id = :election_id", { election_id })
    .getOne();

  console.log("Election Information:", election);

  if (!election) {
    throw new HttpException("NOT_FOUND", VOTING_MESSAGES.electioNotExist);
  }

  if (election.final_status === "completed") {
    throw new HttpException(
      "BAD_REQUEST",
      VOTING_MESSAGES.electionClosed.title
    );
  }

  /* check if voter is voted */
  const voted = await votedBuilder
    .where("voted.voter_id = :_voter_id", {
      _voter_id,
    })
    .getOne();

  console.log("Voterd Information", voted);

  if (voted) {
    throw new HttpException("NOT_FOUND", VOTING_MESSAGES.alreadyVoted);
  }

  /*  -----------------TRANSACTION START HERE------------------- */

  await queryRunner.startTransaction();

  try {
    console.log("Transaction Started");
    /* Start -  Save the vote */
    const finalBallot = votes.map((item) => ({
      voter_id: voter.id,
      election_id: election.id,
      candidate_id: item.candidate_id,
    }));

    console.log("Final Ballot", finalBallot);

    const createBallot = queryRunner.manager.create(ElectionVotes, finalBallot);

    await queryRunner.manager.save(createBallot);
    /* End -  Save the vote */

    let receipt_id = generateReceipt(election);

    /* Start -  save the voter as voted  */
    const voterReceipt = queryRunner.manager.create(ElectionVoted, {
      ip: _other_info.ip,
      ua: _other_info.ua,
      receipt_id: receipt_id,
      election_id: election.id,
      voter_id: voter.id,
    });

    await queryRunner.manager.save(voterReceipt);
    /* End -  save the voter as voted  */

    await queryRunner.commitTransaction();

    console.log("Transaction Ended");
    console.log("Voter Receipt", voterReceipt);
    return { ...voterReceipt, election_title: election.title };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

const votingServices = {
  getElectionBySlug,
  getElectionById,
  getElectionBallot,
  getCandidateInfo,
  submitBallot,
};

export default votingServices;
