import {MigrationInterface, QueryRunner} from "typeorm";

export class myInit1643738362491 implements MigrationInterface {
    name = 'myInit1643738362491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "codes" DROP CONSTRAINT "FK_7eb26c952877f6027e5bec41941"`);
        await queryRunner.query(`ALTER TABLE "codes" RENAME COLUMN "clientId" TO "client_id"`);
        await queryRunner.query(`ALTER TABLE "codes" ADD CONSTRAINT "FK_6f6dd484ab53c1014346f191338" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "codes" DROP CONSTRAINT "FK_6f6dd484ab53c1014346f191338"`);
        await queryRunner.query(`ALTER TABLE "codes" RENAME COLUMN "client_id" TO "clientId"`);
        await queryRunner.query(`ALTER TABLE "codes" ADD CONSTRAINT "FK_7eb26c952877f6027e5bec41941" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
