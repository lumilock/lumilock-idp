import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as connectPg from 'connect-pg-simple';
import * as pg from 'pg';

import { AppModule } from './app.module';
import { configService } from './config/config.service';

const pgSession = connectPg(session);

const pgPool = new pg.Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
});

async function bootstrap() {
  // loading ssl cert and key
  const key = fs.readFileSync(
    __dirname + '/cert/CA/localhost/localhost.decrypted.key',
  );
  const cert = fs.readFileSync(__dirname + '/cert/CA/localhost/localhost.crt');

  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: key,
      cert: cert,
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  app.use(cookieParser());
  // session
  app.use(
    session({
      name: 'LUMILOCK_IDP_SESSION_ID',
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      rolling: true, // keep session alive
      cookie: {
        maxAge: parseInt(process.env.TOKEN_DURATION, 10) * 1000, // session expires in 1hr, refreshed by `rolling: true` option.
        httpOnly: true, // so that cookie can't be accessed via client-side script
        secure: false,
      },
      store: new pgSession({
        pool: pgPool, // Connection pool
        tableName: 'user_sessions', // Use another table-name than the default "session" one
        // Insert connect-pg-simple options here
      }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  if (!configService.isProduction()) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Item API')
        .setDescription('My Item API')
        .build(),
    );

    SwaggerModule.setup('docs', app, document);
  }
  await app.listen(3000);
}
bootstrap();
