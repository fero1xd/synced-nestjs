import { Exclude } from 'class-transformer';
import { JobStatus } from 'src/utils/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Project } from './Project';

@Entity({ name: 'jobs' })
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Exclude()
  filePath: string;

  @CreateDateColumn()
  submittedAt: Date;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  compiledAt: Date;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.PENDING })
  status: JobStatus;

  @Column({ nullable: true })
  output: string;

  @ManyToOne(() => Project)
  project: Project;
}
