import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { IsAlpha, IsLowercase, NotContains } from "class-validator";
import { Organization } from "../../organization/entity/organization.entity";
import { Position } from "../../position/entity/position.entity";

@Entity("election")
export class Election extends Timestamp {
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

  @ManyToOne(() => Organization, (organization) => organization.elections)
  organization: Organization;

  @OneToMany(() => Position, (position) => position.election)
  positions: Position[];
}
