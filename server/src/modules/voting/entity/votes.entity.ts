import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { Candidate } from "../../candidate/entity/candidate.entity";
import { Election } from "../../election/entity/election.entity";
import { Voter } from "../../voter/entity/voter.entity";

@Entity("election_votes")
export class ElectionVotes extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  voter_id: number;

  @ManyToOne(() => Voter)
  @JoinColumn([{ name: "voter_id", referencedColumnName: "id" }])
  voter: Voter;

  @Column()
  candidate_id: number;

  @ManyToOne(() => Candidate, (candidate) => candidate.votes)
  candidate: Candidate;

  @Column()
  election_id: number;

  @ManyToOne(() => Election, (election) => election.votes)
  election: Election;
}
