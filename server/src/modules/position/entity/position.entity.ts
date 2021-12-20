import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { IsAlpha, IsLowercase, NotContains } from "class-validator";
import { Organization } from "../../organization/entity/organization.entity";
import { Election } from "../../election/entity/election.entity";

@Entity("position")
export class Position extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    default: 1,
  })
  max_selected: number;

  @Column({
    default: 1,
  })
  min_selected: number;

  @Column({
    nullable: true,
  })
  display_order: number;

  @ManyToOne(() => Election, (election) => election.positions)
  election: Election;

  @Column()
  election_id: number;
}
