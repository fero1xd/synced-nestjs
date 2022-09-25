import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Length, IsEmail } from 'class-validator';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  name: string;

  @Column()
  @Length(3, 32)
  @Exclude()
  password: string;
}
