import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Events, Queues } from 'src/utils/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JobPayload } from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Job as JobRepository } from 'src/utils/typeorm/entities';
import { Repository } from 'typeorm';
import {
  AvailableCompilers,
  AvailableLanguages,
  JobStatus,
} from 'src/utils/enums';
import { fromFile } from 'wandbox-api-updated';
import { unlinkSync } from 'fs';

@Processor(Queues.JOBS)
export class JobsConsumer {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(JobRepository)
    private readonly jobRepository: Repository<JobRepository>,
  ) {}

  @Process({ name: 'process', concurrency: 100 })
  async handleTranscode(job: Job<unknown>) {
    const { job: createdJob, filePath, user } = <JobPayload>job.data;
    const newJob = { ...createdJob };

    newJob.startedAt = new Date();

    const compiler = this.getCompiler(newJob.project.language);

    try {
      const result = await fromFile(filePath, {
        code: '',
        compiler,
        save: false,
      });

      newJob.compiledAt = new Date();
      // @ts-ignore
      if (result.status === '0') {
        newJob.output = result.program_output;
        newJob.status = JobStatus.SUCCESS;
        // @ts-ignore
      } else {
        newJob.output = result.compiler_error || result.program_error;
        newJob.status = JobStatus.ERROR;
      }

      unlinkSync(filePath);
    } catch (e) {
      newJob.output = 'Unexpected Error';
      newJob.status = JobStatus.ERROR;
    }

    newJob.compiledAt = new Date();
    await this.jobRepository.save(newJob);

    this.eventEmitter.emit(Events.OnJobDone, {
      job: newJob,
      user,
    });
  }

  getCompiler(language: AvailableLanguages): AvailableCompilers {
    return AvailableCompilers[language.toUpperCase()];
  }
}
