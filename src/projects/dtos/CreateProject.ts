import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { AvailableLanguages } from 'src/utils/enums';

export class CreateProject {
  @IsNotEmpty()
  @MaxLength(12)
  name: string;

  @IsEnum(AvailableLanguages)
  language: AvailableLanguages;

  @IsOptional()
  code?: string;

  @IsOptional()
  @IsBoolean()
  isPublic: boolean;

  @IsOptional()
  description: string;
}
