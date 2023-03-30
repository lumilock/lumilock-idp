// src/config/config.service.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public isNotLocal() {
    const env = this.getValue('ENV', false);
    return env != 'LOCAL';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),

      entities: [
        this.isProduction()
          ? 'dist/**/*.entity{.ts,.js}'
          : '**/*.entity{.ts,.js}',
      ],

      migrationsTableName: 'migration',

      migrations: [
        this.isProduction() ? 'dist/migration/*.ts' : 'src/migration/*.ts',
      ],

      cli: {
        migrationsDir: this.isProduction() ? 'dist/migration' : 'src/migration',
      },

      ssl: this.getValue('POSTGRES_SSL').toLowerCase?.() === 'true',
    };
  }

  // Function to configure the SMTP mail serveur
  // here an exemple with GMAIL
  public getMailerConfig() {
    // https://alexb72.medium.com/how-to-send-emails-using-a-nodemailer-gmail-and-oauth2-fe19d66451f9
    return {
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: this.getValue('SENDER_EMAIL_ADDRESS'),
          clientId: this.getValue('MAILING_SERVICE_CLIENT_ID'),
          clientSecret: this.getValue('MAILING_SERVICE_CLIENT_SECRET'),
          refreshToken: this.getValue('MAILING_SERVICE_REFRESH_TOKEN'),
          accessToken: this.getValue('MAILING_SERVICE_ACCESS_TOKEN'),
          expires: new Date(this.getValue('MAILING_EXPIRES_IN')),
        },
      },
      defaults: {
        from: this.getValue('MAILING_DEFAULT_FROM'),
      },
      preview: true,
      template: {
        dir: __dirname + '/../mail/templates',
        adapter: new HandlebarsAdapter(/* helpers */ undefined, {
          inlineCssEnabled: true,
          /** See https://www.npmjs.com/package/inline-css#api */
          inlineCssOptions: {
            url: ' ',
            preserveMediaQueries: true,
          },
        }),
        options: {
          strict: true,
        },
      },
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
]);

export { configService };
