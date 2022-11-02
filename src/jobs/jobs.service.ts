import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Job } from 'src/utils/typeorm/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateJobParams,
  GetAllJobsParams,
  GetJobByIdParams,
} from 'src/utils/types';
import { Queues, Services } from 'src/utils/constants';
import { FileManagerService } from 'src/file-manager/file-manager.service';
import { AvailableExtensions, AvailableLanguages } from 'src/utils/enums';
import { ProjectsService } from 'src/projects/projects.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    @Inject(Services.PROJECTS_SERVICE)
    private readonly projectsService: ProjectsService,
    @Inject(Services.FILE_MANAGER_SERVICE)
    private readonly fileManagerService: FileManagerService,
    @InjectQueue(Queues.JOBS) private readonly jobsQueue: Queue,
  ) {}

  async createJob(params: CreateJobParams) {
    const { projectId, user } = params;

    const project = await this.projectsService.getProjectById({
      id: projectId,
      user,
    });

    const { language, code } = project;

    const extension = this.getExtensionByLanguage(language);

    const filePath = await this.fileManagerService.generateFile({
      extension,
      code,
    });

    const job = await this.jobRepository.save(
      this.jobRepository.create({
        filePath,
        project,
      }),
    );

    await this.jobsQueue.add('process', {
      job,
      user,
    });

    return job;
  }

  async getAllJobs(params: GetAllJobsParams) {
    const { id, user } = params;

    return await this.jobRepository.find({
      where: { project: { id, owner: { id: user.id } } },
      order: {
        submittedAt: 'DESC',
      },
    });
  }

  async getJobById(params: GetJobByIdParams) {
    const { id, user } = params;

    const job = await this.jobRepository.findOne({
      where: { id, project: { owner: { id: user.id } } },
      relations: ['project'],
    });

    if (!job) throw new NotFoundException('Job not found');

    return { ...job };
  }

  getExtensionByLanguage(language: AvailableLanguages) {
    return AvailableExtensions[language.toUpperCase()];
  }
}
