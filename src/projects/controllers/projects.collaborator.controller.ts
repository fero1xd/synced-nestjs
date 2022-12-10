import {
  Controller,
  UseGuards,
  Patch,
  Body,
  Inject,
  Get,
  Post,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/utils/Guards';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm/entities';
import { RemoveCollaborator } from '../dtos/RemoveCollaborator';
import { TransferOwnership } from '../dtos/TransferOwnership';
import { ProjectsService } from '../projects.service';

@Controller(Routes.PROJECTS)
@UseGuards(AuthenticatedGuard)
export class ProjectsCollaboratorController {
  constructor(
    @Inject(Services.PROJECTS_SERVICE)
    private readonly projectsService: ProjectsService,
  ) {}

  @Post('transfer')
  async transferOwnership(
    @AuthUser() user: User,
    @Body() data: TransferOwnership,
  ) {
    return await this.projectsService.transferOwnership({ user, ...data });
  }

  @Patch('collaborator/remove')
  async removeCollaborator(
    @AuthUser() user: User,
    @Body() data: RemoveCollaborator,
  ) {
    return await this.projectsService.removeCollaborator({ user, ...data });
  }
}
