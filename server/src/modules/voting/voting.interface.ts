import { Candidate } from "../candidate/entity/candidate.entity";
import { Election } from "../election/entity/election.entity";
import { Position } from "../position/entity/position.entity";
import { ElectionVoted } from "./entity/voted.entity";

export type BallotVote = {
  position_id: Position["id"];
  candidate_id: Candidate["id"];
};

export type BallotVotes = {
  election_id: Election["id"];
  votes: BallotVote[];
};

export type BallotOtherInfo = {
  ip: string | any;
  ua: string;
};

export type BallotReceipt = Pick<
  ElectionVoted,
  "created_at" | "id" | "receipt_id" | "ip" | "ua"
> & {
  election_title: Election["title"];
};
