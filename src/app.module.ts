import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import entities from './utils/typeorm/entities';
import { PassportModule } from '@nestjs/passport';
import { JobsModule } from './jobs/jobs.module';
import { GatewayModule } from './gateway/gateway.module';
import { BullModule } from '@nestjs/bull';
import { ProjectsModule } from './projects/project.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MY_SQL_HOST,
      port: parseInt(process.env.MY_SQL_PORT),
      username: process.env.MY_SQL_USERNAME,
      password: process.env.MY_SQL_PASSWORD,
      database: process.env.MY_SQL_DB_NAME,
      synchronize: true,
      entities,
    }),
    PassportModule.register({ session: true }),
    AuthModule,
    ProjectsModule,
    JobsModule,
    GatewayModule,
  ],
})
export class AppModule {}
