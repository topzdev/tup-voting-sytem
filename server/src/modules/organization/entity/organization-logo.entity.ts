import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";

@Entity("organization_logo")
export class OrganizationLogo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  public_id: string;

  @Column()
  url: string;

  @Column({
    default: "cld",
  })
  service: string;
}
