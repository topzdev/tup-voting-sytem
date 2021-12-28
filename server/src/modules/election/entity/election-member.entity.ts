import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { Election } from "../../election/entity/election.entity";
import { Voter } from "../../voter/entity/voter.entity";
import { ElectionVote } from "./election-vote.entity";

@Entity("election_member")
export class ElectionMember extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  election_id: number;

  @ManyToOne(() => Election, (election) => election.members)
  election: Election;

  @Column()
  voter_id: number;

  @ManyToOne(() => Voter, (voter) => voter.electionsMember)
  voter: Voter;

  @Column({
    default: true,
  })
  is_allowed: boolean;

  @Column({
    default: false,
  })
  is_voted: boolean;

  @Column({
    default: false,
  })
  archive: boolean;

  @OneToMany(() => ElectionVote, (electionVote) => electionVote.member)
  votes: ElectionVote[];
}
