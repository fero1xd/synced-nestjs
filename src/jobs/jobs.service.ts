import { Injectable, Inject } from '@nestjs/common';
import { Job, User } from 'src/utils/typeorm/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobParams, GetJobByIdParams } from 'src/utils/types';
import { Services } from 'src/utils/constants';
import { FileManagerService } from 'src/file-manager/file-manager.service';
import { AvailableExtensions, AvailableLanguages } from 'src/utils/enums';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    @Inject(Services.FILE_MANAGER_SERVICE)
    private readonly fileManagerService: FileManagerService,
  ) {}

  async createJob(params: CreateJobParams) {
    const { language, user, code } = params;

    const extension = this.getExtensionByLanguage(language);

    const filePath = await this.fileManagerService.generateFile({
      extension,
      code,
    });

    const job = this.jobRepository.create({
      language,
      filePath,
      user,
    });

    return await this.jobRepository.save(job);
  }

  async getAllJobs(user: User) {
    return await this.jobRepository.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
  }

  async getJobById(params: GetJobByIdParams) {
    const { id, user } = params;

    return await this.jobRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['user'],
    });
  }

  getExtensionByLanguage(language: AvailableLanguages) {
    if (language === AvailableLanguages.PYTHON)
      return AvailableExtensions.PYTHON;
  }
}
