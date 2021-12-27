import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Election } from "../../election/entity/election.entity";

@Entity("position")
export class Position extends BaseEntity {
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

  @ManyToOne(() => Election, (election) => election.positions)
  election: Election;
}
