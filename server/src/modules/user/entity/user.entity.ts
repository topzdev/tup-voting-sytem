import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";

export enum UserRole {
  SUPER_ADMIN = "sadmin",
  ADMIN = "admin",
  WATCHER = "watcher",
  DEV = "dev",
}

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
    type: "enum",
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role: UserRole;
}
