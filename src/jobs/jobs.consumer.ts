import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Events, Queues, Services } from 'src/utils/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JobPayload, RunnerOutput } from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Job as JobRepository } from 'src/utils/typeorm/entities';
import { Repository } from 'typeorm';
import { JobStatus } from 'src/utils/enums';
import { Inject } from '@nestjs/common';
import { Runner } from './runners/runner';

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
    console.log('i am here');

    try {
      const { output } = (await this.runner.run(
        newJob.filePath,
        newJob.project.language,
      )) as RunnerOutput;

      newJob.compiledAt = new Date();
      newJob.output = JSON.parse(JSON.stringify(output));
      newJob.status = JobStatus.SUCCESS;
    } catch (e) {
      const { error } = e;

      newJob.compiledAt = new Date();

      newJob.output = error || 'Unexepected Error';
      newJob.status = JobStatus.ERROR;
    }

    await this.jobRepository.save(newJob);

    this.eventEmitter.emit(Events.OnJobDone, {
      job: { ...newJob, project: undefined, filePath: undefined },
      user,
    });
  }
}
