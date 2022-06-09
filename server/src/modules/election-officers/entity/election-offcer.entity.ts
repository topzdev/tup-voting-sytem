import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { Election } from "../../election/entity/election.entity";
import { Organization } from "../../organization/entity/organization.entity";
import { User } from "../../user/entity/user.entity";

@Entity("election_officer")
export class ElectionOfficer extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.election_officer)
  user: User;

  @Column({
    nullable: true,
  })
  election_id: number;

  @ManyToOne(() => Election, (election) => election.election_officers)
  election: Election;
}
