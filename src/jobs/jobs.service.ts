import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Job, User } from 'src/utils/typeorm/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateJobParams,
  GetAllJobsParams,
  GetJobByIdParams,
} from 'src/utils/types';
import { Events, Queues, Services } from 'src/utils/constants';
import { FileManagerService } from 'src/file-manager/file-manager.service';
import {
  AvailableExtensions,
  AvailableLanguages,
  JobStatus,
} from 'src/utils/enums';
import { ProjectsService } from 'src/projects/projects.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    @Inject(Services.PROJECTS_SERVICE)
    private readonly projectsService: ProjectsService,
    @Inject(Services.FILE_MANAGER_SERVICE)
    private readonly fileManagerService: FileManagerService,
    @InjectQueue(Queues.JOBS) private readonly jobsQueue: Queue,
    private eventEmitter: EventEmitter2,
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
        project,
      }),
    );

    this.jobsQueue.add('process', {
      job,
      filePath,
      user,
    });

    if (project.isPublic) this.eventEmitter.emit(Events.OnJobCreate, user, job);

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

  async clearJobs({ projectId, user }: { projectId: string; user: User }) {
    const project = await this.projectsService.projectExists(
      null,
      user,
      projectId,
    );
    if (!project) throw new NotFoundException('Project not found');
    if (project.owner.id !== user.id) throw new UnauthorizedException();

    const jobs = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.project', 'project')
      .leftJoinAndSelect('project.owner', 'owner')
      .where(
        'project.id = :id AND owner.id = :userId AND job.status != :status',
        {
          id: projectId,
          userId: user.id,
          status: JobStatus.PENDING,
        },
      )
      .getMany();

    await this.jobRepository.remove(jobs);
  }

  getExtensionByLanguage(language: AvailableLanguages) {
    return AvailableExtensions[language.toUpperCase()];
  }
}
