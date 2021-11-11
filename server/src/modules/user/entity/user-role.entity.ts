import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    length: 200,
  })
  description: string;
}
