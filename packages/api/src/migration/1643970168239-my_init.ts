import {MigrationInterface, QueryRunner} from "typeorm";

export class myInit1643970168239 implements MigrationInterface {
    name = 'myInit1643970168239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_to_clients_role_enum" AS ENUM('admin', 'user', 'guest')`);
        await queryRunner.query(`CREATE TABLE "users_to_clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."users_to_clients_role_enum" NOT NULL DEFAULT 'guest', "authorization" boolean NOT NULL DEFAULT false, "favorite" boolean NOT NULL DEFAULT false, "create_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, "client_id" uuid, CONSTRAINT "PK_ba3f529bb85f371e6c0e2a51bab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users_to_clients" ADD CONSTRAINT "FK_3c309c4222c5c7d60c833afec29" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_to_clients" ADD CONSTRAINT "FK_cb9df36145f11737646bc404e42" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_to_clients" DROP CONSTRAINT "FK_cb9df36145f11737646bc404e42"`);
        await queryRunner.query(`ALTER TABLE "users_to_clients" DROP CONSTRAINT "FK_3c309c4222c5c7d60c833afec29"`);
        await queryRunner.query(`DROP TABLE "users_to_clients"`);
        await queryRunner.query(`DROP TYPE "public"."users_to_clients_role_enum"`);
    }

}
