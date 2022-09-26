import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queues, Services } from 'src/utils/constants';
import { Job, User } from 'src/utils/typeorm/entities';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { FileManagerModule } from 'src/file-manager/file-manager.module';
import { ProjectsModule } from 'src/projects/project.module';
import { BullModule } from '@nestjs/bull';
import { JobsConsumer } from './jobs.consumer';
import { PythonRunner } from './runners/python.runner';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Job]),
    FileManagerModule,
    ProjectsModule,
    BullModule.registerQueue({
      name: Queues.JOBS,
    }),
  ],
  controllers: [JobsController],
  providers: [
    {
      provide: Services.JOBS_SERVICE,
      useClass: JobsService,
    },
    {
      provide: Services.PYTHON_RUNNER,
      useClass: PythonRunner,
    },
    JobsConsumer,
  ],
})
export class JobsModule {}
