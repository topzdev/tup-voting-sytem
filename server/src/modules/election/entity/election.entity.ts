import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { Candidate } from "../../candidate/entity/candidate.entity";
import { Organization } from "../../organization/entity/organization.entity";
import { Party } from "../../party/entity/party.entity";
import { Position } from "../../position/entity/position.entity";
import { ElectionLogo } from "./election-logo.entity";
import { ElectionVotes } from "../../voting/entity/votes.entity";
import { Voter } from "../../voter/entity/voter.entity";
import { ElectionVoted } from "../../voting/entity/voted.entity";

export enum ElectionStatusEnum {
  BUILDING = 1,
  RUNNING = 2,
  COMPLETED = 3,
  ARCHIVED = 4,
}

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

  @OneToMany(() => Candidate, (candidate) => candidate.election)
  candidates: Candidate[];

  @OneToMany(() => Party, (party) => party.election)
  party: Party[];

  @OneToMany(() => Voter, (voter) => voter.election)
  voters: Voter[];

  @OneToMany(() => ElectionVotes, (electionVote) => electionVote.election)
  votes: ElectionVotes[];

  @OneToMany(() => ElectionVoted, (electionBallot) => electionBallot.election)
  voted: ElectionVoted[];

  @Column({
    default: false,
  })
  archive: boolean;

  @Column({
    default: false,
  })
  isTallyPublic: boolean;

  @Column({
    default: false,
  })
  isPublic: boolean;

  @Column({
    select: false,
    type: "enum",
    enum: ElectionStatusEnum,
    default: ElectionStatusEnum.BUILDING,
  })
  status: ElectionStatusEnum;

  @Column({
    nullable: true,
    insert: false,
    update: false,
    select: false,
  })
  final_status: string;
}
