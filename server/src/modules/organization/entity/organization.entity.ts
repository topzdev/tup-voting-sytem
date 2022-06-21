import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { OrganizationLogo } from "./organization-logo.entity";
import { IsAlpha, IsLowercase, NotContains } from "class-validator";
import { Election } from "../../election/entity/election.entity";
import { OrganizationTheme } from "./organization-theme.entity";
import { Voter } from "../../voter/entity/voter.entity";
import { ElectionOfficer } from "../../election-officers/entity/election-offcer.entity";

@Entity("organization")
export class Organization extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  slug: string;

  @Column()
  ticker: string;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    default: "",
    select: false,
  })
  terms_and_condition: string;

  @Column({
    default: () => "CURRENT_TIMESTAMP",
    select: false,
    type: "timestamptz",
  })
  terms_and_condition_last_update: Date;

  @OneToOne(() => OrganizationTheme)
  @JoinColumn()
  theme: OrganizationTheme;

  @OneToOne(() => OrganizationLogo)
  @JoinColumn()
  logo: OrganizationLogo;

  @OneToMany(() => Election, (election) => election.organization)
  elections: Election[];

  @Column({
    default: false,
  })
  archive: boolean;
}
