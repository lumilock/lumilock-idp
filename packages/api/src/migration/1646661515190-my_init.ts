import {MigrationInterface, QueryRunner} from "typeorm";

export class myInit1646661515190 implements MigrationInterface {
    name = 'myInit1646661515190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_clients_role_enum" AS ENUM('admin', 'user', 'guest')`);
        await queryRunner.query(`CREATE TABLE "users_clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."users_clients_role_enum" NOT NULL DEFAULT 'guest', "authorization" boolean NOT NULL DEFAULT false, "favorite" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, "client_id" uuid NOT NULL, "create_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_04e047a4375832031896bb4d59d" UNIQUE ("user_id", "client_id"), CONSTRAINT "PK_c03bca848864dcc060fcdc46e7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."clients_application_type_enum" AS ENUM('web', 'native')`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "is_archived" boolean NOT NULL DEFAULT false, "create_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "client_name" character varying(200) NOT NULL, "secret" character varying(200) NOT NULL, "hide" boolean NOT NULL DEFAULT true, "redirect_uris" text NOT NULL, "application_type" "public"."clients_application_type_enum" NOT NULL DEFAULT 'web', "logo_uri" character varying(300), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."codes_scope_enum" AS ENUM('openid')`);
        await queryRunner.query(`CREATE TABLE "codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(200) NOT NULL, "scope" "public"."codes_scope_enum" NOT NULL DEFAULT 'openid', "client_id" uuid NOT NULL, "user_id" uuid NOT NULL, "create_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9b85c624e2d705f4e8a9b64dbf4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('male', 'female', 'other')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "is_archived" boolean NOT NULL DEFAULT false, "create_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "login" character varying(300) NOT NULL, "password" character varying(200) NOT NULL, "name" character varying(100) NOT NULL, "given_name" character varying(100) NOT NULL, "family_name" character varying(100) NOT NULL, "middle_name" character varying(100), "nickname" character varying(100), "preferred_username" character varying(100), "profile" character varying(300), "picture" character varying(300), "website" character varying(300), "email" character varying(195), "email_verified" boolean NOT NULL DEFAULT false, "gender" "public"."users_gender_enum" NOT NULL DEFAULT 'other', "birthdate" date, "zoneinfo" character varying(100) NOT NULL DEFAULT 'UTC', "locale" character varying(20) NOT NULL DEFAULT 'fr-FR', "phone_number" character varying(50), "phone_number_verified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "is_archived" boolean NOT NULL DEFAULT false, "create_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed_date_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "formatted" character varying(300) NOT NULL, "street_address" character varying(255) NOT NULL, "locality" character varying(195) NOT NULL, "region" character varying(195) NOT NULL, "postal_code" character varying(100) NOT NULL, "country" character varying(100) NOT NULL, "user_id" uuid, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_sessions" ("sid" character varying NOT NULL, "sess" text NOT NULL, "expire" TIMESTAMP(6) NOT NULL, CONSTRAINT "PK_5d74a33a1f439b45f64c4e5fcfe" PRIMARY KEY ("sid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_session_expire" ON "user_sessions" ("expire") `);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD CONSTRAINT "FK_1e5411dacfbb742eafce27d8c86" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_clients" ADD CONSTRAINT "FK_410f7c875e1b512ef6477a3baab" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "codes" ADD CONSTRAINT "FK_6f6dd484ab53c1014346f191338" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "codes" ADD CONSTRAINT "FK_4faaad086955b535c6fe27dbdf2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023"`);
        await queryRunner.query(`ALTER TABLE "codes" DROP CONSTRAINT "FK_4faaad086955b535c6fe27dbdf2"`);
        await queryRunner.query(`ALTER TABLE "codes" DROP CONSTRAINT "FK_6f6dd484ab53c1014346f191338"`);
        await queryRunner.query(`ALTER TABLE "users_clients" DROP CONSTRAINT "FK_410f7c875e1b512ef6477a3baab"`);
        await queryRunner.query(`ALTER TABLE "users_clients" DROP CONSTRAINT "FK_1e5411dacfbb742eafce27d8c86"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_session_expire"`);
        await queryRunner.query(`DROP TABLE "user_sessions"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
        await queryRunner.query(`DROP TABLE "codes"`);
        await queryRunner.query(`DROP TYPE "public"."codes_scope_enum"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TYPE "public"."clients_application_type_enum"`);
        await queryRunner.query(`DROP TABLE "users_clients"`);
        await queryRunner.query(`DROP TYPE "public"."users_clients_role_enum"`);
    }

}
