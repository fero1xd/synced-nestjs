import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { AvailableLanguages } from 'src/utils/enums';

export class CreateProject {
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @IsEnum(AvailableLanguages)
  language: AvailableLanguages;

  @IsNotEmpty()
  code: string;
}
