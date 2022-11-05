import { Injectable } from '@nestjs/common';
import { AvailableLanguages } from 'src/utils/enums';

@Injectable()
export class Runner {
  async run(path: string, language: AvailableLanguages) {}
}
