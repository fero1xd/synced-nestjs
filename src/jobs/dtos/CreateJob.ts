import { IsNotEmpty } from 'class-validator';

export class CreateJob {
  @IsNotEmpty()
  projectId: string;
}
