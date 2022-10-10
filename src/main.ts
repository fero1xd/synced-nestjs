import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

import { getRepository } from 'typeorm';
import { Session } from './utils/typeorm/entities';
import { TypeormStore } from 'typeorm-store';
import { WebsocketAdapter } from './gateway/gateway.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');
  app.useWebSocketAdapter(new WebsocketAdapter(app));

  const { COOKIE_SECRET, MY_SQL_HOST, MY_SQL_PASSWORD } = process.env;

  const sessionRepository = getRepository(Session);

  app.use(
    session({
      secret: COOKIE_SECRET,
      saveUninitialized: false,
      resave: false,
      name: 'COMPILER_APP_SESSION_ID',
      cookie: {
        maxAge: 86400000,
      },
      store: new TypeormStore({ repository: sessionRepository }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  console.log('Hello World');
  console.log(MY_SQL_HOST);
  console.log(MY_SQL_PASSWORD);

  await app.listen(3000);
}
bootstrap();
