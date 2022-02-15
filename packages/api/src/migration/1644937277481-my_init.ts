import {MigrationInterface, QueryRunner} from "typeorm";

export class myInit1644937277481 implements MigrationInterface {
    name = 'myInit1644937277481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."codes_scope_enum" AS ENUM('openid')`);
        await queryRunner.query(`ALTER TABLE "codes" ADD "scope" "public"."codes_scope_enum" NOT NULL DEFAULT 'openid'`);
        await queryRunner.query(`ALTER TABLE "codes" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "codes" DROP CONSTRAINT "FK_6f6dd484ab53c1014346f191338"`);
        await queryRunner.query(`ALTER TABLE "codes" ALTER COLUMN "client_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "codes" ADD CONSTRAINT "FK_6f6dd484ab53c1014346f191338" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "codes" ADD CONSTRAINT "FK_4faaad086955b535c6fe27dbdf2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "codes" DROP CONSTRAINT "FK_4faaad086955b535c6fe27dbdf2"`);
        await queryRunner.query(`ALTER TABLE "codes" DROP CONSTRAINT "FK_6f6dd484ab53c1014346f191338"`);
        await queryRunner.query(`ALTER TABLE "codes" ALTER COLUMN "client_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "codes" ADD CONSTRAINT "FK_6f6dd484ab53c1014346f191338" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "codes" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "codes" DROP COLUMN "scope"`);
        await queryRunner.query(`DROP TYPE "public"."codes_scope_enum"`);
    }

}
