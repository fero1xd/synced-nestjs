import {
  Controller,
  Post,
  Get,
  Patch,
  UseGuards,
  Body,
  Inject,
  Param,
  Delete,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { AuthenticatedGuard } from 'src/auth/utils/Guards';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm/entities';
import { CreateProject } from './dtos/CreateProject';
import { UpdateProject } from './dtos/UpdateProject';
import { ProjectsService } from './projects.service';

@Controller(Routes.PROJECTS)
@UseGuards(AuthenticatedGuard)
export class ProjectsController {
  constructor(
    @Inject(Services.PROJECTS_SERVICE)
    private readonly projectsService: ProjectsService,
  ) {}

  @Get()
  async getAllProjects(@AuthUser() user: User) {
    return instanceToPlain(await this.projectsService.getAllProjects(user));
  }

  @Get(':id')
  async getProjectById(@AuthUser() user: User, @Param('id') id: string) {
    return instanceToPlain(
      await this.projectsService.getProjectById({ id, user }),
    );
  }

  @Post()
  async createProject(@AuthUser() user: User, @Body() data: CreateProject) {
    return instanceToPlain(
      await this.projectsService.createProject({ ...data, user }),
    );
  }

  @Patch()
  async updateProject(@AuthUser() user: User, @Body() data: UpdateProject) {
    return instanceToPlain(
      await this.projectsService.saveProject({ ...data, user }),
    );
  }

  @Delete(':id')
  async deleteProject(@AuthUser() user: User, @Param('id') id: string) {
    await this.projectsService.deleteProject({ id, user });
    return { status: 'success' };
  }
}
