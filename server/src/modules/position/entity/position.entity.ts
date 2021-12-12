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

  @Column({ type: "timestamptz" })
  start_date: Date;

  @Column({ type: "timestamptz" })
  close_date: Date;

  @ManyToOne(() => Election, (election) => election.positions)
  election: Election;
}
