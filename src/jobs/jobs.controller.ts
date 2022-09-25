import {
  Controller,
  Inject,
  Get,
  UseGuards,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/utils/Guards';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm/entities';
import { CreateJob } from './dtos/CreateJob';
import { JobsService } from './jobs.service';
import { instanceToPlain } from 'class-transformer';

@Controller(Routes.JOBS)
@UseGuards(AuthenticatedGuard)
export class JobsController {
  constructor(
    @Inject(Services.JOBS_SERVICE) private readonly jobsService: JobsService,
  ) {}

  @Post()
  async createJob(@AuthUser() user: User, @Body() data: CreateJob) {
    return instanceToPlain(await this.jobsService.createJob({ user, ...data }));
  }

  @Get()
  async getAllJobs(@AuthUser() user: User) {
    return instanceToPlain(await this.jobsService.getAllJobs(user));
  }

  @Get('/:id')
  async getJobById(@AuthUser() user: User, @Param('id') id: string) {
    return instanceToPlain(await this.jobsService.getJobById({ id, user }));
  }
}
