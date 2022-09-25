import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashingModule } from 'src/hashing/hashing.module';
import { UsersModule } from 'src/users/users.module';
import { Services } from 'src/utils/constants';
import { User } from 'src/utils/typeorm/entities';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './utils/LocalStrategy';
import { SessionSerializer } from './utils/SessionSerializer';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HashingModule, UsersModule],
  controllers: [AuthController],
  providers: [
    {
      provide: Services.AUTH_SERVICE,
      useClass: AuthService,
    },
    LocalStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
