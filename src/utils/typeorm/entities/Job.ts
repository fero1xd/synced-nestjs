import { Exclude } from 'class-transformer';
import { AvailableLanguages, JobStatus } from 'src/utils/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'jobs' })
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: AvailableLanguages,
  })
  language: AvailableLanguages;

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

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
