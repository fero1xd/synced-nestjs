import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { Job, User } from 'src/utils/typeorm/entities';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Job])],
  controllers: [JobsController],
  providers: [
    {
      provide: Services.JOBS_SERVICE,
      useClass: JobsService,
    },
  ],
})
export class JobsModule {}
