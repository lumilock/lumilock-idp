import {MigrationInterface, QueryRunner} from "typeorm";

export class myInit1643970695932 implements MigrationInterface {
    name = 'myInit1643970695932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."users_clients_role_enum" NOT NULL DEFAULT 'guest', "authorization" boolean NOT NULL DEFAULT false, "favorite" boolean NOT NULL DEFAULT false, "create_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, "client_id" uuid, CONSTRAINT "PK_c03bca848864dcc060fcdc46e7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD CONSTRAINT "FK_1e5411dacfbb742eafce27d8c86" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD CONSTRAINT "FK_410f7c875e1b512ef6477a3baab" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_clients" DROP CONSTRAINT "FK_410f7c875e1b512ef6477a3baab"`);
        await queryRunner.query(`ALTER TABLE "users_clients" DROP CONSTRAINT "FK_1e5411dacfbb742eafce27d8c86"`);
        await queryRunner.query(`DROP TABLE "users_clients"`);
    }

}
