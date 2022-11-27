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
import { instanceToPlain, plainToClass } from 'class-transformer';
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
  async getPrivateProjects(@AuthUser() user: User) {
    return instanceToPlain(
      await this.projectsService.getAllProjects(user, false),
    );
  }

  @Get('/public')
  async getPublicProjects(@AuthUser() user: User) {
    return instanceToPlain(
      await this.projectsService.getAllProjects(user, true),
    );
  }

  @Get(':id')
  async getProjectById(@AuthUser() user: User, @Param('id') id: string) {
    return await this.projectsService.getProjectById({ id, user });
  }

  @Post()
  async createProject(@AuthUser() user: User, @Body() data: CreateProject) {
    return instanceToPlain(
      await this.projectsService.createProject({ ...data, user }),
    );
  }

  @Patch(':id')
  async updateProject(
    @AuthUser() user: User,
    @Body() data: UpdateProject,
    @Param('id') id: string,
  ) {
    return await this.projectsService.saveProject({ user, id, ...data });
  }

  @Delete(':id')
  async deleteProject(@AuthUser() user: User, @Param('id') id: string) {
    await this.projectsService.deleteProject({ id, user });
    return { status: 'success' };
  }
}
