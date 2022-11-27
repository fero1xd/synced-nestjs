import { Exclude } from 'class-transformer';
import { AvailableLanguages } from 'src/utils/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({
    type: 'enum',
    enum: AvailableLanguages,
    default: AvailableLanguages.PYTHON,
  })
  language: AvailableLanguages;

  @Column({ type: 'longtext' })
  @Exclude()
  code: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => User, {
    cascade: ['insert', 'remove'],
  })
  @JoinTable()
  collaborators: User[];

  @ManyToOne(() => User)
  @Exclude()
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
