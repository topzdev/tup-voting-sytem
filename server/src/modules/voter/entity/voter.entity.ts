import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { Election } from "../../election/entity/election.entity";
import { Organization } from "../../organization/entity/organization.entity";
import { ElectionVote } from "../../election/entity/election-vote.entity";

@Entity("voter")
@Unique(["username", "email_address", "election_id"])
export class Voter extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  username: string;

  @Column()
  email_address: string;

  @Column()
  pin: string;

  @Column({
    default: true,
  })
  is_allowed: boolean;

  @Column({ nullable: true })
  election_id: number;

  @ManyToOne(() => Election, (election) => election.voters)
  election: Election;

  @Column({
    default: false,
  })
  archive: boolean;
}
