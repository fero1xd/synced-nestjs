import { AvailableLanguages } from 'src/utils/enums';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Job } from './Job';
import { User } from './User';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: AvailableLanguages,
  })
  language: AvailableLanguages;

  @Column()
  code: string;

  @ManyToOne(() => User)
  owner: User;
}
