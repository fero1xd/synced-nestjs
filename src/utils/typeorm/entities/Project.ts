import { Exclude } from 'class-transformer';
import { AvailableLanguages } from 'src/utils/enums';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
    default: AvailableLanguages.PYTHON,
  })
  language: AvailableLanguages;

  @Column({ type: 'longtext' })
  @Exclude()
  code: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => User)
  @Exclude()
  owner: User;
}
