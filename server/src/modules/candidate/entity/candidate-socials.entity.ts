import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("candidate_socials")
export class CandidateSocials extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  facebook_url: string;

  @Column({
    nullable: true,
  })
  linkedin_url: string;

  @Column({
    nullable: true,
  })
  twitter_url: string;

  @Column({
    nullable: true,
  })
  website_url: string;

  @Column({
    nullable: true,
  })
  insta_url: string;
}
