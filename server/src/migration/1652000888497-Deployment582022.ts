import {MigrationInterface, QueryRunner} from "typeorm";

export class Deployment5820221652000888497 implements MigrationInterface {
    name = 'Deployment5820221652000888497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "election_voted_id_seq" OWNED BY "election_voted"."id"`);
        await queryRunner.query(`ALTER TABLE "election_voted" ALTER COLUMN "id" SET DEFAULT nextval('"election_voted_id_seq"')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "election_voted" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "election_voted_id_seq"`);
    }

}
