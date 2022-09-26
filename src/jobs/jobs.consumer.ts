import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Queues } from 'src/utils/constants';

@Processor(Queues.JOBS)
export class JobsConsumer {
  @Process('process')
  handleTranscode(job: Job<unknown>) {
    console.log(job.data);
  }
}
