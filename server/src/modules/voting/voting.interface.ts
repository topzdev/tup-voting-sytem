import { Candidate } from "../candidate/entity/candidate.entity";
import { Election } from "../election/entity/election.entity";
import { Position } from "../position/entity/position.entity";

export type BallotVote = {
  position_id: Position["id"];
  candidates_id: Candidate["id"];
};

export type Ballot = {
  election_id: Election["id"];
  votes: BallotVote[];
};

export type BallotOtherInfo = {
  ip: string | any;
  ua: string;
};
