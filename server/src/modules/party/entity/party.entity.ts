import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { IsAlpha, IsLowercase, NotContains } from "class-validator";
import { Election } from "../../election/entity/election.entity";
import { PartyLogo } from "./party-logo.entity";
import { PartyCoverPhoto } from "./party-cover-photo.entity";
import { Candidate } from "../../candidate/entity/candidate.entity";

@Entity("party")
export class Party extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticker: string;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @OneToOne(() => PartyLogo)
  @JoinColumn()
  logo: PartyLogo;

  @OneToOne(() => PartyCoverPhoto)
  @JoinColumn()
  cover_photo: PartyCoverPhoto;

  @Column({ nullable: true })
  election_id: number;

  @ManyToOne(() => Election, (election) => election.party)
  election: Election;

  @OneToMany(() => Candidate, (candidates) => candidates.party)
  candidates: Candidate[];

  @Column({
    default: false,
  })
  archive: boolean;
}
