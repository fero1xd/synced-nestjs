import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { AvailableLanguages } from 'src/utils/enums';

export class CreateProject {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsEnum(AvailableLanguages)
  language: AvailableLanguages;

  @IsOptional()
  code?: string;

  @IsOptional()
  description: string;
}
