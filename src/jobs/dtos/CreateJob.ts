import { IsEnum, IsNotEmpty } from 'class-validator';
import { AvailableLanguages } from 'src/utils/enums';

export class CreateJob {
  @IsEnum(AvailableLanguages)
  language: AvailableLanguages;

  @IsNotEmpty()
  code: string;
}
