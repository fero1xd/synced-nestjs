import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Services } from 'src/utils/constants';
import { Project } from 'src/utils/typeorm/entities';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsCollaboratorController } from './controllers/projects.collaborator.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), UsersModule],
  controllers: [ProjectsController, ProjectsCollaboratorController],
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
