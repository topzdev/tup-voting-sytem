import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { ElectionMember } from "../../election/entity/election-member.entity";
import { Organization } from "../../organization/entity/organization.entity";

@Entity("voter")
export class Voter extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({
    unique: true,
  })
  voter_id: string;

  @Column({
    unique: true,
  })
  email_address: string;

  @Column()
  pin: string;

  @Column({ nullable: true })
  organization_id: number;

  @ManyToOne(() => Organization, (organization) => organization.voters)
  organization: Organization;

  @OneToMany(() => ElectionMember, (electionMember) => electionMember.voter)
  electionsMember: ElectionMember[];

  @Column({
    default: false,
  })
  archive: boolean;
}
