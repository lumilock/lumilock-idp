import {MigrationInterface, QueryRunner} from "typeorm";

export class myInit1644338301444 implements MigrationInterface {
    name = 'myInit1644338301444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(200) NOT NULL, "create_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "client_id" uuid, CONSTRAINT "PK_9b85c624e2d705f4e8a9b64dbf4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "is_archived" boolean NOT NULL DEFAULT false, "create_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "login" character varying(300) NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "email" character varying(195), "profile_picture" character varying(300), "password" character varying(200) NOT NULL, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_clients_role_enum" AS ENUM('admin', 'user', 'guest')`);
        await queryRunner.query(`CREATE TABLE "users_clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."users_clients_role_enum" NOT NULL DEFAULT 'guest', "authorization" boolean NOT NULL DEFAULT false, "favorite" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, "client_id" uuid NOT NULL, "create_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_04e047a4375832031896bb4d59d" UNIQUE ("user_id", "client_id"), CONSTRAINT "PK_c03bca848864dcc060fcdc46e7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "is_archived" boolean NOT NULL DEFAULT false, "create_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(200) NOT NULL, "secret" character varying(200) NOT NULL, "callback_url" character varying(255) NOT NULL, "client_picture" character varying(300), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(300), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedBy" character varying(300), "internalComment" character varying(300), "name" character varying(300) NOT NULL, "description" character varying(300) NOT NULL, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "codes" ADD CONSTRAINT "FK_6f6dd484ab53c1014346f191338" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD CONSTRAINT "FK_1e5411dacfbb742eafce27d8c86" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD CONSTRAINT "FK_410f7c875e1b512ef6477a3baab" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_clients" DROP CONSTRAINT "FK_410f7c875e1b512ef6477a3baab"`);
        await queryRunner.query(`ALTER TABLE "users_clients" DROP CONSTRAINT "FK_1e5411dacfbb742eafce27d8c86"`);
        await queryRunner.query(`ALTER TABLE "codes" DROP CONSTRAINT "FK_6f6dd484ab53c1014346f191338"`);
        await queryRunner.query(`DROP TABLE "item"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "users_clients"`);
        await queryRunner.query(`DROP TYPE "public"."users_clients_role_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "codes"`);
    }

}