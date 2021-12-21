import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { Election } from "../../election/entity/election.entity";
import { Party } from "../../party/entity/party.entity";
import { Position } from "../../position/entity/position.entity";
import { CandidateCoverPhoto } from "./candidate-cover-photo.entity";
import { CandidateProfilePhoto } from "./candidate-profile-photo.entity";
import { CandidateSocials } from "./candidate-socials.entity";

@Entity("candidate")
export class Candidate extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({
    nullable: true,
  })
  middlename: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  platform: string;

  @Column({ nullable: true })
  party_id: number;

  @OneToOne(() => Party)
  @JoinColumn()
  party: Party;

  @Column({ nullable: true })
  position_id: number;

  @OneToOne(() => Position)
  @JoinColumn()
  position: Position;

  @OneToOne(() => CandidateSocials)
  @JoinColumn()
  socials: CandidateSocials;

  @Column({ nullable: true })
  election_id: number;

  @ManyToOne(() => Election, (election) => election.candidates)
  election: Election;

  @OneToOne(() => CandidateProfilePhoto)
  @JoinColumn()
  profile_photo: CandidateProfilePhoto;

  @Column({
    default: false,
  })
  use_party_cover_photo: boolean;

  @OneToOne(() => CandidateCoverPhoto)
  @JoinColumn()
  cover_photo: CandidateCoverPhoto;

  @Column({
    default: false,
  })
  archive: boolean;
}
