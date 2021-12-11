import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { OrganizationLogo } from "./organization-logo.entity";
import { IsAlpha, IsLowercase, NotContains } from "class-validator";

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
}
