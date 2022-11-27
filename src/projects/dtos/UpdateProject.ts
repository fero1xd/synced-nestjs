import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { AvailableLanguages } from 'src/utils/enums';

export class UpdateProject {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEnum(AvailableLanguages)
  language: AvailableLanguages;

  @IsOptional()
  description: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  code: string;
}
