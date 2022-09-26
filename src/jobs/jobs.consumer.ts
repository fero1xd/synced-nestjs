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
import { PythonRunner } from './runners/python.runner';

@Processor(Queues.JOBS)
export class JobsConsumer {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(JobRepository)
    private readonly jobRepository: Repository<JobRepository>,
    @Inject(Services.PYTHON_RUNNER)
    private readonly pythonRunner: PythonRunner,
  ) {}

  @Process('process')
  async handleTranscode(job: Job<unknown>) {
    const { job: createdJob, user } = <JobPayload>job.data;
    const newJob = { ...createdJob };

    newJob.startedAt = new Date();

    try {
      const { output } = (await this.pythonRunner.run(
        newJob.filePath,
      )) as RunnerOutput;

      newJob.compiledAt = new Date();
      newJob.output = JSON.parse(JSON.stringify(output));
      newJob.status = JobStatus.SUCCESS;
    } catch (e) {
      const { error } = e;
      newJob.compiledAt = new Date();
      newJob.output = error;
      newJob.status = JobStatus.ERROR;
    }

    await this.jobRepository.save(newJob);

    this.eventEmitter.emit(Events.OnJobDone, { job: newJob, user });
  }
}
