import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("candidate_cover_photo")
export class CandidateCoverPhoto extends BaseEntity {
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
