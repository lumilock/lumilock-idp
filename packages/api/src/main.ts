import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

// import * as fs from 'fs';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as connectPg from 'connect-pg-simple';
import * as pg from 'pg';

import { AppModule } from './app.module';
import { configService } from './config/config.service';
import { exceptionFactoryDto } from './common/exceptions';

const pgSession = connectPg(session);

// Postgresql DB config
const pgPool = new pg.Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
});

async function bootstrap() {
  // ! deprecated
  // loading ssl cert and key
  // const key = fs.readFileSync(
  //   __dirname + '/cert/CA/localhost/localhost.decrypted.key',
  // );
  // const cert = fs.readFileSync(__dirname + '/cert/CA/localhost/localhost.crt');

  // Initialisation of the nest app
  const app = await NestFactory.create(AppModule, {
    // httpsOptions: {
    // key: key,
    // cert: cert,
    // },
  });

  // Adding microservice to the nest app
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: process.env.MICROSERVICE_HOST,
      port: process.env.MICROSERVICE_PORT,
    },
  });

  // Cors configuration
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'Cache'],
    exposedHeaders: ['*', 'Authorization'],
  });

  // Global pip to check all field and display exceptions
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: exceptionFactoryDto,
    }),
  );

  // Adding cookieParser package to Nest app
  app.use(cookieParser());
  // Adding and configuring session package to Nest App
  app.use(
    session({
      name: process.env.SESSION_ID_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      rolling: true, // keep session alive
      cookie: {
        maxAge: parseInt(process.env.REFRESH_TOKEN_DURATION, 10) * 1000, // session expires in 1hr, refreshed by `rolling: true` option.
        httpOnly: true, // so that cookie can't be accessed via client-side script
        secure: false,
      },
      store: new pgSession({
        pool: pgPool, // Connection pool
        tableName: 'user_sessions', // Use another table-name than the default "session" one
      }),
    }),
  );

  // Adding passport and link session to the Nest app
  app.use(passport.initialize());
  app.use(passport.session());

  // Create a global prefix for the Nest app '/api' before all routes
  app.setGlobalPrefix('api');

  // Generate swagger doc only in dev mode
  if (!configService.isProduction()) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Lumilock API')
        .setDescription('All lumilock routes and Items API')
        .build(),
    );
    // Define the route
    SwaggerModule.setup('api/docs', app, document);
  }

  // Starting the microservice and the Nest app
  await app.startAllMicroservices();
  await app.listen(process.env.PORT);
}
bootstrap();
