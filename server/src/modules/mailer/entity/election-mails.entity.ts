import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Timestamp } from "../../../entity/timestamp.inherit";
import { Election } from "../../election/entity/election.entity";

@Entity("election_mails")
export class ElectionMails extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  election_id: number;

  @ManyToOne(() => Election, (elec) => elec.id)
  election: Election;

  @Column({
    default: null,
    nullable: true,
  })
  credentials_email_sent: Date;

  @Column({
    default: null,
    nullable: true,
  })
  election_will_start_sent: Date;

  @Column({
    default: null,
    nullable: true,
  })
  election_ended_email_sent: Date;
}
