import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { Candidate } from "../../candidate/entity/candidate.entity";
import { Election } from "../../election/entity/election.entity";
import { Voter } from "../../voter/entity/voter.entity";

@Entity("election_voted")
export class ElectionVoted extends Timestamp {
  @PrimaryGeneratedColumn("identity")
  id: number;

  @Column()
  ip: string;

  @Column()
  ua: string;

  @Column()
  receipt_id: string;

  @Column()
  voter_id: number;

  @OneToOne(() => Voter)
  @JoinColumn()
  voter: Voter;

  @Column()
  election_id: number;

  @ManyToOne(() => Election, (election) => election.votes)
  election: Election;
}
