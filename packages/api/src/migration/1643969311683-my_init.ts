import {MigrationInterface, QueryRunner} from "typeorm";

export class myInit1643969311683 implements MigrationInterface {
    name = 'myInit1643969311683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_clients" DROP CONSTRAINT "FK_921c33c9df61ff816a4a4184a04"`);
        await queryRunner.query(`ALTER TABLE "users_clients" DROP CONSTRAINT "FK_3891969dfaec3d997c9783ee40e"`);
        await queryRunner.query(`ALTER TABLE "users_clients" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "users_clients" DROP COLUMN "clientId"`);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD "client_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD CONSTRAINT "FK_1e5411dacfbb742eafce27d8c86" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD CONSTRAINT "FK_410f7c875e1b512ef6477a3baab" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_clients" DROP CONSTRAINT "FK_410f7c875e1b512ef6477a3baab"`);
        await queryRunner.query(`ALTER TABLE "users_clients" DROP CONSTRAINT "FK_1e5411dacfbb742eafce27d8c86"`);
        await queryRunner.query(`ALTER TABLE "users_clients" DROP COLUMN "client_id"`);
        await queryRunner.query(`ALTER TABLE "users_clients" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD "clientId" uuid`);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD CONSTRAINT "FK_3891969dfaec3d997c9783ee40e" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD CONSTRAINT "FK_921c33c9df61ff816a4a4184a04" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
