import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";

@Entity("organization-theme")
export class OrganizationTheme extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: "blue",
  })
  primary: string;

  @Column({
    default: "pink",
  })
  secondary: string;
}
