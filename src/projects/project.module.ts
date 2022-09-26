import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { Project } from 'src/utils/typeorm/entities';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectsController],
  providers: [
    {
      provide: Services.PROJECTS_SERVICE,
      useClass: ProjectsService,
    },
  ],
  exports: [
    {
      provide: Services.PROJECTS_SERVICE,
      useClass: ProjectsService,
    },
  ],
})
export class ProjectsModule {}
