import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
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
  first_name: string;

  @Column()
  last_name: string;

  @Column({
    nullable: true,
  })
  middle_name: string;

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
