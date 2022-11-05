import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Events, Queues, Services } from 'src/utils/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JobPayload } from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Job as JobRepository } from 'src/utils/typeorm/entities';
import { Repository } from 'typeorm';
import { AvailableLanguages, JobStatus } from 'src/utils/enums';
import { Inject } from '@nestjs/common';
import { Runner } from './runners/runner';
import { fromFile } from 'wandbox-api-updated';

@Processor(Queues.JOBS)
export class JobsConsumer {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(JobRepository)
    private readonly jobRepository: Repository<JobRepository>,
    @Inject(Services.RUNNER)
    private readonly runner: Runner,
  ) {}

  @Process('process')
  async handleTranscode(job: Job<unknown>) {
    const { job: createdJob, user } = <JobPayload>job.data;
    const newJob = { ...createdJob };

    newJob.startedAt = new Date();

    const compiler = this.getCompiler(newJob.project.language);

    try {
      const result = await fromFile(newJob.filePath, {
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
    } catch (e) {
      newJob.output = 'Unexpected Error';
      newJob.status = JobStatus.ERROR;
    }

    newJob.compiledAt = new Date();
    await this.jobRepository.save(newJob);

    this.eventEmitter.emit(Events.OnJobDone, {
      job: {
        ...newJob,
        project: undefined,
        filePath: undefined,
        code: undefined,
      },
      user,
    });
  }

  getCompiler(language: AvailableLanguages) {
    switch (language) {
      case AvailableLanguages.PYTHON:
        return 'cpython-3.10.2';
      case AvailableLanguages.JAVASCRIPT:
        return 'nodejs-16.14.0';
      case AvailableLanguages.JAVA:
        return 'openjdk-jdk-15.0.3+2';
    }
  }
}
