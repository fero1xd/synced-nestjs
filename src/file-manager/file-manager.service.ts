import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { GenerateFileParams } from 'src/utils/types';
import { v4 as uuid } from 'uuid';
import { writeFileSync } from 'fs';

@Injectable()
export class FileManagerService {
  async generateFile(params: GenerateFileParams) {
    const { extension, code } = params;

    const fileId = uuid();
    const fileName = `${fileId}.${extension}`;

    const filePath = join(process.env.CODES_DIRECTORY, fileName);

    await writeFileSync(filePath, code);

    return filePath;
  }
}
