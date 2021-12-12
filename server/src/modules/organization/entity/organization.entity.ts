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
    default: false,
  })
  archive: boolean;

  @Column({
    default: "blue",
  })
  themePrimary: string;

  @Column({
    default: "pink",
  })
  themeSecondary: string;

  @OneToOne(() => OrganizationLogo)
  @JoinColumn()
  logo: OrganizationLogo;

  @OneToMany(() => Election, (election) => election.organization)
  elections: Election[];
}
