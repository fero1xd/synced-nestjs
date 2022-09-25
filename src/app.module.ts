import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import entities from './utils/typeorm/entities';
import { PassportModule } from '@nestjs/passport';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
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
    JobsModule,
  ],
})
export class AppModule {}
