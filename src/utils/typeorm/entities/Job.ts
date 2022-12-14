import { Exclude } from 'class-transformer';
import { JobStatus } from 'src/utils/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './Project';
import { User } from './User';

@Entity({ name: 'jobs' })
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  submittedAt: Date;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  compiledAt: Date;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.PENDING })
  status: JobStatus;

  @Column({ nullable: true, type: 'longtext' })
  output: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @Exclude()
  project: Project;

  @ManyToOne(() => User)
  @JoinColumn()
  executedBy: User;
}