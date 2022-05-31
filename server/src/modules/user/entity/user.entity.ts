import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { ElectionOfficer } from "../../election-officers/entity/election-offcer.entity";
import { UserRole } from "../user.inteface";

@Entity("user")
export class User extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  username: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    default: "",
  })
  email_address: string;

  @Column({
    default: false,
  })
  disabled: boolean;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role: UserRole;

  @Column({
    type: "timestamptz",
    nullable: true,
  })
  failed_login_time: Date;

  @Column({
    type: "timestamptz",
    nullable: true,
  })
  reactivate_time: Date;

  @Column({
    default: 0,
  })
  failed_login_attempts: number;

  @Column({
    type: "timestamptz",
    nullable: true,
  })
  last_loggedin_time: Date;

  @Column({
    nullable: true,
  })
  login_otp: string;

  @Column({
    type: "timestamptz",
    nullable: true,
  })
  last_login_otp_time: Date;

  @Column({
    type: "timestamptz",
    nullable: true,
  })
  last_resend_otp_time: Date;

  @OneToOne(() => ElectionOfficer, (electionOfficer) => electionOfficer.user)
  @JoinColumn()
  election_officer: ElectionOfficer;
}
