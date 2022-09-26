import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { AvailableLanguages } from 'src/utils/enums';

export class UpdateProject {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  @IsEnum(AvailableLanguages)
  language: AvailableLanguages;

  @IsOptional()
  code: string;
}
