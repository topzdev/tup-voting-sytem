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
import { ElectionLogo } from "./election-logo.entity";
import { Candidate } from "../../candidate/entity/candidate.entity";

@Entity("election")
export class Election extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  slug: string;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({ type: "timestamptz" })
  start_date: Date;

  @Column({ type: "timestamptz" })
  close_date: Date;

  @OneToOne(() => ElectionLogo)
  @JoinColumn()
  logo: ElectionLogo;

  @Column({ nullable: true })
  organization_id: number;

  @ManyToOne(() => Organization, (organization) => organization.elections)
  organization: Organization;

  @OneToMany(() => Position, (position) => position.election)
  positions: Position[];

  @OneToMany(() => Position, (position) => position.election)
  candidates: Candidate[];

  @Column({
    default: false,
  })
  archive: boolean;
}
