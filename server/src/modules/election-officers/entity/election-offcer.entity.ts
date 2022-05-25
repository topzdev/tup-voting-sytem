import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { Organization } from "../../organization/entity/organization.entity";
import { User } from "../../user/entity/user.entity";

@Entity("election_officer")
export class ElectionOfficer extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.election_officer)
  user: User;

  @Column()
  organization_id: number;

  @OneToOne(() => Organization)
  organization: Organization;
}
