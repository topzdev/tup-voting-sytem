import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

export abstract class Timestamp {
  @CreateDateColumn()
  created_at;

  @UpdateDateColumn()
  updated_at;

  @DeleteDateColumn()
  deleted_at;
}
