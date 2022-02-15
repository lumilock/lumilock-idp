import {MigrationInterface, QueryRunner} from "typeorm";

export class myInit1644952015299 implements MigrationInterface {
    name = 'myInit1644952015299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "codes" RENAME COLUMN "createDateTime" TO "create_date_time"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "codes" RENAME COLUMN "create_date_time" TO "createDateTime"`);
    }

}
