import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { Candidate } from "../../candidate/entity/candidate.entity";
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

  @Column({
    nullable: true,
  })
  election_id: number;

  @Column({
    nullable: true,
  })
  is_tie_resolved: boolean;

  @Column({
    nullable: true,
  })
  tie_resolved_message: string;

  @OneToMany(() => Candidate, (candidate) => candidate.position)
  candidates: Candidate[];

  @ManyToOne(() => Election, (election) => election.positions)
  election: Election;
}
