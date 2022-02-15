import {MigrationInterface, QueryRunner} from "typeorm";

export class myInit1644951956412 implements MigrationInterface {
    name = 'myInit1644951956412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "codes" RENAME COLUMN "create_date_time" TO "createDateTime"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "codes" RENAME COLUMN "createDateTime" TO "create_date_time"`);
    }

}
