import {MigrationInterface, QueryRunner} from "typeorm";

export class myInit1643969083254 implements MigrationInterface {
    name = 'myInit1643969083254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_clients_role_enum" AS ENUM('admin', 'user', 'guest')`);
        await queryRunner.query(`CREATE TABLE "users_clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."users_clients_role_enum" NOT NULL DEFAULT 'guest', "authorization" boolean NOT NULL DEFAULT false, "favorite" boolean NOT NULL DEFAULT false, "create_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, "clientId" uuid, CONSTRAINT "PK_c03bca848864dcc060fcdc46e7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD CONSTRAINT "FK_921c33c9df61ff816a4a4184a04" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD CONSTRAINT "FK_3891969dfaec3d997c9783ee40e" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_clients" DROP CONSTRAINT "FK_3891969dfaec3d997c9783ee40e"`);
        await queryRunner.query(`ALTER TABLE "users_clients" DROP CONSTRAINT "FK_921c33c9df61ff816a4a4184a04"`);
        await queryRunner.query(`DROP TABLE "users_clients"`);
        await queryRunner.query(`DROP TYPE "public"."users_clients_role_enum"`);
    }

}
