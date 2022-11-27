import { IsNotEmpty } from 'class-validator';

export class DeleteJobs {
  @IsNotEmpty()
  projectId: string;
}
