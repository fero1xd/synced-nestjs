import { IsNotEmpty, MaxLength, Length, IsEmail } from 'class-validator';

export class CreateUser {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MaxLength(32)
  name: string;

  @IsNotEmpty()
  @Length(3, 32)
  password: string;
}
