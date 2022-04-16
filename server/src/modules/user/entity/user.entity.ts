import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
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
}
