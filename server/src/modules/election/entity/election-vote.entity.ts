import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { Candidate } from "../../candidate/entity/candidate.entity";
import { Election } from "../../election/entity/election.entity";
import { ElectionMember } from "./election-member.entity";

@Entity("election_vote")
export class ElectionVote extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  member_id: number;

  @ManyToOne(() => ElectionMember, (electionMember) => electionMember.votes)
  member: ElectionMember;

  @Column()
  candidate_id: number;

  @ManyToOne(() => Candidate, (candidate) => candidate.votes)
  candidate: Candidate;

  @Column()
  election_id: number;

  @ManyToOne(() => Election, (election) => election.votes)
  election: Election;
}
