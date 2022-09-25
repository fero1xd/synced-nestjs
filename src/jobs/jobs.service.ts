import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Job, User } from 'src/utils/typeorm/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobParams, GetJobByIdParams } from 'src/utils/types';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
  ) {}

  async createJob(params: CreateJobParams) {
    const { language, user } = params;

    const testFilePath = 'testpath';

    const job = this.jobRepository.create({
      language,
      filePath: testFilePath,
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
}
