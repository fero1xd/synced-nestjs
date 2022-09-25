import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashingModule } from 'src/hashing/hashing.module';
import { Services } from 'src/utils/constants';
import { User } from 'src/utils/typeorm/entities';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HashingModule],
  providers: [
    {
      provide: Services.USERS_SERVICE,
      useClass: UsersService,
    },
  ],
  exports: [
    {
      provide: Services.USERS_SERVICE,
      useClass: UsersService,
    },
  ],
})
export class UsersModule {}
