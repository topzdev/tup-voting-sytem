import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { Election } from "../../election/entity/election.entity";
import { ElectionVoted } from "../../voting/entity/voted.entity";
import voterValidator from "../voter.validator";

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

  @Column({
    default: false,
  })
  is_pre_register: boolean;

  @Column({
    default: "",
  })
  google_id: string;

  @Column({ nullable: true })
  election_id: number;

  @ManyToOne(() => Election, (election) => election.voters)
  election: Election;

  @OneToOne(() => ElectionVoted, (voted) => voted.voter)
  voted: ElectionVoted;

  @Column({
    default: false,
  })
  archive: boolean;
}
